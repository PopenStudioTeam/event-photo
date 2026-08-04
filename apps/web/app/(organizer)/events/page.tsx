"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
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
  key: string;
  url: string;
  guestName: string | null;
  createdAt: string;
};

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

  return (
    <div className="flex-1 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Events</h2>
        <Button variant="outline" size="sm" onClick={handleNewEvent}>
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
        <div className="overflow-x-auto rounded-lg border bg-background">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-4 py-2 text-left font-medium">Name</th>
                <th className="px-4 py-2 text-left font-medium">Date</th>
                <th className="px-4 py-2 text-left font-medium">Slug</th>
                <th className="px-4 py-2 text-left font-medium">Uploads</th>
                <th className="px-4 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((evt) => (
                <tr key={evt.id} className="border-t">
                  <td className="px-4 py-2 align-middle">
                    {evt.name || "Untitled Event"}
                  </td>
                  <td className="px-4 py-2 align-middle">
                    {evt.eventDate
                      ? new Date(evt.eventDate).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-4 py-2 align-middle">
                    <span className="font-mono text-xs break-all">{evt.slug}</span>
                  </td>
                  <td className="px-4 py-2 align-middle">
                    {evt.uploadsEnabled ? "Enabled" : "Disabled"}
                  </td>
                  <td className="px-4 py-2 align-middle text-right">
                    <div className="inline-flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEvent(evt.slug)}
                      >
                        Open
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDocumentationGallery(evt)}
                      >
                        View documentation
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Gallery modal */}
      <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
        <DialogContent className="max-w-5xl w-[95vw] rounded-xl">
          <DialogHeader>
            <DialogTitle>
              {galleryEvent
                ? `Documentation for "${galleryEvent.name || galleryEvent.slug}"`
                : "Documentation"}
            </DialogTitle>
          </DialogHeader>

          <div className="pt-2">
            {loadingMedia ? (
              <div className="text-sm text-muted-foreground">Loading photos…</div>
            ) : media.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                No documentation uploaded yet for this event.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {media.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => openLightbox(idx)}
                    className="group relative overflow-hidden rounded-lg border bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <img
                      src={item.url}
                      alt={item.guestName ?? "Documentation photo"}
                      className="w-full h-40 object-cover transition-transform group-hover:scale-105"
                    />
                    {item.guestName && (
                      <div className="absolute inset-x-0 bottom-0 bg-black/60 px-2 py-1 text-[10px] text-white">
                        {item.guestName}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <DialogFooter className="mt-4 flex justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setGalleryOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lightbox modal */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-[95vw] w-full h-[90vh] rounded-xl flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {media[lightboxIndex]?.guestName
                ? `Photo by ${media[lightboxIndex].guestName}`
                : "Documentation photo"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-hidden flex items-center justify-center bg-muted/30 rounded-lg p-4">
            {media[lightboxIndex] ? (
              <img
                src={media[lightboxIndex].url}
                alt={media[lightboxIndex].guestName ?? "Documentation photo"}
                className="max-w-full max-h-full rounded-lg object-contain"
              />
            ) : (
              <div className="text-sm text-muted-foreground">
                No image available.
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

          <DialogFooter className="mt-3 flex justify-end">
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

      <NewEventDialog open={newEventOpen} onOpenChange={setNewEventOpen} />
    </div>
  );
}