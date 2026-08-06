"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { API_URL, apiFetch, apiFetchBlobWithProgress } from "@/lib/api";
import { useBaseWebUrl } from "@/lib/use-base-web-url";
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
  protected: boolean;
  hasPassword: boolean;
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

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit modal state
  const [editOpen, setEditOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formProtected, setFormProtected] = useState(false);
  const [formPassword, setFormPassword] = useState("");
  const [editError, setEditError] = useState<string | null>(null);
  const [editSaving, setEditSaving] = useState(false);

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

  // Lightbox state (media viewer)
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Download state
  const [downloadProgress, setDownloadProgress] = useState<DownloadProgress>({
    active: false,
    label: "",
    percent: null,
  });
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const events = await apiFetch<Event[]>("/events");
        const found = events.find((e) => e.slug === slug) ?? null;
        if (!found) {
          setError("Event not found");
        } else {
          setEvent(found);
          setFormName(found.name);
          setFormDate(found.eventDate ? found.eventDate.slice(0, 10) : "");
          setFormProtected(found.protected);
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

  const baseWebUrl = useBaseWebUrl();

  const handleCopyLink = () => {
    if (!event) return;
    const url = `${baseWebUrl}/e/${event.slug}`;
    navigator.clipboard.writeText(url);
  };

  const handleOpenSlideshow = () => {
    if (!event) return;
    router.push(`/events/${event.slug}/slideshow`);
  };

  const openEditDialog = () => {
    if (!event) return;
    setFormName(event.name);
    setFormDate(event.eventDate ? event.eventDate.slice(0, 10) : "");
    setFormProtected(event.protected);
    setFormPassword("");
    setEditError(null);
    setEditOpen(true);
  };

  const handleEditSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!event) return;

    if (formProtected && !event.hasPassword && formPassword.length < 4) {
      setEditError("Gallery password must be at least 4 characters");
      return;
    }

    const body: Record<string, unknown> = {};
    if (formName && formName !== event.name) body.name = formName;
    if (formDate) body.eventDate = new Date(formDate).toISOString();
    if (formProtected !== event.protected) body.protected = formProtected;
    if (formPassword) body.password = formPassword;

    if (Object.keys(body).length === 0) {
      setEditOpen(false);
      return;
    }

    setEditSaving(true);
    setEditError(null);

    try {
      const updated = await apiFetch<Event>(`/events/${slug}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      });

      setEvent((prev) => (prev ? { ...prev, ...updated } : updated));
      setEditOpen(false);
      setFormPassword("");
    } catch (err) {
      console.error(err);
      setEditError("Failed to save changes");
    } finally {
      setEditSaving(false);
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

      const presign = await apiFetch<{ uploadUrl: string; key: string }>(
        `/events/${event.slug}/cover-url`,
        {
          method: "POST",
          body: JSON.stringify({ contentType, fileSize }),
        }
      );

      const putRes = await fetch(presign.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": contentType },
        body: coverFile,
      });

      if (!putRes.ok) {
        throw new Error("Upload to R2 failed");
      }

      const updated = await apiFetch<Event>(`/events/${event.slug}`, {
        method: "PATCH",
        body: JSON.stringify({ coverImageKey: presign.key }),
      });

      setEvent((prev) => (prev ? { ...prev, ...updated } : updated));
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
    setGalleryOpen(true);
    try {
      const list = await apiFetch<Media[]>(`/events/${event.slug}/media`);
      setMedia(list);
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

  const eventUrl = event ? `${baseWebUrl}/e/${event.slug}` : "";

  const handleDownloadSingle = async (item: Media) => {
    if (!event || downloadProgress.active) return;

    setDownloadingId(item.id);
    setDownloadProgress({
      active: true,
      label: `Downloading ${mediaFilename(item)}…`,
      percent: 0,
    });

    try {
      const blob = await apiFetchBlobWithProgress(
        `/events/${event.slug}/media/${item.id}/download`,
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
    if (!event || media.length === 0 || downloadProgress.active) return;

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
          `/events/${event.slug}/media/${item.id}/download`
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

      const eventNameSafe = (event.name || event.slug)
        .toLowerCase()
        .replace(/\s+/g, "_");

      saveAs(content, `${eventNameSafe}_media.zip`);
    } catch (err) {
      console.error("ZIP download failed", err);
    } finally {
      setDownloadProgress({ active: false, label: "", percent: null });
    }
  };

  const handleDeleteMedia = async (item: Media) => {
    if (!event) return;
    if (!confirm("Delete this item?")) return;

    try {
      await apiFetch(`/events/${event.slug}/media/${item.id}`, {
        method: "DELETE",
      });
      setMedia((prev) => prev.filter((m) => m.id !== item.id));
    } catch (err) {
      console.error("Failed to delete media", err);
    }
  };

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading event…</div>;
  }

  if (error || !event) {
    return (
      <div className="text-sm text-red-500">{error ?? "Event not found"}</div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Event details */}
      <Card className="rounded-xl">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base md:text-lg">Event details</CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="w-full sm:w-auto"
            onClick={openEditDialog}
          >
            Edit
          </Button>
        </CardHeader>

        <CardContent className="space-y-3 text-sm">
          <div>
            <span className="font-medium">Name:</span> {event.name}
          </div>
          <div>
            <span className="font-medium">Date:</span>{" "}
            {event.eventDate
              ? new Date(event.eventDate).toLocaleDateString()
              : "—"}
          </div>
          <div>
            <span className="font-medium">Slug:</span> {event.slug}
          </div>
          <div>
            <span className="font-medium">Gallery protection:</span>{" "}
            {event.protected
              ? event.hasPassword
                ? "Enabled (password set)"
                : "Enabled (no password yet)"
              : "Disabled"}
          </div>
          <div>
            <span className="font-medium">Uploads:</span>{" "}
            {event.uploadsEnabled ? "Enabled" : "Disabled"}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto"
              onClick={handleCopyLink}
            >
              Copy event link
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto"
              onClick={handleOpenSlideshow}
            >
              Open slideshow
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto"
              onClick={loadMedia}
              disabled={loadingMedia}
            >
              {loadingMedia ? "Loading…" : "View media"}
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
              src={`${API_URL}/qr/${event.slug}?origin=${encodeURIComponent(
                baseWebUrl
              )}`}
              alt="Event QR"
              className="h-full w-full object-contain p-2"
            />
          </div>
          <div className="break-all text-xs text-muted-foreground">
            {eventUrl}
          </div>
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

            <div className="space-y-3 rounded-md border bg-muted/40 p-3">
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  className="mt-0.5"
                  checked={formProtected}
                  onChange={(e) => {
                    setFormProtected(e.target.checked);
                    if (!e.target.checked) setFormPassword("");
                  }}
                />
                <span>
                  <span className="block text-xs font-medium">Protect gallery with password</span>
                  <span className="block text-[11px] text-muted-foreground">
                    Guests must enter a password to view photos and videos.
                  </span>
                </span>
              </label>

              {formProtected && (
                <div className="space-y-1">
                  <label className="text-xs font-medium">
                    {event.hasPassword ? "New gallery password (optional)" : "Gallery password"}
                  </label>
                  <input
                    type="password"
                    className="w-full rounded-md border px-3 py-2 text-sm"
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    placeholder={
                      event.hasPassword
                        ? "Leave blank to keep current password"
                        : "At least 4 characters"
                    }
                    minLength={event.hasPassword ? undefined : 4}
                  />
                </div>
              )}
            </div>

            {editError && <div className="text-xs text-red-500">{editError}</div>}

            <DialogFooter className="mt-4 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setEditOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={editSaving}>
                {editSaving ? "Saving…" : "Save changes"}
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
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleZoomOut}
              >
                -
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleZoomReset}
              >
                Reset
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleZoomIn}
              >
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

      {/* Gallery modal (uploaded media) */}
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
            <DialogTitle className="text-base sm:text-lg">
              Uploaded media
            </DialogTitle>
          </DialogHeader>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">
            {loadingMedia ? (
              <div className="flex min-h-[30vh] items-center justify-center text-sm text-muted-foreground">
                Loading media…
              </div>
            ) : media.length === 0 ? (
              <div className="flex min-h-[30vh] items-center justify-center text-sm text-muted-foreground">
                No media uploaded yet.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4">
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
                            className="aspect-square w-full object-cover transition-transform group-hover:scale-105"
                          />
                        ) : (
                          <video
                            src={item.url}
                            className="aspect-square w-full object-cover"
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

      {/* Media lightbox modal */}
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
    </div>
  );
}