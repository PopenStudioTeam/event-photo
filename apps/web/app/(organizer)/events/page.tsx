"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { apiFetch, apiFetchBlobWithProgress } from "@/lib/api";
import { NewEventDialog } from "@/components/new-event-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Event = {
  id: string;
  name: string;
  slug: string;
  eventDate: string | null;
  uploadsEnabled: boolean;
};

type Media = {
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

type DownloadProgress = {
  active: boolean;
  label: string;
  percent: number | null;
};

function mediaFilename(item: Media) {
  const ext = (item.mimeType ?? "application/octet-stream").split("/")[1] || "bin";
  const baseName =
    item.guestName?.replace(/\s+/g, "_") ||
    item.caption?.slice(0, 20).replace(/\s+/g, "_") ||
    item.id;
  return `${baseName}.${ext}`;
}

export default function EventsPage() {
  const router = useRouter();

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Gallery state
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryEvent, setGalleryEvent] = useState<Event | null>(null);
  const [media, setMedia] = useState<Media[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(false);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [newEventOpen, setNewEventOpen] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<DownloadProgress>({
    active: false,
    label: "",
    percent: null,
  });
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const res = await apiFetch("/events");
        setEvents(res as Event[]);
      } catch (err) {
        console.error(err);
        setError("Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const handleOpenEvent = (slug: string) => {
    router.push(`/events/${slug}`);
  };

  const handleNewEvent = () => {
    setNewEventOpen(true);
  };

  const openDocumentationGallery = async (event: Event) => {
    setGalleryEvent(event);
    setGalleryOpen(true);
    setLoadingMedia(true);
    setMedia([]);

    try {
      const res = await apiFetch(`/events/${event.slug}/media`);
      setMedia(res as Media[]);
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

  const handleDownloadSingle = async (item: Media) => {
    if (!galleryEvent || downloadProgress.active) return;

    setDownloadingId(item.id);
    setDownloadProgress({
      active: true,
      label: `Downloading ${mediaFilename(item)}…`,
      percent: 0,
    });

    try {
      const blob = await apiFetchBlobWithProgress(
        `/events/${galleryEvent.slug}/media/${item.id}/download`,
        {},
        (percent) => {
          setDownloadProgress((prev) => ({ ...prev, percent }));
        }
      );

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = mediaFilename(item);
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (err) {
      console.error("Download failed", err);
    } finally {
      setDownloadingId(null);
      setDownloadProgress({ active: false, label: "", percent: null });
    }
  };

  const handleDownloadZip = async () => {
    if (!galleryEvent || media.length === 0 || downloadProgress.active) return;

    setDownloadProgress({
      active: true,
      label: "Preparing ZIP…",
      percent: 0,
    });

    try {
      const zip = new JSZip();
      const total = media.length;

      for (let i = 0; i < media.length; i++) {
        const item = media[i];
        setDownloadProgress({
          active: true,
          label: `Downloading ${i + 1} of ${total}…`,
          percent: Math.round((i / total) * 75),
        });

        const blob = await apiFetchBlobWithProgress(
          `/events/${galleryEvent.slug}/media/${item.id}/download`
        );
        zip.file(mediaFilename(item), blob);

        setDownloadProgress({
          active: true,
          label: `Downloaded ${i + 1} of ${total}…`,
          percent: Math.round(((i + 1) / total) * 75),
        });
      }

      setDownloadProgress({
        active: true,
        label: "Creating ZIP file…",
        percent: 76,
      });

      const content = await zip.generateAsync({ type: "blob" }, (metadata) => {
        setDownloadProgress({
          active: true,
          label: "Creating ZIP file…",
          percent: 76 + Math.round(metadata.percent * 0.24),
        });
      });

      const eventNameSafe = (galleryEvent.name || galleryEvent.slug)
        .toLowerCase()
        .replace(/\s+/g, "_");

      saveAs(content, `${eventNameSafe}_documentation.zip`);
    } catch (err) {
      console.error("ZIP download failed", err);
    } finally {
      setDownloadProgress({ active: false, label: "", percent: null });
    }
  };

  return (
    <div className="min-w-0 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold sm:text-xl">Events</h2>
        <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={handleNewEvent}>
          New Event
        </Button>
      </div>

      {loading ? (
        <div className="text-sm text-muted-foreground">Loading events…</div>
      ) : error ? (
        <div className="text-sm text-red-500">{error}</div>
      ) : events.length === 0 ? (
        <div className="text-sm text-muted-foreground">
          No events yet. Create your first event to get started.
        </div>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {events.map((evt) => (
              <div key={evt.id} className="space-y-3 rounded-lg border bg-background p-4">
                <div className="min-w-0">
                  <div className="font-medium">{evt.name || "Untitled Event"}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {evt.eventDate
                      ? new Date(evt.eventDate).toLocaleDateString()
                      : "No date"}
                    {" · "}
                    Uploads {evt.uploadsEnabled ? "enabled" : "disabled"}
                  </div>
                  <div className="mt-1 break-all font-mono text-[11px] text-muted-foreground">
                    {evt.slug}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => handleOpenEvent(evt.slug)}
                  >
                    Open
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full min-w-0"
                    onClick={() => openDocumentationGallery(evt)}
                  >
                    View docs
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop / tablet table */}
          <div className="hidden w-full min-w-0 overflow-x-auto rounded-lg border bg-background md:block">
            <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-3 py-2 text-left font-medium lg:px-4">Name</th>
                <th className="px-3 py-2 text-left font-medium lg:px-4">Date</th>
                <th className="hidden px-3 py-2 text-left font-medium lg:table-cell lg:px-4">Slug</th>
                <th className="px-3 py-2 text-left font-medium lg:px-4">Uploads</th>
                <th className="px-3 py-2 text-right font-medium lg:px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((evt) => (
                <tr key={evt.id} className="border-t">
                  <td className="max-w-[140px] truncate px-3 py-2 align-middle lg:max-w-none lg:px-4">
                    {evt.name || "Untitled Event"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 align-middle lg:px-4">
                    {evt.eventDate
                      ? new Date(evt.eventDate).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="hidden px-3 py-2 align-middle lg:table-cell lg:px-4">
                    <span className="break-all font-mono text-xs">{evt.slug}</span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 align-middle lg:px-4">
                    {evt.uploadsEnabled ? "Enabled" : "Disabled"}
                  </td>
                  <td className="px-3 py-2 align-middle lg:px-4">
                    <div className="flex flex-col items-stretch justify-end gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto"
                        onClick={() => handleOpenEvent(evt.slug)}
                      >
                        Open
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto"
                        onClick={() => openDocumentationGallery(evt)}
                      >
                        <span className="lg:hidden">View docs</span>
                        <span className="hidden lg:inline">View documentation</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </>
      )}

      {/* Gallery modal */}
      <Dialog
        open={galleryOpen}
        onOpenChange={(open) => {
          if (!open && downloadProgress.active) return;
          setGalleryOpen(open);
          if (!open) {
            setDownloadProgress({ active: false, label: "", percent: null });
            setDownloadingId(null);
          }
        }}
      >
        <DialogContent className="flex max-h-[95vh] w-[95vw] max-w-[95vw] flex-col gap-0 overflow-hidden rounded-xl p-0 sm:max-w-[95vw]">
          <DialogHeader className="shrink-0 border-b px-4 py-3 sm:px-6">
            <DialogTitle className="truncate text-base sm:text-lg">
              {galleryEvent
                ? `Documentation for "${galleryEvent.name || galleryEvent.slug}"`
                : "Documentation"}
            </DialogTitle>
          </DialogHeader>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">
            {loadingMedia ? (
              <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
                Loading media…
              </div>
            ) : media.length === 0 ? (
              <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
                No documentation uploaded yet for this event.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {media.map((item, idx) => {
                  const isPhoto =
                    item.type === "photo" || (item.mimeType ?? "").startsWith("image/");
                  const label = item.guestName ?? "Guest upload";

                  return (
                    <div
                      key={item.id}
                      className="group relative flex flex-col overflow-hidden rounded-lg border bg-muted"
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
                            className="aspect-[4/3] w-full object-cover transition-transform group-hover:scale-105 sm:aspect-square"
                          />
                        ) : (
                          <video
                            src={item.url}
                            className="aspect-[4/3] w-full object-cover sm:aspect-square"
                            muted
                            playsInline
                          />
                        )}
                      </button>

                      {item.guestName && (
                        <div className="absolute inset-x-0 bottom-8 bg-black/60 px-2 py-1 text-[10px] text-white sm:text-xs">
                          {item.guestName}
                        </div>
                      )}

                      <div className="flex items-center justify-between gap-2 border-t bg-background/80 px-2 py-2">
                        <button
                          type="button"
                          onClick={() => handleDownloadSingle(item)}
                          disabled={downloadProgress.active}
                          className="text-[11px] text-primary hover:underline disabled:opacity-50 sm:text-xs"
                        >
                          {downloadingId === item.id ? "Downloading…" : "Download"}
                        </button>
                        {item.caption && (
                          <span className="max-w-[50%] truncate text-[10px] text-muted-foreground sm:text-xs">
                            {item.caption}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <DialogFooter className="shrink-0 flex-col gap-3 border-t px-4 py-3 sm:px-6">
            {downloadProgress.active && (
              <div className="w-full space-y-2">
                <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                  <span className="truncate">{downloadProgress.label}</span>
                  <span className="shrink-0 tabular-nums">
                    {downloadProgress.percent != null ? `${downloadProgress.percent}%` : "…"}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-[width] duration-200"
                    style={{
                      width:
                        downloadProgress.percent != null
                          ? `${Math.max(downloadProgress.percent, 4)}%`
                          : "35%",
                    }}
                  />
                </div>
              </div>
            )}

            <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-between">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full sm:w-auto"
              onClick={handleDownloadZip}
              disabled={media.length === 0 || downloadProgress.active}
            >
              {downloadProgress.active ? "Downloading…" : "Download all as ZIP"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full sm:w-auto"
              disabled={downloadProgress.active}
              onClick={() => setGalleryOpen(false)}
            >
              Close
            </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lightbox modal */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="flex h-[95vh] max-h-[95vh] w-[95vw] max-w-[95vw] flex-col gap-0 overflow-hidden rounded-xl p-0 sm:max-w-[95vw]">
          <DialogHeader className="shrink-0 border-b px-4 py-3 sm:px-6">
            <DialogTitle className="truncate text-base sm:text-lg">
              {media[lightboxIndex]?.guestName
                ? `Photo by ${media[lightboxIndex].guestName}`
                : "Media"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-muted/30 p-3 sm:p-6">
            {media[lightboxIndex] ? (
              media[lightboxIndex].type === "photo" ||
              (media[lightboxIndex].mimeType ?? "").startsWith("image/") ? (
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
              {media.length > 0 ? `${lightboxIndex + 1} / ${media.length}` : "0 / 0"}
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

      <NewEventDialog open={newEventOpen} onOpenChange={setNewEventOpen} />
    </div>
  );
}