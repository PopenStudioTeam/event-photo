"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useParams } from "next/navigation";
import { API_URL, apiFetch } from "@/lib/api";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type Event = {
  id: string;
  name: string;
  slug: string;
  eventDate: string | null;
  uploadsEnabled: boolean;
  coverImageKey: string | null;
  coverImageUrl: string | null;
};

type Media = {
  id: string;
  key: string;
  url: string;
  guestName: string | null;
  createdAt: string;
};

export default function EventDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit modal state
  const [editOpen, setEditOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formDate, setFormDate] = useState("");

  // Cover upload state
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverUploading, setCoverUploading] = useState(false);
  const [coverError, setCoverError] = useState<string | null>(null);

  // Zoom viewer state (cover)
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Gallery state
  const [media, setMedia] = useState<Media[]>([]);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [loadingMedia, setLoadingMedia] = useState(false);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const events = await apiFetch("/events");
        const found = (events as Event[]).find((e) => e.slug === slug) ?? null;
        if (!found) {
          setError("Event not found");
        } else {
          setEvent(found);
          setFormName(found.name);
          setFormDate(found.eventDate ? found.eventDate.slice(0, 10) : "");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load event");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  const baseWebUrl = process.env.NEXT_PUBLIC_BASE_WEB_URL ?? "http://localhost:3000";

  const handleCopyLink = () => {
    if (!event) return;
    const url = `${baseWebUrl}/e/${event.slug}`;
    navigator.clipboard.writeText(url);
  };

  const handleEditSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!event) return;

    const body: Record<string, unknown> = {};
    if (formName && formName !== event.name) body.name = formName;
    if (formDate) body.eventDate = new Date(formDate).toISOString();

    if (Object.keys(body).length === 0) {
      setEditOpen(false);
      return;
    }

    try {
      const updated = await apiFetch(`/events/${slug}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      });

      // Merge with existing event to avoid losing client-only fields
      setEvent((prev) => (prev ? { ...prev, ...updated } : (updated as Event)));
      setEditOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCoverFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setCoverFile(file);
    setCoverError(null);
  };

  const handleCoverUpload = async () => {
    if (!event || !coverFile) return;

    setCoverUploading(true);
    try {
      const contentType = coverFile.type || "image/jpeg";
      const fileSize = coverFile.size;

      const presign = await apiFetch(`/events/${event.slug}/cover-url`, {
        method: "POST",
        body: JSON.stringify({ contentType, fileSize }),
      });

      const putRes = await fetch(presign.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": contentType },
        body: coverFile,
      });

      if (!putRes.ok) {
        throw new Error("Upload to R2 failed");
      }

      const updated = await apiFetch(`/events/${event.slug}`, {
        method: "PATCH",
        body: JSON.stringify({ coverImageKey: presign.key }),
      });

      // Merge instead of full replace
      setEvent((prev) => (prev ? { ...prev, ...updated } : (updated as Event)));

      setCoverFile(null);
    } catch (err) {
      console.error("Cover upload failed", err);
      setCoverError("Failed to upload cover image");
    } finally {
      setCoverUploading(false);
    }
  };

  const loadMedia = async () => {
    if (!event) return;
    setLoadingMedia(true);
    try {
      const list = await apiFetch(`/events/${event.slug}/media`);
      setMedia(list as Media[]);
      setGalleryOpen(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMedia(false);
    }
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 0.25, 3));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 0.25, 0.5));
  const handleZoomReset = () => setZoomLevel(1);

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading event…</div>;
  }

  if (error || !event) {
    return <div className="text-sm text-red-500">{error ?? "Event not found"}</div>;
  }

  const eventUrl = `${baseWebUrl}/e/${event.slug}`;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Event details */}
      <Card className="rounded-xl">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base md:text-lg">Event details</CardTitle>
          <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => setEditOpen(true)}>
            Edit
          </Button>
        </CardHeader>

        <CardContent className="space-y-3 text-sm">
          <div>
            <span className="font-medium">Name:</span> {event.name}
          </div>
          <div>
            <span className="font-medium">Date:</span>{" "}
            {event.eventDate ? new Date(event.eventDate).toLocaleDateString() : "—"}
          </div>
          <div>
            <span className="font-medium">Slug:</span> {event.slug}
          </div>
          <div>
            <span className="font-medium">Uploads:</span>{" "}
            {event.uploadsEnabled ? "Enabled" : "Disabled"}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={handleCopyLink}>
              Copy event link
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto"
              onClick={loadMedia}
              disabled={loadingMedia}
            >
              {loadingMedia ? "Loading…" : "Show all photos"}
            </Button>
          </div>

          {/* Cover upload block */}
          <div className="mt-4 space-y-2">
            <div className="font-medium text-sm">Cover image</div>

            {event.coverImageKey && (
              <button
                type="button"
                onClick={() => setZoomOpen(true)}
                className="w-full overflow-hidden rounded-lg border bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <img
                  src={event.coverImageUrl ?? ""}
                  alt="Cover"
                  className="aspect-[16/9] w-full object-cover sm:aspect-video sm:h-64"
                />
              </button>
            )}

            {event.coverImageKey && (
              <div className="text-xs text-muted-foreground break-all">
                {event.coverImageKey}
              </div>
            )}

            <div
              className={cn(
                "flex flex-col gap-3 rounded-md border border-dashed border-border bg-muted/50 px-3 py-3 sm:flex-row sm:items-center"
              )}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverFileChange}
                className="w-full text-xs file:mr-3 file:rounded-md file:border-0 file:bg-background file:px-3 file:py-1.5 file:text-xs"
              />
              <Button
                size="sm"
                variant="secondary"
                className="w-full shrink-0 sm:w-auto"
                onClick={handleCoverUpload}
                disabled={!coverFile || coverUploading}
              >
                {coverUploading ? "Uploading…" : "Upload cover"}
              </Button>
            </div>

            {coverError && (
              <div className="text-xs text-red-500">{coverError}</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* QR card */}
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="text-base md:text-lg">QR code</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="mx-auto flex aspect-square w-full max-w-[14rem] items-center justify-center overflow-hidden rounded-lg border bg-white sm:max-w-[16rem]">
            <img
              src={`${API_URL}/qr/${event.slug}`}
              alt="Event QR"
              className="h-full w-full object-contain p-2"
            />
          </div>
          <div className="break-all text-xs text-muted-foreground">{eventUrl}</div>
        </CardContent>
      </Card>

      {/* Edit modal */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-[calc(100%-2rem)] rounded-xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit event</DialogTitle>
          </DialogHeader>

          <form className="space-y-3 pt-2 text-sm" onSubmit={handleEditSubmit}>
            <div className="space-y-1">
              <label className="text-xs font-medium">Name</label>
              <input
                className="w-full rounded-md border px-3 py-2 text-sm"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium">Date</label>
              <input
                type="date"
                className="w-full rounded-md border px-3 py-2 text-sm"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
              />
            </div>

            <DialogFooter className="mt-4 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setEditOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Zoom modal (cover image) */}
      <Dialog
        open={zoomOpen}
        onOpenChange={(open) => {
          setZoomOpen(open);
          if (!open) setZoomLevel(1);
        }}
      >
        <DialogContent className="flex h-[95vh] max-h-[95vh] w-[95vw] max-w-[95vw] flex-col gap-0 overflow-hidden rounded-xl p-0 sm:max-w-[95vw]">
          <DialogHeader className="shrink-0 border-b px-4 py-3 sm:px-6">
            <DialogTitle>Cover image</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-3 border-b px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="break-all text-xs text-muted-foreground">
              {event.coverImageKey ?? ""}
            </div>
            <div className="flex items-center justify-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={handleZoomOut}>
                -
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={handleZoomReset}>
                Reset
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={handleZoomIn}>
                +
              </Button>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-muted/30 p-3 sm:p-6">
            {event.coverImageUrl ? (
              <img
                src={event.coverImageUrl}
                alt="Cover"
                className="max-h-full max-w-full rounded-lg object-contain transition-transform duration-150"
                style={{
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: "center center",
                }}
              />
            ) : (
              <div className="text-sm text-muted-foreground">
                No cover image available.
              </div>
            )}
          </div>

          <DialogFooter className="shrink-0 border-t px-4 py-3 sm:px-6">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full sm:ml-auto sm:w-auto"
              onClick={() => setZoomOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Gallery modal (all uploaded photos) */}
      <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
        <DialogContent className="flex max-h-[95vh] w-[95vw] max-w-[95vw] flex-col gap-0 overflow-hidden rounded-xl p-0 sm:max-w-[95vw]">
          <DialogHeader className="shrink-0 border-b px-4 py-3 sm:px-6">
            <DialogTitle className="text-base sm:text-lg">Uploaded photos</DialogTitle>
          </DialogHeader>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">
            {media.length === 0 ? (
              <div className="flex min-h-[30vh] items-center justify-center text-sm text-muted-foreground">
                No photos uploaded yet.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4">
                {media.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => openLightbox(idx)}
                    className="group relative overflow-hidden rounded-lg border bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <img
                      src={item.url}
                      alt={item.guestName ?? "Guest photo"}
                      className="aspect-square w-full object-cover transition-transform group-hover:scale-105"
                    />
                    {item.guestName && (
                      <div className="absolute inset-x-0 bottom-0 bg-black/60 px-2 py-1 text-[10px] text-white sm:text-xs">
                        {item.guestName}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <DialogFooter className="shrink-0 border-t px-4 py-3 sm:px-6">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full sm:ml-auto sm:w-auto"
              onClick={() => setGalleryOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lightbox modal (single image view) */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="flex h-[95vh] max-h-[95vh] w-[95vw] max-w-[95vw] flex-col gap-0 overflow-hidden rounded-xl p-0 sm:max-w-[95vw]">
          <DialogHeader className="shrink-0 border-b px-4 py-3 sm:px-6">
            <DialogTitle className="truncate text-base sm:text-lg">
              {media[lightboxIndex]?.guestName
                ? `Photo by ${media[lightboxIndex].guestName}`
                : "Photo"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-muted/30 p-3 sm:p-6">
            {media[lightboxIndex] ? (
              <img
                src={media[lightboxIndex].url}
                alt={media[lightboxIndex].guestName ?? "Guest photo"}
                className="max-h-full max-w-full rounded-lg object-contain"
              />
            ) : (
              <div className="text-sm text-muted-foreground">
                No image available.
              </div>
            )}
          </div>

          <div className="flex shrink-0 flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full sm:w-auto"
              disabled={lightboxIndex <= 0}
              onClick={() => setLightboxIndex((i) => i - 1)}
            >
              Previous
            </Button>

            <div className="text-center text-xs text-muted-foreground">
              {lightboxIndex + 1} / {media.length}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full sm:w-auto"
              disabled={lightboxIndex >= media.length - 1}
              onClick={() => setLightboxIndex((i) => i + 1)}
            >
              Next
            </Button>
          </div>

          <DialogFooter className="shrink-0 border-t px-4 py-3 sm:px-6">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full sm:ml-auto sm:w-auto"
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