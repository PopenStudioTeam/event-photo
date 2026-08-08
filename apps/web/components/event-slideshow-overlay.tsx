"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFetch, getUserFacingErrorMessage } from "@/lib/api";
import { Button } from "@/components/ui/button";

export type SlideshowMedia = {
  id: string;
  storageKey: string;
  type: "photo" | "video";
  mimeType: string;
  fileSize: number;
  guestName: string | null;
  caption: string | null;
  createdAt: string;
  url: string;
  likesCount?: number;
};

type EventSlideshowOverlayProps = {
  open: boolean;
  onClose: () => void;
  mediaPath: string;
  eventName?: string;
  initialIndex?: number;
};

const SLIDE_DURATION_MS = 4000;
const REFRESH_INTERVAL_MS = 15000;

async function fetchSlideshowMedia(mediaPath: string): Promise<SlideshowMedia[]> {
  const res = await apiFetch(mediaPath);

  if (Array.isArray(res)) {
    return res as SlideshowMedia[];
  }

  const paginated = res as { items: SlideshowMedia[]; nextCursor: string | null };
  let items = [...paginated.items];
  let cursor = paginated.nextCursor;

  while (cursor) {
    const separator = mediaPath.includes("?") ? "&" : "?";
    const next = await apiFetch(
      `${mediaPath}${separator}cursor=${encodeURIComponent(cursor)}&limit=50`
    );
    const page = next as { items: SlideshowMedia[]; nextCursor: string | null };
    items = [...items, ...page.items];
    cursor = page.nextCursor;
  }

  return items;
}

function sortNewestFirst(items: SlideshowMedia[]) {
  return [...items].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function EventSlideshowOverlay({
  open,
  onClose,
  mediaPath,
  eventName,
  initialIndex = 0,
}: EventSlideshowOverlayProps) {
  const [media, setMedia] = useState<SlideshowMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [paused, setPaused] = useState(false);

  const loadMedia = useCallback(async () => {
    if (!mediaPath) return;
    try {
      const items = sortNewestFirst(await fetchSlideshowMedia(mediaPath));
      setMedia(items);
      setError(null);
      setCurrentIndex((idx) => (items.length === 0 ? 0 : Math.min(idx, items.length - 1)));
    } catch (err) {
      console.error(err);
      setError(getUserFacingErrorMessage(err, "Failed to load slideshow media."));
    } finally {
      setLoading(false);
    }
  }, [mediaPath]);

  useEffect(() => {
    if (!open) return;

    setLoading(true);
    setError(null);
    setCurrentIndex(initialIndex);
    setPaused(false);
    loadMedia();

    const refreshTimer = setInterval(loadMedia, REFRESH_INTERVAL_MS);
    return () => clearInterval(refreshTimer);
  }, [open, initialIndex, loadMedia]);

  useEffect(() => {
    if (!open || paused || media.length <= 1) return;

    const timer = setTimeout(() => {
      setCurrentIndex((i) => (i + 1) % media.length);
    }, SLIDE_DURATION_MS);

    return () => clearTimeout(timer);
  }, [open, paused, media, currentIndex]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setCurrentIndex((i) => (media.length ? (i + 1) % media.length : 0));
      if (e.key === "ArrowLeft") setCurrentIndex((i) => (media.length ? (i - 1 + media.length) % media.length : 0));
      if (e.key === " ") {
        e.preventDefault();
        setPaused((p) => !p);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, media.length, onClose]);

  if (!open) return null;

  const current = media[currentIndex] ?? null;
  const isPhoto =
    current &&
    (current.type === "photo" || current.mimeType.startsWith("image/"));

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black text-white">
      <header className="flex flex-wrap items-center justify-between gap-2 bg-black/60 px-3 py-2 text-xs sm:text-sm">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <Button
            variant="outline"
            size="sm"
            className="border-gray-500 bg-black/40 text-gray-200 hover:bg-black/60"
            onClick={onClose}
          >
            Close
          </Button>
          <span className="truncate font-semibold">
            {eventName ? `${eventName} slideshow` : "Slideshow"}
          </span>
          {media.length > 0 && (
            <span className="text-gray-400">
              {currentIndex + 1} / {media.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-gray-500 bg-black/40 text-gray-200 hover:bg-black/60"
            onClick={() => setCurrentIndex((i) => (media.length ? (i - 1 + media.length) % media.length : 0))}
            disabled={media.length === 0}
          >
            Prev
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-gray-500 bg-black/40 text-gray-200 hover:bg-black/60"
            onClick={() => setPaused((p) => !p)}
            disabled={media.length === 0}
          >
            {paused ? "Play" : "Pause"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-gray-500 bg-black/40 text-gray-200 hover:bg-black/60"
            onClick={() => setCurrentIndex((i) => (media.length ? (i + 1) % media.length : 0))}
            disabled={media.length === 0}
          >
            Next
          </Button>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center overflow-hidden px-3 py-3 sm:px-6 sm:py-4">
        {loading ? (
          <div className="text-sm text-gray-400">Loading slideshow…</div>
        ) : error ? (
          <div className="text-sm text-red-400">{error}</div>
        ) : !current ? (
          <div className="text-center text-sm text-gray-400">
            No media yet. Upload photos to start the slideshow.
          </div>
        ) : isPhoto ? (
          <img
            key={current.id}
            src={current.url}
            alt={current.guestName ?? current.caption ?? "Slideshow image"}
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <video
            key={current.id}
            src={current.url}
            className="max-h-full max-w-full object-contain"
            autoPlay={!paused}
            muted
            loop
            playsInline
            controls={paused}
          />
        )}
      </main>

      <footer className="flex flex-wrap items-center justify-between gap-2 bg-black/60 px-3 py-2 text-xs sm:text-sm">
        <div className="flex max-w-[70vw] flex-col sm:flex-row sm:items-center sm:gap-2">
          {current?.guestName && (
            <span className="font-medium">
              {current.type === "video" ? "Video" : "Photo"} by {current.guestName}
            </span>
          )}
          {current?.caption && (
            <span className="truncate text-gray-300">{current.caption}</span>
          )}
        </div>
        {current?.createdAt && (
          <span className="text-gray-400">
            {new Date(current.createdAt).toLocaleString()}
          </span>
        )}
      </footer>
    </div>
  );
}
