"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useParams } from "next/navigation";
import { apiFetch, ApiError, getUserFacingErrorMessage } from "@/lib/api";
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

  const [event, setEvent] = useState<PublicEvent | null>(null);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [eventError, setEventError] = useState<string | null>(null);

  // Guest name and welcome step
  const [guestName, setGuestName] = useState("");
  const [welcomeDone, setWelcomeDone] = useState(false);

  // Upload state
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [uploadPanelOpen, setUploadPanelOpen] = useState(false);

  // Gallery protection
  const [galleryUnlocked, setGalleryUnlocked] = useState(false);
  const [unlockPassword, setUnlockPassword] = useState("");
  const [unlockError, setUnlockError] = useState<string | null>(null);
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
        setEventError(getUserFacingErrorMessage(err, "Failed to load event."));
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
    setUnlockError(null);

    try {
      const res = await apiFetch(`/e/${slug}/unlock`, {
        method: "POST",
        body: JSON.stringify({ password: unlockPassword }),
      });

      const { galleryToken } = res as { galleryToken?: string };
      if (!galleryToken) {
        setUnlockError("Unlock failed. Please try again.");
        return;
      }
      setGalleryUnlockToken(slug, galleryToken);
      setGalleryUnlocked(true);
      setUnlockPassword("");
    } catch (err) {
      setUnlockError(
        getUserFacingErrorMessage(err, "Incorrect password. Please try again.", {
          showAuthFailureDetail: true,
        })
      );
    } finally {
      setUnlocking(false);
    }
  };

  const handleWelcomeSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;
    setWelcomeDone(true);
  };

  const handleFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const items: UploadItem[] = files.map((file) => ({
      file,
      caption: "",
      status: "queued",
      progress: 0,
    }));

    setUploads(items);
    setUploadError(null);
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

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!event || !event.uploadsEnabled || uploads.length === 0) return;

    setUploading(true);
    setUploadError(null);
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
      loadMedia(true);
    } catch (err) {
      console.error(err);
      setUploadError(
        getUserFacingErrorMessage(err, "Failed to upload some files. Please try again.")
      );
    } finally {
      setUploading(false);
    }
  };

  const handleLike = async (item: MediaItem) => {
    try {
      const res = await apiFetch(`/e/${slug}/media/${item.id}/like`, {
        method: "POST",
      });
      const { likesCount } = res as { likesCount: number };
      setMedia((prev) =>
        prev.map((m) => (m.id === item.id ? { ...m, likesCount } : m))
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

  const bgClass =
    event.backgroundVariant === "light" ? "bg-neutral-100" : "bg-neutral-950";
  const primaryStyle = { backgroundColor: event.primaryColor || "#ffffff" };

  const coverOverlayClass =
    event.coverOverlay === "gradient"
      ? "bg-gradient-to-t from-black/70 via-black/30 to-transparent"
      : "";

  // Step 1: Welcome card
  if (!welcomeDone) {
    return (
      <div className={`flex min-h-screen items-center justify-center ${bgClass} p-4`}>
        <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900 shadow-2xl">
          <div className="relative h-56 w-full overflow-hidden sm:h-72">
            {event.coverImageUrl ? (
              <div className="relative h-full w-full">
                <img
                  src={event.coverImageUrl}
                  alt={event.name}
                  className="h-full w-full object-cover"
                />
                {event.coverOverlay === "gradient" && (
                  <div className={`absolute inset-0 ${coverOverlayClass}`} />
                )}
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-neutral-800">
                <span className="text-sm text-neutral-400">Event cover</span>
              </div>
            )}
            {event.coverImageUrl && (
              <div className="absolute bottom-4 left-4 h-14 w-14 overflow-hidden rounded-full border-2 border-white">
                <img
                  src={event.coverImageUrl}
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </div>

          <div className="space-y-4 px-6 pb-6 pt-5 text-white">
            <div className="space-y-1">
              <h1 className="text-xl font-semibold">{event.name}</h1>
              <p className="text-sm text-neutral-400">
                Share your photos and videos from this event.
              </p>
            </div>

            <form className="space-y-3 text-sm" onSubmit={handleWelcomeSubmit}>
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-300">Name</label>
                <input
                  className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white placeholder:text-neutral-500"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="mt-2 w-full rounded-full text-sm font-semibold"
                style={primaryStyle}
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
    <div className="flex-1 min-h-screen bg-background">
      <div className="max-w-5xl mx-auto p-3 sm:p-6 space-y-6">
        {/* Album hero with cover customization */}
        <section className="rounded-2xl overflow-hidden border bg-black text-white">
          <div className="relative h-40 sm:h-56 md:h-64">
            {event.coverImageUrl ? (
              <div className="relative h-full w-full">
                <img
                  src={event.coverImageUrl}
                  alt={event.name}
                  className="h-full w-full object-cover"
                />
                {event.coverOverlay === "gradient" && (
                  <div className={`absolute inset-0 ${coverOverlayClass}`} />
                )}
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted">
                <span className="text-sm text-muted-foreground">
                  Event cover
                </span>
              </div>
            )}
            <div className="absolute left-4 bottom-4 flex items-center gap-3">
              {event.coverImageUrl && (
                <div className="h-12 w-12 rounded-full border-2 border-white overflow-hidden">
                  <img
                    src={event.coverImageUrl}
                    alt="Avatar"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div>
                <div className="text-sm font-semibold">{event.name}</div>
                {event.eventDate && (
                  <div className="text-[11px] text-gray-300">
                    {new Date(event.eventDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 sm:px-6 bg-black/70">
            <div className="text-xs text-gray-300">
              {event.protected && !galleryUnlocked
                ? "Gallery locked"
                : `${media.length} photo${media.length === 1 ? "" : "s"} & video${
                    media.length === 1 ? "" : "s"
                  }`}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {galleryUnlocked && media.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-neutral-600 bg-neutral-900 text-white hover:bg-neutral-800"
                  onClick={() => openSlideshow()}
                >
                  Start slideshow
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="border-neutral-600 bg-neutral-900 text-white hover:bg-neutral-800"
                onClick={() => setUploadPanelOpen(true)}
                disabled={!event.uploadsEnabled}
              >
                + Add to album
              </Button>
              <span className="text-[11px] text-gray-400">
                Uploads: {event.uploadsEnabled ? "Enabled" : "Disabled"}
              </span>
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section className="rounded-xl border bg-background p-3 sm:p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold">Gallery</h2>
            <div className="flex items-right gap-2">
              {galleryUnlocked && media.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openSlideshow()}
                >
                  Slideshow
                </Button>
              )}
              {galleryUnlocked && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loadMedia(true)}
                  disabled={loadingMedia}
                >
                  Refresh
                </Button>
              )}
            </div>
          </div>

          {event.povEnabled && event.povRevealAt && revealAt && (
            <div className="rounded-md border bg-muted/40 p-3 text-xs text-muted-foreground mb-2">
              Gallery will unlock on{" "}
              <span className="font-semibold">
                {new Date(event.povRevealAt).toLocaleDateString()}
              </span>
              . You can still upload your shots now.
            </div>
          )}

          {event.povEnabled && event.povMaxPerGuest > 0 && (
            <div className="rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground mb-2">
              POV mode is enabled. Each guest can upload up to{" "}
              <span className="font-semibold">
                {event.povMaxPerGuest} photo
                {event.povMaxPerGuest === 1 ? "" : "s"}
              </span>
              . Try to capture your best moments!
            </div>
          )}

          {event.protected && !galleryUnlocked ? (
            <div className="rounded-lg border bg-muted/40 p-4 sm:p-6">
              <div className="mx-auto max-w-sm space-y-4">
                <div className="space-y-1 text-center sm:text-left">
                  <h3 className="text-sm font-semibold">This gallery is protected</h3>
                  <p className="text-xs text-muted-foreground">
                    Enter the event password to view photos and videos.
                  </p>
                </div>
                <form className="space-y-3" onSubmit={handleUnlock}>
                  <input
                    type="password"
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                    value={unlockPassword}
                    onChange={(e) => setUnlockPassword(e.target.value)}
                    placeholder="Gallery password"
                    autoComplete="current-password"
                  />
                  {unlockError && (
                    <div className="text-xs text-red-500">{unlockError}</div>
                  )}
                  <Button
                    type="submit"
                    size="sm"
                    className="w-full"
                    disabled={unlocking || !unlockPassword.trim()}
                  >
                    {unlocking ? "Unlocking…" : "Unlock gallery"}
                  </Button>
                </form>
              </div>
            </div>
          ) : loadingMedia && media.length === 0 ? (
            <div className="text-sm text-muted-foreground">Loading media…</div>
          ) : revealAt && media.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              Gallery is in POV reveal mode and will unlock on{" "}
              {new Date(event.povRevealAt ?? revealAt).toLocaleDateString()}.
            </div>
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
                  const label = item.guestName ?? "Guest";

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

                      <div className="flex items-center justify-between gap-2 border-t bg-background/80 px-2 py-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(item)}
                          className="h-8 gap-1.5 px-2 text-foreground hover:bg-muted"
                        >
                          <HeartIcon weight="fill" className="size-4 text-red-500" />
                          <span className="text-xs font-medium">
                            {item.likesCount}
                          </span>
                        </Button>
                        {item.guestName && (
                          <span className="max-w-[50%] truncate text-[10px] text-muted-foreground sm:text-xs">
                            {item.guestName}
                          </span>
                        )}
                      </div>

                      {item.caption && (
                        <div className="px-2 pb-2 text-[10px] sm:text-xs text-muted-foreground truncate">
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

        {/* Upload dialog */}
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

                  <div className="space-y-2">
                    <label className="text-xs font-medium">
                      Pick files (you can add more)
                    </label>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      capture="environment"
                      onChange={handleFilesChange}
                      className="text-xs"
                    />
                  </div>

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

                  <form onSubmit={handleUpload} className="space-y-3 text-sm">
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <Button
                        type="submit"
                        size="sm"
                        disabled={uploads.length === 0 || uploading}
                        className="rounded-full px-6"
                      >
                        {uploading ? "Uploading…" : "Upload"}
                      </Button>
                      <span className="text-xs text-muted-foreground">
                        Uploading as{" "}
                        <span className="font-semibold">{guestName}</span>
                      </span>
                    </div>

                    {uploadError && (
                      <div className="mt-2 text-xs text-red-500">{uploadError}</div>
                    )}
                    {uploadSuccess && (
                      <div className="mt-2 text-xs text-green-600">
                        {uploadSuccess}
                      </div>
                    )}
                  </form>
                </>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Uploads are currently disabled for this event.
                </div>
              )}
            </div>

            <DialogFooter className="border-t pt-3">
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
      </div>

      {/* Lightbox modal */}
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

            <Button
              type="button"
              variant="default"
              size="sm"
              disabled={!currentLightboxItem}
              onClick={() =>
                currentLightboxItem && handleLike(currentLightboxItem)
              }
              className="gap-2 bg-neutral-900 text-white hover:bg-neutral-800"
            >
              <HeartIcon weight="fill" className="size-4 text-red-400" />
              Like ({currentLightboxItem?.likesCount ?? 0})
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