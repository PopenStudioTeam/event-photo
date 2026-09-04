"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Camera, MoreHorizontal } from "lucide-react";
import { apiFetch, reportApiError } from "@/lib/api";
import { formatEventDate } from "@/lib/format-date";
import { NewEventDialog } from "@/components/new-event-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Event = {
  id: string;
  name: string;
  slug: string;
  eventDate: string | null;
  mediaCount: number;
  plan: string;
  createdAt: string;
};

export default function EventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEventOpen, setNewEventOpen] = useState(false);
  const [currentSlug, setCurrentSlug] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = (await apiFetch("/events")) as Event[];
        setEvents(res);
        if (typeof window !== "undefined") {
          setCurrentSlug(localStorage.getItem("eventphoto_current_slug"));
        }
      } catch (err) {
        reportApiError(err, "Failed to load events");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleOpenEvent = (slug: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("eventphoto_current_slug", slug);
    }
    router.push(`/events/${slug}`);
  };

  const handleDeleteEvent = async (evt: Event) => {
    const confirmed = window.confirm(
      `Delete "${evt.name}"? This cannot be undone. Events with a past date or any uploads cannot be deleted.`
    );
    if (!confirmed) return;

    try {
      await apiFetch(`/events/${evt.slug}`, { method: "DELETE" });
      setEvents((prev) => prev.filter((item) => item.id !== evt.id));
      if (currentSlug === evt.slug) {
        setCurrentSlug(null);
        if (typeof window !== "undefined") {
          localStorage.removeItem("eventphoto_current_slug");
        }
      }
    } catch (err) {
      reportApiError(err, "Failed to delete event");
    }
  };

  return (
    <div className="min-w-0 space-y-6">
      <div className="space-y-1">
        <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
          My Events
        </h2>
        <p className="text-sm text-muted-foreground">
          Here you can find all your events or create new ones.
        </p>
      </div>

      <Button
        variant="outline"
        className="rounded-xl border-primary text-primary hover:bg-primary/5"
        onClick={() => setNewEventOpen(true)}
      >
        + Create new event
      </Button>

      {loading ? (
        <div className="text-sm text-muted-foreground">Loading events…</div>
      ) : events.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          No events yet. Create your first event to get started.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {events.map((evt) => {
            const isCurrent = currentSlug === evt.slug;
            return (
              <div
                key={evt.id}
                className={`flex flex-col rounded-2xl border bg-card p-5 shadow-sm ${
                  isCurrent ? "border-primary" : "border-border/70"
                }`}
              >
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold">{evt.name}</h3>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      <span className="inline-block rounded-full bg-muted px-2 py-0.5 text-[11px] capitalize text-muted-foreground">
                        {evt.plan} plan
                      </span>
                      {isCurrent && (
                        <span className="inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                          Current
                        </span>
                      )}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="rounded-lg p-1 text-muted-foreground hover:bg-muted">
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl">
                      <DropdownMenuItem
                        className="cursor-pointer rounded-lg"
                        onClick={() => handleOpenEvent(evt.slug)}
                      >
                        Open dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer rounded-lg"
                        onClick={() => router.push(`/events/${evt.slug}/settings`)}
                      >
                        Event settings
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer rounded-lg text-destructive"
                        onClick={() => void handleDeleteEvent(evt)}
                      >
                        Delete event
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mb-4 space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Camera className="h-4 w-4 text-primary" />
                    {evt.mediaCount ?? 0} uploads
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    Created on {formatEventDate(evt.createdAt)}
                  </div>
                </div>

                <div className="mt-auto border-t pt-4">
                  <button
                    type="button"
                    className="text-sm font-medium text-primary hover:underline"
                    onClick={() => handleOpenEvent(evt.slug)}
                  >
                    View Event →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <NewEventDialog open={newEventOpen} onOpenChange={setNewEventOpen} />
    </div>
  );
}
