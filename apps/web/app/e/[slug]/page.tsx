"use client";

import { useEffect, useState, FormEvent } from "react";
import { useParams } from "next/navigation";
import { apiFetch, ApiError, reportApiError, showErrorAlert } from "@/lib/api";
import { formatEventDate } from "@/lib/format-date";
import {
  getGalleryUnlockToken,
  setGalleryUnlockToken,
  clearGalleryUnlockToken,
} from "@/lib/gallery-unlock";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HeartIcon } from "@phosphor-icons/react";
import { EventSlideshowOverlay } from "@/components/event-slideshow-overlay";
import { GuestMyUploadsDialog } from "@/components/guest-my-uploads";
import { getGuestSession, saveGuestSession } from "@/lib/guest-session";
import { cn } from "@/lib/utils";
import { FileDropzone } from "@/components/file-dropzone";

type PublicEvent = {
  slug: string;
  name: string;
  eventDate: string | null;
  coverImageUrl: string | null;
  uploadsEnabled: boolean;
  protected: boolean;

  primaryColor: string;
  backgroundVariant: "dark" | "light";
  povEnabled: boolean;
  povMaxPerGuest: number;
  povRevealAt: string | null;

  coverLayout: "banner" | "card";
  coverOverlay: "none" | "gradient";
  moderationEnabled?: boolean;
  likesEnabled?: boolean;
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
  likesCount: number;
  liked?: boolean;
};

type MediaResponse = {
  items: MediaItem[];
  nextCursor: string | null;
  revealAt?: string | null;
};

type UploadItem = {
  file: File;
  caption: string;
  status: "queued" | "uploading" | "done" | "error";
  progress: number;
};

export default function GuestEventPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const initialGuest =
    typeof window !== "undefined" && slug ? getGuestSession(slug) : null;

  const [event, setEvent] = useState<PublicEvent | null>(null);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [eventError, setEventError] = useState<string | null>(null);

  // Guest name and welcome step
  const [guestName, setGuestName] = useState(initialGuest?.name ?? "");
  const [guestId, setGuestId] = useState(initialGuest?.guestId ?? "");
  const [welcomeDone, setWelcomeDone] = useState(Boolean(initialGuest));
  const [myUploadsRefreshKey, setMyUploadsRefreshKey] = useState(0);

  // Upload state
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [uploadPanelOpen, setUploadPanelOpen] = useState(false);

  // Gallery protection
  const [galleryUnlocked, setGalleryUnlocked] = useState(false);
  const [unlockPassword, setUnlockPassword] = useState("");
  const [unlocking, setUnlocking] = useState(false);

  // Gallery state
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [mediaCursor, setMediaCursor] = useState<string | null>(null);
  const [mediaHasMore, setMediaHasMore] = useState(false);
  const [revealAt, setRevealAt] = useState<string | null>(null);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Slideshow overlay
  const [slideshowOpen, setSlideshowOpen] = useState(false);
  const [slideshowStartIndex, setSlideshowStartIndex] = useState(0);

  useEffect(() => {
    const loadEvent = async () => {
      setLoadingEvent(true);
      setEventError(null);
      try {
        const res = await apiFetch(`/e/${slug}`);
        const loaded = res as PublicEvent;
        setEvent(loaded);

        if (!loaded.protected) {
          setGalleryUnlocked(true);
        } else if (getGalleryUnlockToken(slug)) {
          setGalleryUnlocked(true);
        } else {
          setGalleryUnlocked(false);
        }
      } catch (err) {
        console.error(err);
        reportApiError(err, "Failed to load event.");
      } finally {
        setLoadingEvent(false);
      }
    };

    if (slug) {
      loadEvent();
    }
  }, [slug]);

  useEffect(() => {
    if (!slug || !event || !galleryUnlocked) return;
    loadMedia(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, event, galleryUnlocked]);

  const loadMedia = async (initial = false) => {
    if (!slug || !galleryUnlocked) return;

    setLoadingMedia(true);
    try {
      const query = new URLSearchParams();
      if (!initial && mediaCursor) {
        query.set("cursor", mediaCursor);
      }
      if (guestId) {
        query.set("guestId", guestId);
      }

      const res = await apiFetch(
        query.toString() ? `/e/${slug}/media?${query.toString()}` : `/e/${slug}/media`
      );

      const { items, nextCursor, revealAt: revealAtFromApi } = res as MediaResponse;

      if (initial) {
        setMedia(items);
      } else {
        setMedia((prev) => [...prev, ...items]);
      }

      setMediaCursor(nextCursor);
      setMediaHasMore(Boolean(nextCursor));
      setRevealAt(revealAtFromApi ?? null);
    } catch (err) {
      console.error(err);
      if (err instanceof ApiError && err.status === 403) {
        clearGalleryUnlockToken(slug);
        setGalleryUnlocked(false);
        setMedia([]);
      }
    } finally {
      setLoadingMedia(false);
    }
  };

  const handleUnlock = async (e: FormEvent) => {
    e.preventDefault();
    if (!slug || !unlockPassword.trim()) return;

    setUnlocking(true);

    try {
      const res = await apiFetch(`/e/${slug}/unlock`, {
        method: "POST",
        body: JSON.stringify({ password: unlockPassword }),
      });

      const { galleryToken } = res as { galleryToken?: string };
      if (!galleryToken) {
        showErrorAlert("Unlock failed. Please try again.");
        return;
      }
      setGalleryUnlockToken(slug, galleryToken);
      setGalleryUnlocked(true);
      setUnlockPassword("");
    } catch (err) {
      reportApiError(err, "Incorrect password. Please try again.", {
        showAuthFailureDetail: true,
      });
    } finally {
      setUnlocking(false);
    }
  };

  const handleWelcomeSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !slug) return;

    const session = saveGuestSession(slug, guestName);
    setGuestName(session.name);
    setGuestId(session.guestId);
    setWelcomeDone(true);
  };

  const handleFilesSelected = (files: File[]) => {
    if (!files.length) return;

    const items: UploadItem[] = files.map((file) => ({
      file,
      caption: "",
      status: "queued",
      progress: 0,
    }));

    setUploads((prev) => [...prev, ...items]);
    setUploadSuccess(null);
    setUploadPanelOpen(true);
  };

  const handleUploadItemCaptionChange = (index: number, caption: string) => {
    setUploads((prev) =>
      prev.map((u, idx) => (idx === index ? { ...u, caption } : u))
    );
  };

  const uploadWithPerFileProgress = (
    url: string,
    file: File,
    contentType: string,
    index: number
  ) => {
    return new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", url);
      xhr.setRequestHeader("Content-Type", contentType);

      xhr.upload.onprogress = (event) => {
        if (!event.lengthComputable) return;
        const progress = Math.round((event.loaded / event.total) * 100);
        setUploads((prev) =>
          prev.map((u, idx) =>
            idx === index ? { ...u, progress, status: "uploading" } : u
          )
        );
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          setUploads((prev) =>
            prev.map((u, idx) =>
              idx === index ? { ...u, progress: 100, status: "done" } : u
            )
          );
          resolve();
        } else {
          setUploads((prev) =>
            prev.map((u, idx) =>
              idx === index ? { ...u, status: "error" } : u
            )
          );
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      };

      xhr.onerror = () => {
        setUploads((prev) =>
          prev.map((u, idx) =>
            idx === index ? { ...u, status: "error" } : u
          )
        );
        reject(new Error("Network error during upload"));
      };

      xhr.send(file);
    });
  };

  const handleUpload = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!event || !event.uploadsEnabled || uploads.length === 0) return;

    if (event.povEnabled && event.povMaxPerGuest > 0 && !guestId) {
      showErrorAlert("Guest identity is required before uploading in POV mode.");
      return;
    }

    setUploading(true);
    setUploadSuccess(null);

    try {
      for (let i = 0; i < uploads.length; i++) {
        const item = uploads[i];
        const file = item.file;
        const contentType = file.type || "application/octet-stream";
        const fileSize = file.size;

        const presign = await apiFetch(`/e/${slug}/upload-url`, {
          method: "POST",
          body: JSON.stringify({ contentType, fileSize }),
        });

        const { uploadUrl, key } = presign as {
          uploadUrl: string;
          key: string;
          type: string;
        };

        await uploadWithPerFileProgress(uploadUrl, file, contentType, i);

        await apiFetch(`/e/${slug}/media`, {
          method: "POST",
          body: JSON.stringify({
            key,
            contentType,
            fileSize,
            guestName: guestName || undefined,
            guestId: guestId || undefined,
            caption: item.caption || undefined,
          }),
        });
      }

      setUploadSuccess(
        event.moderationEnabled
          ? "All files uploaded successfully! They will appear after organizer approval."
          : "All files uploaded successfully!"
      );
      setUploads([]);
      setUploadPanelOpen(false);
      setMyUploadsRefreshKey((key) => key + 1);
      loadMedia(true);
    } catch (err) {
      console.error(err);
      reportApiError(err, "Failed to upload some files. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleLike = async (item: MediaItem) => {
    if (!event?.likesEnabled || !guestId || item.liked) return;

    try {
      const res = await apiFetch(`/e/${slug}/media/${item.id}/like`, {
        method: "POST",
        body: JSON.stringify({ guestId }),
      });
      const { likesCount, liked } = res as { likesCount: number; liked: boolean };
      setMedia((prev) =>
        prev.map((m) =>
          m.id === item.id ? { ...m, likesCount, liked: liked ?? true } : m
        )
      );
    } catch (err) {
      console.error("Failed to like media", err);
    }
  };

  const currentLightboxItem = media[lightboxIndex] ?? null;

  const openSlideshow = (startIndex = 0) => {
    setSlideshowStartIndex(startIndex);
    setSlideshowOpen(true);
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (loadingEvent) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="text-sm text-muted-foreground">Loading event…</div>
      </div>
    );
  }

  if (eventError || !event) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="text-sm text-red-500">
          {eventError ?? "Event not found"}
        </div>
      </div>
    );
  }

  const coverOverlayClass =
    event.coverOverlay === "gradient"
      ? "bg-gradient-to-t from-black/80 via-black/35 to-black/20"
      : "bg-gradient-to-t from-black/80 via-black/40 to-transparent";

  const heroOverlayClass =
    "bg-gradient-to-t from-black/90 via-black/45 to-black/10";

  const mediaCountLabel =
    event.protected && !galleryUnlocked
      ? "Gallery locked"
      : `${media.length} photo${media.length === 1 ? "" : "s"}, video${
          media.length === 1 ? "" : "s"
        } & posts`;

  const isLightAlbum = event.backgroundVariant === "light";
  const heroHasCover = Boolean(event.coverImageUrl);
  const heroUsesLightSurface = isLightAlbum && !heroHasCover;

  const welcomeCoverOverlayClass =
    event.coverOverlay === "gradient"
      ? "bg-gradient-to-t from-black/60 via-black/20 to-transparent"
      : "";

  // Step 1: Welcome — centered card with app purple & pastel theme
  if (!welcomeDone) {
    return (
      <div className="guest-welcome-shell flex min-h-screen items-center justify-center p-4">
        <div className="guest-entrance-item w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-card text-card-foreground shadow-[0_24px_80px_-24px_rgba(109,74,174,0.35)]">
          <div className="relative h-56 w-full overflow-hidden sm:h-72">
            {event.coverImageUrl ? (
              <div className="relative h-full w-full">
                <img
                  src={event.coverImageUrl}
                  alt={event.name}
                  className="h-full w-full object-cover"
                />
                {event.coverOverlay === "gradient" && (
                  <div className={`absolute inset-0 ${welcomeCoverOverlayClass}`} />
                )}
                <div className="absolute bottom-4 left-4 h-14 w-14 overflow-hidden rounded-full border-2 border-white shadow-md">
                  <img
                    src={event.coverImageUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            ) : (
              <div className="flex h-full w-full flex-col justify-end bg-gradient-to-br from-primary/15 via-secondary to-background p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
                  ✦
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4 px-6 pb-6 pt-5">
            <div className="guest-entrance-item guest-entrance-item-1 space-y-1">
              <h1 className="text-xl font-semibold">{event.name}</h1>
              {event.eventDate && (
                <p className="text-sm text-muted-foreground">
                  {formatEventDate(event.eventDate)}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                Share your photos and videos from this event.
              </p>
            </div>

            <form
              className="guest-entrance-item guest-entrance-item-2 space-y-3 text-sm"
              onSubmit={handleWelcomeSubmit}
            >
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">
                  Name
                </label>
                <input
                  className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Your name"
                  autoFocus
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="guest-entrance-item guest-entrance-item-3 mt-2 w-full rounded-full text-sm font-semibold"
              >
                Let&apos;s Go!
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Album view + gallery + upload panel
  return (
    <div
      className={cn(
        "min-h-screen",
        isLightAlbum ? "guest-welcome-shell" : "bg-neutral-950 text-white"
      )}
    >
      <section className="relative min-h-[min(52vh,520px)] w-full">
        {heroHasCover ? (
          <img
            src={event.coverImageUrl!}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : isLightAlbum ? (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-secondary to-background" />
        ) : (
          <div className="absolute inset-0 bg-brand-deep-navy" />
        )}

        {(heroHasCover || !isLightAlbum) && (
          <div className={`absolute inset-0 ${heroOverlayClass}`} />
        )}
        {event.coverOverlay === "gradient" && heroHasCover && (
          <div className={`absolute inset-0 ${coverOverlayClass}`} />
        )}

        <div className="relative flex min-h-[min(52vh,520px)] flex-col justify-end px-4 pb-6 pt-16 sm:px-8 sm:pb-8">
          <div className="mb-5 flex items-center gap-4">
            {heroHasCover ? (
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-white sm:h-16 sm:w-16">
                <img
                  src={event.coverImageUrl!}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div
                className={cn(
                  "flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 text-xl sm:h-16 sm:w-16",
                  heroUsesLightSurface
                    ? "border-primary/20 bg-primary/10 text-primary"
                    : "border-white bg-white/10 text-white"
                )}
              >
                ✦
              </div>
            )}
            <div>
              <h1
                className={cn(
                  "text-xl font-semibold leading-tight sm:text-2xl",
                  heroUsesLightSurface ? "text-foreground" : "text-white"
                )}
              >
                {event.name}
              </h1>
              {event.eventDate && (
                <p
                  className={cn(
                    "mt-1 text-xs sm:text-sm",
                    heroUsesLightSurface ? "text-muted-foreground" : "text-white/75"
                  )}
                >
                  {formatEventDate(event.eventDate)}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              className={cn(
                "rounded-full px-5",
                heroUsesLightSurface
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-white text-neutral-950 hover:bg-white/90"
              )}
              onClick={() => setUploadPanelOpen(true)}
              disabled={!event.uploadsEnabled}
            >
              + Add to album
            </Button>
            {galleryUnlocked && media.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "rounded-full",
                  heroUsesLightSurface
                    ? "border-border bg-card text-foreground hover:bg-muted"
                    : "border-white/30 bg-white/10 text-white hover:bg-white/20"
                )}
                onClick={() => openSlideshow()}
              >
                Slideshow
              </Button>
            )}
            {guestId && (
              <GuestMyUploadsDialog
                slug={slug}
                guestId={guestId}
                refreshKey={myUploadsRefreshKey}
                light={isLightAlbum}
                heroLight={heroUsesLightSurface}
              />
            )}
            {galleryUnlocked && (
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "rounded-full",
                  heroUsesLightSurface
                    ? "border-border bg-card text-foreground hover:bg-muted"
                    : "border-white/30 bg-white/10 text-white hover:bg-white/20"
                )}
                onClick={() => loadMedia(true)}
                disabled={loadingMedia}
              >
                Refresh
              </Button>
            )}
          </div>

          <p
            className={cn(
              "mt-3 text-xs",
              heroUsesLightSurface ? "text-muted-foreground" : "text-white/70"
            )}
          >
            {mediaCountLabel}
          </p>
        </div>
      </section>

      <section className="w-full space-y-2 px-1 py-2 sm:px-2">
        {event.povEnabled && event.povRevealAt && revealAt && (
          <div
            className={cn(
              "mx-2 rounded-md border p-3 text-xs",
              isLightAlbum
                ? "border-border bg-muted text-muted-foreground"
                : "border-white/10 bg-white/5 text-white/70"
            )}
          >
            Gallery will unlock on{" "}
            <span className={cn("font-semibold", isLightAlbum && "text-foreground")}>
              {formatEventDate(event.povRevealAt)}
            </span>
            . You can still upload your shots now.
          </div>
        )}

        {event.povEnabled && event.povMaxPerGuest > 0 && (
          <div
            className={cn(
              "mx-2 rounded-md border p-3 text-xs",
              isLightAlbum
                ? "border-border bg-muted text-muted-foreground"
                : "border-white/10 bg-white/5 text-white/70"
            )}
          >
            POV mode is enabled. Each guest can upload up to{" "}
            <span className={cn("font-semibold", isLightAlbum && "text-foreground")}>
              {event.povMaxPerGuest} photo
              {event.povMaxPerGuest === 1 ? "" : "s"}
            </span>
            . Try to capture your best moments!
          </div>
        )}

        {event.protected && !galleryUnlocked ? (
          <div
            className={cn(
              "mx-2 rounded-lg border p-4 sm:p-6",
              isLightAlbum
                ? "border-border bg-card"
                : "border-white/10 bg-white/5"
            )}
          >
            <div className="mx-auto max-w-sm space-y-4">
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="text-sm font-semibold">This gallery is protected</h3>
                <p className={cn("text-xs", isLightAlbum ? "text-muted-foreground" : "text-white/70")}>
                  Enter the event password to view photos and videos.
                </p>
              </div>
              <form className="space-y-3" onSubmit={handleUnlock}>
                <input
                  type="password"
                  className={cn(
                    "w-full rounded-md border px-3 py-2 text-sm",
                    isLightAlbum
                      ? "border-input bg-background text-foreground placeholder:text-muted-foreground"
                      : "border-white/15 bg-white/10 text-white placeholder:text-white/40"
                  )}
                  value={unlockPassword}
                  onChange={(e) => setUnlockPassword(e.target.value)}
                  placeholder="Gallery password"
                  autoComplete="current-password"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="w-full rounded-full"
                  disabled={unlocking || !unlockPassword.trim()}
                >
                  {unlocking ? "Unlocking…" : "Unlock gallery"}
                </Button>
              </form>
            </div>
          </div>
        ) : loadingMedia && media.length === 0 ? (
          <div className={cn("px-4 py-8 text-sm", isLightAlbum ? "text-muted-foreground" : "text-white/60")}>
            Loading media…
          </div>
        ) : revealAt && media.length === 0 ? (
          <div className={cn("px-4 py-8 text-sm", isLightAlbum ? "text-muted-foreground" : "text-white/60")}>
            Gallery is in POV reveal mode and will unlock on{" "}
            {formatEventDate(event.povRevealAt ?? revealAt)}.
          </div>
        ) : media.length === 0 ? (
          <div className={cn("px-4 py-8 text-sm", isLightAlbum ? "text-muted-foreground" : "text-white/60")}>
            No media yet. Be the first to upload!
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {media.map((item, idx) => {
                const isPhoto =
                  item.type === "photo" || item.mimeType.startsWith("image/");
                const label = item.guestName ?? "Guest";

                return (
                  <div
                    key={item.id}
                    className={cn(
                      "group relative flex flex-col overflow-hidden",
                      isLightAlbum ? "bg-card" : "bg-neutral-900"
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => openLightbox(idx)}
                      className={cn(
                        "w-full overflow-hidden focus:outline-none focus:ring-2",
                        isLightAlbum ? "focus:ring-primary/30" : "focus:ring-white/30"
                      )}
                    >
                      {isPhoto ? (
                        <img
                          src={item.url}
                          alt={label}
                          className="aspect-[4/5] w-full object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <video
                          src={item.url}
                          className="aspect-[4/5] w-full object-cover"
                          muted
                          playsInline
                        />
                      )}
                    </button>

                    <div
                      className={cn(
                        "flex items-center justify-between gap-2 border-t px-2 py-2",
                        isLightAlbum ? "border-border bg-card" : "border-white/10"
                      )}
                    >
                      {event.likesEnabled ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(item)}
                        disabled={!guestId || item.liked}
                        className={cn(
                          "h-8 gap-1.5 px-2",
                          isLightAlbum
                            ? "text-foreground hover:bg-muted"
                            : "text-white hover:bg-white/10"
                        )}
                      >
                        <HeartIcon
                          weight={item.liked ? "fill" : "regular"}
                          className={cn(
                            "size-4",
                            item.liked
                              ? "text-red-500"
                              : isLightAlbum
                                ? "text-muted-foreground"
                                : "text-white/60"
                          )}
                        />
                        <span className="text-xs font-medium">
                          {item.likesCount}
                        </span>
                      </Button>
                      ) : (
                        <span />
                      )}
                      {item.guestName && (
                        <span
                          className={cn(
                            "max-w-[50%] truncate text-[10px] sm:text-xs",
                            isLightAlbum ? "text-muted-foreground" : "text-white/60"
                          )}
                        >
                          {item.guestName}
                        </span>
                      )}
                    </div>

                    {item.caption && (
                      <div
                        className={cn(
                          "truncate px-2 pb-2 text-[10px] sm:text-xs",
                          isLightAlbum ? "text-muted-foreground" : "text-white/60"
                        )}
                      >
                        {item.caption}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {mediaHasMore && (
              <div className="flex justify-center py-4">
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "rounded-full",
                    isLightAlbum
                      ? "border-border bg-card text-foreground hover:bg-muted"
                      : "border-white/20 bg-white/5 text-white hover:bg-white/10"
                  )}
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

      <Dialog open={uploadPanelOpen} onOpenChange={setUploadPanelOpen}>
        <DialogContent className="flex max-h-[90vh] w-[min(96vw,720px)] max-w-[min(96vw,720px)] flex-col overflow-hidden sm:max-w-[min(96vw,720px)]">
            <DialogHeader>
              <DialogTitle className="text-base">Add photos & videos</DialogTitle>
            </DialogHeader>

            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
              {event.uploadsEnabled ? (
                <>
                  {event.povEnabled && event.povMaxPerGuest > 0 && (
                    <div className="rounded-md border bg-muted/40 p-3 text-xs text-muted-foreground">
                      POV mode is enabled. Each guest can upload up to{" "}
                      <span className="font-semibold">
                        {event.povMaxPerGuest} photo
                        {event.povMaxPerGuest === 1 ? "" : "s"}
                      </span>
                      . Think like a disposable camera!
                    </div>
                  )}

                  <FileDropzone
                    accept="image/*,video/*"
                    multiple
                    capture="environment"
                    disabled={uploading}
                    prompt="Drop your image here, or"
                    browseLabel="browse"
                    hint="Supports: JPG, JPEG2000, PNG"
                    onFiles={handleFilesSelected}
                  />

                  {uploads.length > 0 && (
                    <div className="space-y-3">
                      <div className="text-xs font-semibold">
                        {uploads.length} item{uploads.length === 1 ? "" : "s"} selected
                      </div>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {uploads.map((u, idx) => {
                          const isPhoto = u.file.type.startsWith("image/");
                          return (
                            <div
                              key={idx}
                              className="flex flex-col overflow-hidden rounded-lg border bg-muted"
                            >
                              <div className="flex h-36 w-full items-center justify-center overflow-hidden bg-black">
                                {isPhoto ? (
                                  <img
                                    src={URL.createObjectURL(u.file)}
                                    alt={u.file.name}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="px-2 text-center text-[11px] text-muted-foreground">
                                    {u.file.name}
                                  </div>
                                )}
                              </div>
                              <div className="space-y-1 p-2 text-xs">
                                <div className="flex items-center justify-between">
                                  <span className="max-w-[120px] truncate">
                                    {u.file.name}
                                  </span>
                                  <span className="text-[10px] text-muted-foreground">
                                    {u.status === "queued" && "Queued"}
                                    {u.status === "uploading" && `${u.progress}%`}
                                    {u.status === "done" && "Done"}
                                    {u.status === "error" && "Error"}
                                  </span>
                                </div>
                                <input
                                  className="w-full rounded-md border px-2 py-1 text-xs"
                                  placeholder="Add caption (optional)"
                                  value={u.caption}
                                  onChange={(e) =>
                                    handleUploadItemCaptionChange(idx, e.target.value)
                                  }
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {uploadSuccess && (
                    <div className="text-xs text-green-600">{uploadSuccess}</div>
                  )}
                </>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Uploads are currently disabled for this event.
                </div>
              )}
            </div>

            <DialogFooter className="flex-row justify-end border-t pt-3">
              {event.uploadsEnabled ? (
                <Button
                  type="button"
                  size="sm"
                  disabled={uploads.length === 0 || uploading}
                  className="rounded-full px-6"
                  onClick={() => handleUpload()}
                >
                  {uploading ? "Uploading…" : "Upload"}
                </Button>
              ) : null}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setUploadPanelOpen(false)}
                disabled={uploading}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="flex h-[min(92vh,900px)] w-[min(96vw,1100px)] max-w-[min(96vw,1100px)] flex-col overflow-hidden sm:max-w-[min(96vw,1100px)]">
          <DialogHeader>
            <DialogTitle className="text-base">
              {currentLightboxItem?.guestName
                ? `Media by ${currentLightboxItem.guestName}`
                : "Media"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-lg bg-neutral-950 p-2 sm:p-4">
            {currentLightboxItem ? (
              currentLightboxItem.type === "photo" ||
              currentLightboxItem.mimeType.startsWith("image/") ? (
                <img
                  src={currentLightboxItem.url}
                  alt={currentLightboxItem.guestName ?? "Media"}
                  className="max-h-full max-w-full rounded-lg object-contain"
                />
              ) : (
                <video
                  src={currentLightboxItem.url}
                  controls
                  className="max-h-full max-w-full rounded-lg object-contain"
                />
              )
            ) : (
              <div className="text-sm text-muted-foreground">
                No media available.
              </div>
            )}
          </div>

          {currentLightboxItem?.caption && (
            <p className="truncate px-1 text-sm text-muted-foreground">
              {currentLightboxItem.caption}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={lightboxIndex <= 0}
              onClick={() => setLightboxIndex((i) => i - 1)}
            >
              Previous
            </Button>

            {event.likesEnabled && (
            <Button
              type="button"
              size="sm"
              disabled={
                !currentLightboxItem ||
                !guestId ||
                currentLightboxItem.liked
              }
              onClick={() =>
                currentLightboxItem && handleLike(currentLightboxItem)
              }
              className="gap-2"
            >
              <HeartIcon
                weight={currentLightboxItem?.liked ? "fill" : "regular"}
                className={`size-4 ${currentLightboxItem?.liked ? "text-red-400" : "text-neutral-300"}`}
              />
              Like ({currentLightboxItem?.likesCount ?? 0})
            </Button>
            )}

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
        </DialogContent>
      </Dialog>

      <EventSlideshowOverlay
        open={slideshowOpen}
        onClose={() => setSlideshowOpen(false)}
        mediaPath={`/e/${slug}/media`}
        eventName={event.name}
        initialIndex={slideshowStartIndex}
      />
    </div>
  );
}