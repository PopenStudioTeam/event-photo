"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import {
  CheckCircle2,
  Clock,
  Download,
  EyeOff,
  Upload,
} from "lucide-react";
import {
  apiFetch,
  apiFetchBlobWithProgress,
  reportApiError,
} from "@/lib/api";
import { useBaseWebUrl } from "@/lib/use-base-web-url";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { EventSlideshowOverlay } from "@/components/event-slideshow-overlay";

type EventRecord = {
  id: string;
  name: string;
  slug: string;
  plan: string;
  maxMediaCount: number;
  mediaCount?: number;
};

type Media = {
  id: string;
  type: "photo" | "video";
  mimeType: string;
  fileSize: number;
  guestName: string | null;
  caption: string | null;
  createdAt: string;
  url: string;
  status?: "pending" | "approved" | "rejected";
};

type MediaTab = "published" | "pending" | "hidden";

function mediaFilename(item: Media) {
  const ext = (item.mimeType ?? "application/octet-stream").split("/")[1] || "bin";
  const baseName =
    item.guestName?.replace(/\s+/g, "_") ||
    item.caption?.slice(0, 20).replace(/\s+/g, "_") ||
    item.id;
  return `${baseName}.${ext}`;
}

export default function EventMediaPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const baseWebUrl = useBaseWebUrl();

  const [event, setEvent] = useState<EventRecord | null>(null);
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<MediaTab>("published");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [slideshowOpen, setSlideshowOpen] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const events = (await apiFetch("/events")) as EventRecord[];
        const found = events.find((e) => e.slug === slug) ?? null;
        setEvent(found);
        if (found) {
          const list = await apiFetch<Media[]>(`/events/${slug}/media`);
          setMedia(list);
        }
      } catch (err) {
        reportApiError(err, "Failed to load media");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  const filteredMedia = useMemo(() => {
    let items = media;
    if (tab === "published") {
      items = media.filter((m) => m.status === "approved" || !m.status);
    } else if (tab === "pending") {
      items = media.filter((m) => m.status === "pending");
    } else {
      items = media.filter((m) => m.status === "rejected");
    }

    return [...items].sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      return sortOrder === "newest" ? bTime - aTime : aTime - bTime;
    });
  }, [media, tab, sortOrder]);

  const tabCounts = useMemo(
    () => ({
      published: media.filter((m) => m.status === "approved" || !m.status).length,
      pending: media.filter((m) => m.status === "pending").length,
      hidden: media.filter((m) => m.status === "rejected").length,
    }),
    [media]
  );

  const uploadCount = event?.mediaCount ?? media.length;
  const uploadLimit = event?.maxMediaCount ?? 100;
  const uploadPercent = Math.min(100, Math.round((uploadCount / uploadLimit) * 100));

  const handleDownloadSingle = async (item: Media) => {
    if (!event || downloadingId) return;
    setDownloadingId(item.id);
    try {
      const blob = await apiFetchBlobWithProgress(
        `/events/${event.slug}/media/${item.id}/download`
      );
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = mediaFilename(item);
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (err) {
      console.error(err);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDownloadAll = async () => {
    if (!event || filteredMedia.length === 0 || downloadingZip) return;
    setDownloadingZip(true);
    try {
      const zip = new JSZip();
      for (const item of filteredMedia) {
        const blob = await apiFetchBlobWithProgress(
          `/events/${event.slug}/media/${item.id}/download`
        );
        zip.file(mediaFilename(item), blob);
      }
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `${event.slug}_${tab}.zip`);
    } catch (err) {
      reportApiError(err, "Failed to download media");
    } finally {
      setDownloadingZip(false);
    }
  };

  const handleDelete = async (item: Media) => {
    if (!event || !confirm("Delete this item?")) return;
    try {
      await apiFetch(`/events/${event.slug}/media/${item.id}`, { method: "DELETE" });
      setMedia((prev) => prev.filter((m) => m.id !== item.id));
    } catch (err) {
      reportApiError(err, "Failed to delete media");
    }
  };

  const handleApprove = async (item: Media) => {
    if (!event) return;
    try {
      await apiFetch(`/events/${event.slug}/media/${item.id}/approve`, {
        method: "POST",
      });
      setMedia((prev) =>
        prev.map((m) => (m.id === item.id ? { ...m, status: "approved" as const } : m))
      );
    } catch (err) {
      reportApiError(err, "Failed to approve media");
    }
  };

  const handleReject = async (item: Media) => {
    if (!event) return;
    try {
      await apiFetch(`/events/${event.slug}/media/${item.id}/reject`, {
        method: "POST",
      });
      setMedia((prev) =>
        prev.map((m) => (m.id === item.id ? { ...m, status: "rejected" as const } : m))
      );
    } catch (err) {
      reportApiError(err, "Failed to reject media");
    }
  };

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading photos & videos…</div>;
  }

  if (!event) {
    return <div className="text-sm text-red-500">Event not found</div>;
  }

  const guestUploadUrl = `${baseWebUrl}/e/${event.slug}`;

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden rounded-2xl border-border/70 bg-muted/30">
        <CardContent className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl space-y-2">
            <h2 className="font-heading text-2xl font-semibold tracking-tight">
              Your Photos & Videos
            </h2>
            <p className="text-sm text-muted-foreground">
              Upload photos and videos to your Photo Wall and Digital Album. Share
              the event link so guests can contribute too.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <a
                href={guestUploadUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-8 items-center justify-center gap-1.5 rounded-xl bg-primary px-3 text-sm font-medium text-primary-foreground"
              >
                <Upload className="h-4 w-4" />
                Upload Photos
              </a>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl"
                onClick={handleDownloadAll}
                disabled={filteredMedia.length === 0 || downloadingZip}
              >
                <Download className="mr-1.5 h-4 w-4" />
                {downloadingZip ? "Downloading…" : "Download All"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl"
                onClick={() => setSlideshowOpen(true)}
                disabled={tabCounts.published === 0}
              >
                Start slideshow
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">
              Upload Limit ({event.plan} plan)
            </p>
            <p className="text-xs text-muted-foreground">
              {uploadCount} of {uploadLimit} uploads used
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative h-14 w-14">
              <svg viewBox="0 0 36 36" className="h-14 w-14 -rotate-90">
                <circle
                  cx="18"
                  cy="18"
                  r="15.5"
                  fill="none"
                  className="stroke-muted"
                  strokeWidth="3"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.5"
                  fill="none"
                  className="stroke-primary"
                  strokeWidth="3"
                  strokeDasharray={`${uploadPercent} 100`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold">
                {uploadPercent}%
              </span>
            </div>
            <Link
              href="/settings"
              className="text-sm font-medium text-primary hover:underline"
            >
              Get More
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {(
            [
              { id: "published" as const, label: "Published", icon: CheckCircle2, count: tabCounts.published },
              { id: "pending" as const, label: "Need Approval", icon: Clock, count: tabCounts.pending },
              { id: "hidden" as const, label: "Hidden", icon: EyeOff, count: tabCounts.hidden },
            ] as const
          ).map(({ id, label, icon: Icon, count }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                tab === id
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {label} ({count})
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          Sort by:
          <select
            className="rounded-lg border border-border bg-background px-2 py-1 text-sm text-foreground"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
          >
            <option value="newest">Date added (newest)</option>
            <option value="oldest">Date added (oldest)</option>
          </select>
        </label>
      </div>

      {filteredMedia.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/70 py-16 text-center text-sm text-muted-foreground">
          No {tab === "published" ? "published" : tab === "pending" ? "pending" : "hidden"}{" "}
          media yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredMedia.map((item, index) => {
            const isPhoto =
              item.type === "photo" || (item.mimeType ?? "").startsWith("image/");

            return (
              <div
                key={item.id}
                className="group overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => {
                    setLightboxIndex(index);
                    setLightboxOpen(true);
                  }}
                  className="block w-full overflow-hidden"
                >
                  {isPhoto ? (
                    <img
                      src={item.url}
                      alt={item.guestName ?? "Media"}
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
                <div className="space-y-2 border-t p-2">
                  {item.guestName && (
                    <p className="truncate text-xs text-muted-foreground">{item.guestName}</p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="text-[11px] text-primary hover:underline"
                      onClick={() => handleDownloadSingle(item)}
                      disabled={downloadingId === item.id}
                    >
                      Download
                    </button>
                    <button
                      type="button"
                      className="text-[11px] text-red-500 hover:underline"
                      onClick={() => handleDelete(item)}
                    >
                      Delete
                    </button>
                    {tab === "pending" && (
                      <>
                        <button
                          type="button"
                          className="text-[11px] text-green-600 hover:underline"
                          onClick={() => handleApprove(item)}
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          className="text-[11px] text-amber-600 hover:underline"
                          onClick={() => handleReject(item)}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="flex max-h-[90vh] w-[min(96vw,900px)] max-w-[min(96vw,900px)] flex-col overflow-hidden rounded-2xl p-0 sm:max-w-[min(96vw,900px)]">
          <DialogHeader className="border-b px-4 py-3">
            <DialogTitle>
              {filteredMedia[lightboxIndex]?.guestName ?? "Media preview"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex min-h-[50vh] flex-1 items-center justify-center bg-muted/30 p-4">
            {filteredMedia[lightboxIndex] &&
              (filteredMedia[lightboxIndex].type === "photo" ||
              (filteredMedia[lightboxIndex].mimeType ?? "").startsWith("image/") ? (
                <img
                  src={filteredMedia[lightboxIndex].url}
                  alt=""
                  className="max-h-[65vh] max-w-full rounded-lg object-contain"
                />
              ) : (
                <video
                  src={filteredMedia[lightboxIndex].url}
                  controls
                  className="max-h-[65vh] max-w-full rounded-lg"
                />
              ))}
          </div>
          <DialogFooter className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={lightboxIndex <= 0}
              onClick={() => setLightboxIndex((index) => index - 1)}
            >
              Previous
            </Button>
            <span className="text-xs text-muted-foreground">
              {filteredMedia.length > 0
                ? `${lightboxIndex + 1} / ${filteredMedia.length}`
                : "0 / 0"}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={lightboxIndex >= filteredMedia.length - 1}
              onClick={() => setLightboxIndex((index) => index + 1)}
            >
              Next
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <EventSlideshowOverlay
        open={slideshowOpen}
        onClose={() => setSlideshowOpen(false)}
        mediaPath={`/events/${slug}/media`}
        eventName={event.name}
      />
    </div>
  );
}
