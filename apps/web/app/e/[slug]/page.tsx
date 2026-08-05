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
  storageKey: string;
  type: "photo" | "video";
  mimeType: string;
  fileSize: number;
  guestName: string | null;
  caption: string | null;
  createdAt: string;
  url: string;
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
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
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
    setUploadProgress(null);
  };

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!file || !event || !event.uploadsEnabled) return;

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);
    setUploadProgress(0);

    try {
      const contentType = file.type || "application/octet-stream";
      const fileSize = file.size;

      // 1) Get presigned PUT URL: POST /e/:slug/upload-url
      const presign = await apiFetch(`/e/${slug}/upload-url`, {
        method: "POST",
        body: JSON.stringify({ contentType, fileSize }),
      });

      const { uploadUrl, key } = presign as {
        uploadUrl: string;
        key: string;
        type: string;
      };

      // 2) Upload file to R2 with progress (XHR to track)
      await uploadWithProgress(uploadUrl, file, contentType);

      // 3) Create media record: POST /e/:slug/media
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

      setUploadSuccess("Media uploaded successfully!");
      setFile(null);
      setCaption("");
      setUploadProgress(null);
      loadMedia(true);
    } catch (err) {
      console.error(err);
      setUploadError("Failed to upload media. Please try again.");
      setUploadProgress(null);
    } finally {
      setUploading(false);
    }
  };

  const uploadWithProgress = (url: string, file: File, contentType: string) => {
    return new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", url);

      xhr.setRequestHeader("Content-Type", contentType);

      xhr.upload.onprogress = (event) => {
        if (!event.lengthComputable) return;
        const progress = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(progress);
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          setUploadProgress(100);
          resolve();
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      };

      xhr.onerror = () => {
        reject(new Error("Network error during upload"));
      };

      xhr.send(file);
    });
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
            <h2 className="text-sm font-semibold">Upload your media</h2>
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
                  placeholder="Say something about this media"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium">
                  File (image or video)
                </label>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="text-xs"
                />
              </div>

              <div className="flex items-center gap-3 mt-2">
                <Button
                  type="submit"
                  size="sm"
                  disabled={!file || uploading}
                >
                  {uploading ? "Uploading…" : "Upload"}
                </Button>

                {uploadProgress !== null && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <span>{uploadProgress}%</span>
                  </div>
                )}
              </div>

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
            <div className="text-sm text-muted-foreground">Loading media…</div>
          ) : media.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No media yet. Be the first to upload!
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {media.map((item, idx) => {
                  const isPhoto =
                    item.type === "photo" || item.mimeType.startsWith("image/");
                  const label = item.guestName ?? "Guest upload";

                  return (
                    <div
                      key={item.id}
                      className="group relative overflow-hidden rounded-lg border bg-muted flex flex-col"
                    >
                      <button
                        type="button"
                        onClick={() => openLightbox(idx)}
                        className="flex-1 w-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {isPhoto ? (
                          <img
                            src={item.url}
                            alt={label}
                            className="w-full h-40 object-cover transition-transform group-hover:scale-105"
                          />
                        ) : (
                          <video
                            src={item.url}
                            className="w-full h-40 object-cover"
                            muted
                            playsInline
                          />
                        )}
                      </button>

                      {item.guestName && (
                        <div className="absolute inset-x-0 bottom-0 bg-black/60 px-2 py-1 text-[10px] text-white">
                          {item.guestName}
                        </div>
                      )}

                      {item.caption && (
                        <div className="px-2 py-1 border-t bg-background/80 text-[10px] text-muted-foreground truncate">
                          {item.caption}
                        </div>
                      )}
                    </div>
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

      {/* Lightbox modal */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-[95vw] w-full h-[90vh] rounded-xl flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {media[lightboxIndex]?.guestName
                ? `Media by ${media[lightboxIndex].guestName}`
                : "Media"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-hidden flex items	center justify-center bg-muted/30 rounded-lg p-4">
            {media[lightboxIndex] ? (
              media[lightboxIndex].type === "photo" ||
              media[lightboxIndex].mimeType.startsWith("image/") ? (
                <img
                  src={media[lightboxIndex].url}
                  alt={media[lightboxIndex].guestName ?? "Media"}
                  className="max-w-full max-h-full rounded-lg object-contain"
                />
              ) : (
                <video
                  src={media[lightboxIndex].url}
                  controls
                  className="max-w-full max-h-full rounded-lg object-contain"
                />
              )
            ) : (
              <div className="text-sm text-muted-foreground">
                No media available.
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

          <DialogFooter className="mt-3 flex justify	end">
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