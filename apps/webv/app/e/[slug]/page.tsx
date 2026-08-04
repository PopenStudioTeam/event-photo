"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useParams } from "next/navigation";
import { API_URL, apiFetch } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type PublicEvent = {
  slug: string;
  name: string;
  eventDate: string | null;
  coverImageUrl: string | null;
  uploadsEnabled: boolean;
};

type MediaItem = {
  id: string;
  storageKey?: string; // from DB (for admin)
  key?: string;        // from your eventRoutes
  url?: string;        // when you add presigned GET
  type?: "photo" | "video";
  mimeType?: string;
  fileSize?: number;
  guestName?: string | null;
  caption?: string | null;
  createdAt?: string;
};

type MediaResponse = {
  items: MediaItem[];
  nextCursor: string | null;
};

export default function GuestEventPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [event, setEvent] = useState<PublicEvent | null>(null);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [eventError, setEventError] = useState<string | null>(null);

  // Upload form state
  const [guestName, setGuestName] = useState("");
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  // Gallery state
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [mediaCursor, setMediaCursor] = useState<string | null>(null);
  const [mediaHasMore, setMediaHasMore] = useState(false);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    const loadEvent = async () => {
      setLoadingEvent(true);
      setEventError(null);
      try {
        // GET /e/:slug (publicEventRoutes.get("/:slug"))
        const res = await apiFetch(`/e/${slug}`);
        setEvent(res as PublicEvent);
      } catch (err) {
        console.error(err);
        setEventError("Failed to load event.");
      } finally {
        setLoadingEvent(false);
      }
    };

    if (slug) {
      loadEvent();
      loadMedia(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const loadMedia = async (initial = false) => {
    if (!slug) return;

    setLoadingMedia(true);
    try {
      const query = new URLSearchParams();
      if (!initial && mediaCursor) {
        query.set("cursor", mediaCursor);
      }

      // GET /e/:slug/media (publicEventRoutes.get("/:slug/media"))
      const res = await apiFetch(
        query.toString() ? `/e/${slug}/media?${query.toString()}` : `/e/${slug}/media`
      );

      const { items, nextCursor } = res as MediaResponse;

      if (initial) {
        setMedia(items);
      } else {
        setMedia((prev) => [...prev, ...items]);
      }

      setMediaCursor(nextCursor);
      setMediaHasMore(Boolean(nextCursor));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMedia(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setUploadError(null);
    setUploadSuccess(null);
  };

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!file || !event || !event.uploadsEnabled) return;

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const contentType = file.type || "image/jpeg";
      const fileSize = file.size;

      // 1) Get presigned PUT URL: POST /e/:slug/upload-url (publicMediaUploadRoutes)
      const presign = await apiFetch(`/e/${slug}/upload-url`, {
        method: "POST",
        body: JSON.stringify({ contentType, fileSize }),
      });

      const { uploadUrl, key } = presign as {
        uploadUrl: string;
        key: string;
        type: string;
      };

      // 2) Upload file to R2 using PUT
      const putRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": contentType },
        body: file,
      });

      if (!putRes.ok) {
        throw new Error("Upload to storage failed");
      }

      // 3) Create media record: POST /e/:slug/media (publicEventRoutes.post("/:slug/media"))
      await apiFetch(`/e/${slug}/media`, {
        method: "POST",
        body: JSON.stringify({
          key,
          contentType,
          fileSize,
          guestName: guestName || undefined,
          caption: caption || undefined,
        }),
      });

      setUploadSuccess("Photo uploaded successfully!");
      setFile(null);
      setCaption("");
      // Refresh gallery (initial=true to reset cursor)
      loadMedia(true);
    } catch (err) {
      console.error(err);
      setUploadError("Failed to upload photo. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const baseWebUrl =
    process.env.NEXT_PUBLIC_BASE_WEB_URL ?? "http://localhost:3000";

  if (loadingEvent) {
    return (
      <div className="flex-1 p-6">
        <div className="text-sm text-muted-foreground">Loading event…</div>
      </div>
    );
  }

  if (eventError || !event) {
    return (
      <div className="flex-1 p-6">
        <div className="text-sm text-red-500">
          {eventError ?? "Event not found"}
        </div>
      </div>
    );
  }

  const eventUrl = `${baseWebUrl}/e/${event.slug}`;

  return (
    <div className="flex-1 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Event header */}
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">{event.name}</h1>
          <div className="text-sm text-muted-foreground">
            {event.eventDate
              ? new Date(event.eventDate).toLocaleDateString()
              : "No date set"}
          </div>
          <div className="text-xs text-muted-foreground break-all">
            Event link: {eventUrl}
          </div>
        </div>

        {/* Cover image */}
        {event.coverImageUrl && (
          <div className="w-full overflow-hidden rounded-lg border bg-muted">
            <img
              src={event.coverImageUrl}
              alt="Event cover"
              className="w-full h-64 object-cover"
            />
          </div>
        )}

        {/* Upload form */}
        <section className="rounded-lg border bg-background p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Upload your photo</h2>
            <span className="text-xs text-muted-foreground">
              Uploads: {event.uploadsEnabled ? "Enabled" : "Disabled"}
            </span>
          </div>

          {event.uploadsEnabled ? (
            <form className="space-y-3 text-sm" onSubmit={handleUpload}>
              <div className="space-y-1">
                <label className="text-xs font-medium">Your name (optional)</label>
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Guest name"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium">Caption (optional)</label>
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Say something about this photo"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium">Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="text-xs"
                />
              </div>

              <Button
                type="submit"
                size="sm"
                disabled={!file || uploading}
                className="mt-2"
              >
                {uploading ? "Uploading…" : "Upload photo"}
              </Button>

              {uploadError && (
                <div className="text-xs text-red-500 mt-2">{uploadError}</div>
              )}
              {uploadSuccess && (
                <div className="text-xs text-green-600 mt-2">
                  {uploadSuccess}
                </div>
              )}
            </form>
          ) : (
            <div className="text-sm text-muted-foreground">
              Uploads are currently disabled for this event.
            </div>
          )}
        </section>

        {/* Gallery */}
        <section className="rounded-lg border bg-background p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Event gallery</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadMedia(true)}
              disabled={loadingMedia}
            >
              Refresh
            </Button>
          </div>

          {loadingMedia && media.length === 0 ? (
            <div className="text-sm text-muted-foreground">Loading photos…</div>
          ) : media.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No photos yet. Be the first to upload!
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {media.map((item, idx) => {
                  // You currently return raw DB rows without URL; for now we skip URL use.
                  // If you later add presigned GET URLs, set `item.url` and use it here.
                  const isPhoto =
                    item.type === "photo" ||
                    (item.mimeType ?? "").startsWith("image/");
                  const label = item.guestName ?? "Guest photo";

                  // If you don't yet have URLs, you could later add a GET /e/:slug/media-with-urls.
                  const src = item.url ?? ""; // placeholder

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => openLightbox(idx)}
                      className="group relative overflow-hidden rounded-lg border bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {isPhoto && src ? (
                        <img
                          src={src}
                          alt={label}
                          className="w-full h-40 object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-40 flex items-center justify-center text-[11px] text-muted-foreground">
                          {label}
                        </div>
                      )}
                      {item.guestName && (
                        <div className="absolute inset-x-0 bottom-0 bg-black/60 px-2 py-1 text-[10px] text-white">
                          {item.guestName}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {mediaHasMore && (
                <div className="mt-3 flex justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={loadingMedia}
                    onClick={() => loadMedia(false)}
                  >
                    {loadingMedia ? "Loading…" : "Load more"}
                  </Button>
                </div>
              )}
            </>
          )}
        </section>
      </div>

      {/* Lightbox modal (note: needs real URLs later) */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-[95vw] w-full h-[90vh] rounded-xl flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {media[lightboxIndex]?.guestName
                ? `Photo by ${media[lightboxIndex].guestName}`
                : "Event photo"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-hidden flex items-center justify-center bg-muted/30 rounded-lg p-4">
            {media[lightboxIndex]?.url ? (
              <img
                src={media[lightboxIndex].url as string}
                alt={media[lightboxIndex].guestName ?? "Event photo"}
                className="max-w-full max-h-full rounded-lg object-contain"
              />
            ) : (
              <div className="text-sm text-muted-foreground">
                No image preview available.
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 border-t pt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={lightboxIndex <= 0}
              onClick={() => setLightboxIndex((i) => i - 1)}
            >
              Previous
            </Button>

            <div className="text-xs text-muted-foreground">
              {media.length > 0 ? `${lightboxIndex + 1} / ${media.length}` : "0 / 0"}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={lightboxIndex >= media.length - 1}
              onClick={() => setLightboxIndex((i) => i + 1)}
            >
              Next
            </Button>
          </div>

          <DialogFooter className="mt-3 flex justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setLightboxOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}