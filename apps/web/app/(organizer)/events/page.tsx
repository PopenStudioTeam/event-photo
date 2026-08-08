"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { apiFetch, apiFetchBlobWithProgress, reportApiError } from "@/lib/api";
import { formatEventDate } from "@/lib/format-date";
import { NewEventDialog } from "@/components/new-event-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const tableHeadClass =
  "h-auto px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground whitespace-normal";
const tableCellClass = "px-5 py-4 align-top text-sm leading-relaxed whitespace-normal";

type Event = {
  id: string;
  name: string;
  slug: string;
  eventDate: string | null;
  uploadsEnabled: boolean;
  mediaCount: number;
  protected: boolean;
  hasPassword: boolean;

  // NEW: theme + POV
  primaryColor: string;
  backgroundVariant: "dark" | "light";
  povEnabled: boolean;
  povMaxPerGuest: number;
  povRevealAt: string | null;
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
  const [search, setSearch] = useState("");
  const [uploadsFilter, setUploadsFilter] = useState<"all" | "enabled" | "disabled">("all");
  const [protectionFilter, setProtectionFilter] = useState<"all" | "yes" | "no">("all");

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
      setLoading(true);

      try {
        const params = new URLSearchParams();
        const trimmedSearch = search.trim();
        if (trimmedSearch) params.set("q", trimmedSearch);
        if (uploadsFilter !== "all") params.set("uploads", uploadsFilter);
        if (protectionFilter !== "all") params.set("protection", protectionFilter);

        const query = params.toString();
        const res = await apiFetch(`/events${query ? `?${query}` : ""}`);
        setEvents(res as Event[]);
      } catch (err) {
        console.error(err);
        reportApiError(err, "Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    const timer = window.setTimeout(loadEvents, search.trim() ? 300 : 0);
    return () => window.clearTimeout(timer);
  }, [search, uploadsFilter, protectionFilter]);

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

  const handleDeleteMedia = async (item: Media) => {
    if (!galleryEvent) return;
    if (!confirm("Delete this item?")) return;

    try {
      await apiFetch(`/events/${galleryEvent.slug}/media/${item.id}`, {
        method: "DELETE",
      });
      setMedia((prev) => prev.filter((m) => m.id !== item.id));
    } catch (err) {
      console.error("Failed to delete media", err);
    }
  };

  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {events.length} event(s) ·{" "}
          {events.reduce((sum, evt) => sum + (evt.mediaCount ?? 0), 0)} item(s)
        </p>
        <Button
          variant="outline"
          size="lg"
          className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/60 hover:text-primary-foreground/90 px-5"
          onClick={handleNewEvent}
        >
          New Event
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <Input
          type="search"
          placeholder="Search by name or slug"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:max-w-xs"
        />
        <select
          className="h-8 w-full rounded-md border border-input bg-transparent px-2.5 text-xs sm:w-auto"
          value={uploadsFilter}
          onChange={(e) =>
            setUploadsFilter(e.target.value as "all" | "enabled" | "disabled")
          }
        >
          <option value="all">All uploads</option>
          <option value="enabled">Uploads enabled</option>
          <option value="disabled">Uploads disabled</option>
        </select>
        <select
          className="h-8 w-full rounded-md border border-input bg-transparent px-2.5 text-xs sm:w-auto"
          value={protectionFilter}
          onChange={(e) =>
            setProtectionFilter(e.target.value as "all" | "yes" | "no")
          }
        >
          <option value="all">All protection</option>
          <option value="yes">Protected</option>
          <option value="no">Open gallery</option>
        </select>
      </div>

      {loading ? (
        <div className="text-sm text-muted-foreground">Loading events…</div>
      ) : events.length === 0 ? (
        <div className="text-sm text-muted-foreground">
          {search.trim() || uploadsFilter !== "all" || protectionFilter !== "all"
            ? "No events match your search or filters."
            : "No events yet. Create your first event to get started."}
        </div>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="space-y-4 md:hidden">
            {events.map((evt) => (
              <div
                key={evt.id}
                className="space-y-5 rounded-2xl border border-border/70 bg-card p-5 shadow-sm"
              >
                <div className="space-y-1">
                  <h3 className="text-base font-semibold">
                    {evt.name || "Untitled Event"}
                  </h3>
                  <p className="break-all font-mono text-xs text-muted-foreground">
                    {evt.slug}
                  </p>
                </div>

                <dl className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <dt className="text-xs font-medium text-muted-foreground">Date</dt>
                    <dd className="text-sm">
                      {formatEventDate(evt.eventDate)}
                    </dd>
                  </div>
                  <div className="space-y-1">
                    <dt className="text-xs font-medium text-muted-foreground">Uploads</dt>
                    <dd className="text-sm">
                      {evt.uploadsEnabled ? "Enabled" : "Disabled"}
                    </dd>
                  </div>
                  <div className="space-y-1">
                    <dt className="text-xs font-medium text-muted-foreground">Items</dt>
                    <dd className="text-sm">{evt.mediaCount} item(s)</dd>
                  </div>
                  <div className="space-y-1">
                    <dt className="text-xs font-medium text-muted-foreground">Protection</dt>
                    <dd className="text-sm">
                      {evt.protected ? "Protected" : "Open"}
                      {evt.hasPassword ? " · Password set" : ""}
                    </dd>
                  </div>
                  <div className="space-y-1">
                    <dt className="text-xs font-medium text-muted-foreground">Theme</dt>
                    <dd className="text-sm">
                      {evt.backgroundVariant === "dark" ? "Dark" : "Light"} ·{" "}
                      {evt.primaryColor}
                    </dd>
                  </div>
                  <div className="space-y-1">
                    <dt className="text-xs font-medium text-muted-foreground">POV</dt>
                    <dd className="text-sm">
                      {evt.povEnabled
                        ? `On · max ${evt.povMaxPerGuest || "∞"} shot(s)`
                        : "Off"}
                      {evt.povEnabled && evt.povRevealAt && (
                        <>
                          {" · reveal "}
                          {formatEventDate(evt.povRevealAt)}
                        </>
                      )}
                    </dd>
                  </div>
                </dl>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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

          <div className="hidden w-full min-w-0 overflow-x-auto rounded-2xl border border-border/70 bg-card shadow-sm md:block">
            <Table className="min-w-[980px] border-collapse text-sm">
              <TableHeader>
                <TableRow className="border-b border-border/60 bg-muted/40 hover:bg-muted/40">
                  <TableHead className={tableHeadClass}>Name</TableHead>
                  <TableHead className={tableHeadClass}>Date</TableHead>
                  <TableHead className={`${tableHeadClass} hidden lg:table-cell`}>
                    Slug
                  </TableHead>
                  <TableHead className={tableHeadClass}>Uploads</TableHead>
                  <TableHead className={tableHeadClass}>Items</TableHead>
                  <TableHead className={tableHeadClass}>Protected</TableHead>
                  <TableHead className={`${tableHeadClass} hidden xl:table-cell`}>
                    Theme
                  </TableHead>
                  <TableHead className={`${tableHeadClass} hidden xl:table-cell`}>
                    POV
                  </TableHead>
                  <TableHead className={`${tableHeadClass} text-right`}>
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((evt) => (
                  <TableRow key={evt.id} className="border-b border-border/50">
                    <TableCell className={`${tableCellClass} max-w-[180px] font-medium`}>
                      {evt.name || "Untitled Event"}
                    </TableCell>
                    <TableCell className={tableCellClass}>
                      {evt.eventDate
                        ? formatEventDate(evt.eventDate)
                        : "—"}
                    </TableCell>
                    <TableCell className={`${tableCellClass} hidden lg:table-cell`}>
                      <span className="break-all font-mono text-xs text-muted-foreground">
                        {evt.slug}
                      </span>
                    </TableCell>
                    <TableCell className={tableCellClass}>
                      <span
                        className={
                          evt.uploadsEnabled
                            ? "text-green-700 dark:text-green-400"
                            : "text-muted-foreground"
                        }
                      >
                        {evt.uploadsEnabled ? "Enabled" : "Disabled"}
                      </span>
                    </TableCell>
                    <TableCell className={tableCellClass}>
                      {evt.mediaCount} item(s)
                    </TableCell>
                    <TableCell className={tableCellClass}>
                      <div className="space-y-1">
                        <div>{evt.protected ? "Yes" : "No"}</div>
                        <div className="text-xs text-muted-foreground">
                          {evt.hasPassword ? "Password set" : "No password"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className={`${tableCellClass} hidden xl:table-cell`}>
                      <div className="space-y-1">
                        <div>{evt.backgroundVariant === "dark" ? "Dark" : "Light"}</div>
                        <div className="text-xs text-muted-foreground">{evt.primaryColor}</div>
                      </div>
                    </TableCell>
                    <TableCell className={`${tableCellClass} hidden xl:table-cell`}>
                      <div className="space-y-1">
                        <div>{evt.povEnabled ? "Enabled" : "Disabled"}</div>
                        {evt.povEnabled && (
                          <div className="text-xs text-muted-foreground">
                            Max {evt.povMaxPerGuest || "∞"} shot(s)
                            {evt.povRevealAt && (
                              <>
                                {" · reveal "}
                                {formatEventDate(evt.povRevealAt)}
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className={`${tableCellClass} text-right`}>
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
                    item.type === "photo" ||
                    (item.mimeType ?? "").startsWith("image/");
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
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleDownloadSingle(item)}
                            disabled={downloadProgress.active}
                            className="text-[11px] text-primary hover:underline disabled:opacity-50 sm:text-xs"
                          >
                            {downloadingId === item.id
                              ? "Downloading…"
                              : "Download"}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteMedia(item)}
                            disabled={downloadProgress.active}
                            className="text-[11px] text-red-500 hover:underline disabled:opacity-50 sm:text-xs"
                          >
                            Delete
                          </button>
                        </div>
                        <span className="max-w-[50%] truncate text-[10px] text-muted-foreground sm:text-xs">
                          {item.type === "video" ? "Video" : "Photo"}
                          {item.fileSize
                            ? ` · ${Math.round(
                                item.fileSize / 1024 / 1024
                              )} MB`
                            : ""}
                        </span>
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
                    {downloadProgress.percent != null
                      ? `${downloadProgress.percent}%`
                      : "…"}
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
                {downloadProgress.active
                  ? "Downloading…"
                  : "Download all as ZIP"}
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
                ? `Media by ${media[lightboxIndex].guestName}`
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