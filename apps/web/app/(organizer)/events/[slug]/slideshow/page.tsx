"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";

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

const SLIDE_DURATION_MS = 8000; // 8s per slide
const REFRESH_INTERVAL_MS = 15000; // refresh media every 15s

export default function EventSlideshowPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // Load media initially and refresh periodically
  useEffect(() => {
    let refreshTimer: NodeJS.Timeout | null = null;

    const loadMedia = async () => {
      if (!slug) return;
      try {
        const res = await apiFetch(`/events/${slug}/media`);
        const items = res as Media[];

        // Sort newest first
        const sorted = [...items].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        );

        setMedia(sorted);
        setLoading(false);

        if (sorted.length > 0 && currentIndex >= sorted.length) {
          setCurrentIndex(0);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load media for slideshow.");
        setLoading(false);
      }
    };

    loadMedia();
    refreshTimer = setInterval(loadMedia, REFRESH_INTERVAL_MS);

    return () => {
      if (refreshTimer) clearInterval(refreshTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // Auto-advance slides
  useEffect(() => {
    if (paused || media.length <= 1) return;

    const timer = setTimeout(() => {
      setCurrentIndex((i) => (i + 1) % media.length);
    }, SLIDE_DURATION_MS);

    return () => clearTimeout(timer);
  }, [paused, media, currentIndex]);

  const handleNext = () => {
    if (media.length === 0) return;
    setCurrentIndex((i) => (i + 1) % media.length);
  };

  const handlePrev = () => {
    if (media.length === 0) return;
    setCurrentIndex((i) => (i - 1 + media.length) % media.length);
  };

  const handleTogglePause = () => {
    setPaused((p) => !p);
  };

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else if (slug) {
      router.push(`/events/${slug}`);
    } else {
      router.push("/events");
    }
  };

  const current = media[currentIndex] ?? null;
  const isPhoto =
    current &&
    (current.type === "photo" ||
      current.mimeType.startsWith("image/"));

  return (
    <div className="fixed inset-0 bg-black text-white flex flex-col">
      {/* Top bar */}
      <header className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-xs sm:text-sm bg-black/60">
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="outline"
            size="sm"
            className="border-gray-500 text-gray-200 bg-black/40 hover:bg-black/60"
            onClick={handleBack}
          >
            Back
          </Button>
          <span className="font-semibold truncate">Event slideshow</span>
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
            className="border-gray-500 text-gray-200 bg-black/40 hover:bg-black/60"
            onClick={handlePrev}
            disabled={media.length === 0}
          >
            Prev
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-gray-500 text-gray-200 bg-black/40 hover:bg-black/60"
            onClick={handleTogglePause}
            disabled={media.length === 0}
          >
            {paused ? "Play" : "Pause"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-gray-500 text-gray-200 bg-black/40 hover:bg-black/60"
            onClick={handleNext}
            disabled={media.length === 0}
          >
            Next
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center overflow-hidden px-3 py-3 sm:px-6 sm:py-4">
        <div className="w-full h-full flex items-center justify-center">
          {loading ? (
            <div className="text-sm text-gray-400">Loading media…</div>
          ) : error ? (
            <div className="text-sm text-red-400">{error}</div>
          ) : !current ? (
            <div className="text-sm text-gray-400 text-center">
              No media yet. Upload some content to start the slideshow.
            </div>
          ) : isPhoto ? (
            <img
              src={current.url}
              alt={current.guestName ?? current.caption ?? "Slideshow image"}
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <video
              src={current.url}
              className="max-w-full max-h-full object-contain"
              autoPlay={!paused}
              muted
              loop
              controls={paused}
            />
          )}
        </div>
      </main>

      {/* Footer info bar */}
      <footer className="px-3 py-2 text-xs sm:text-sm bg-black/60 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 max-w-[70vw]">
          {current?.guestName && (
            <span className="font-medium">
              {current.type === "video" ? "Video" : "Photo"} by{" "}
              {current.guestName}
            </span>
          )}
          {current?.caption && (
            <span className="text-gray-300 truncate">
              {current.caption}
            </span>
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