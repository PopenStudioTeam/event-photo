"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, ChevronLeft, ChevronRight } from "lucide-react";
import { formatEventDate } from "@/lib/format-date";
import { getCategoryLabel } from "@/lib/event-categories";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export type CalendarEvent = {
  id: string;
  name: string;
  slug: string;
  category: string;
  eventDate: string | null;
  mediaCount: number;
  plan: string;
  uploadsEnabled?: boolean;
  protected?: boolean;
  createdAt: string;
};

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const WEEKDAYS_SHORT = ["M", "T", "W", "T", "F", "S", "S"];

const CATEGORY_COLORS: Record<string, string> = {
  wedding: "bg-violet-500/15 text-violet-700 ring-violet-500/20 dark:text-violet-300",
  party: "bg-pink-500/15 text-pink-700 ring-pink-500/20 dark:text-pink-300",
  conference: "bg-teal-500/15 text-teal-700 ring-teal-500/20 dark:text-teal-300",
  birthday: "bg-orange-500/15 text-orange-700 ring-orange-500/20 dark:text-orange-300",
  other: "bg-sky-500/15 text-sky-700 ring-sky-500/20 dark:text-sky-300",
};

const CATEGORY_DOTS: Record<string, string> = {
  wedding: "bg-violet-500",
  party: "bg-pink-500",
  conference: "bg-teal-500",
  birthday: "bg-orange-500",
  other: "bg-sky-500",
};

function parseDate(value: string | Date | null | undefined): Date | null {
  if (!value) return null;
  const date = value instanceof Date ? value : /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T12:00:00`)
    : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function sameDay(a: Date, b: Date) {
  return toDateKey(a) === toDateKey(b);
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function mondayIndex(date: Date) {
  const day = date.getDay();
  return day === 0 ? 6 : day - 1;
}

function buildMonthCells(viewDate: Date) {
  const first = startOfMonth(viewDate);
  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const leading = mondayIndex(first);
  const total = Math.ceil((leading + daysInMonth) / 7) * 7;
  const cells: Array<{ date: Date; inMonth: boolean }> = [];

  for (let i = 0; i < total; i += 1) {
    const date = new Date(first);
    date.setDate(1 - leading + i);
    cells.push({
      date,
      inMonth: date.getMonth() === viewDate.getMonth(),
    });
  }

  return cells;
}

export function EventCalendar({
  events,
  today,
}: {
  events: CalendarEvent[];
  today: Date;
}) {
  const router = useRouter();
  const [viewDate, setViewDate] = useState(() => startOfMonth(today));
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const datedEvents = useMemo(() => {
    return events
      .map((event) => ({
        event,
        date: parseDate(event.eventDate) ?? parseDate(event.createdAt),
      }))
      .filter((item): item is { event: CalendarEvent; date: Date } => item.date !== null);
  }, [events]);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const { event, date } of datedEvents) {
      const key = toDateKey(date);
      const list = map.get(key) ?? [];
      list.push(event);
      map.set(key, list);
    }
    return map;
  }, [datedEvents]);

  const monthEvents = useMemo(() => {
    return datedEvents
      .filter(({ date }) => date.getMonth() === viewDate.getMonth() && date.getFullYear() === viewDate.getFullYear())
      .map(({ event }) => event);
  }, [datedEvents, viewDate]);

  const selectedKey = toDateKey(selectedDate);
  const selectedEvents = eventsByDay.get(selectedKey) ?? [];
  const cells = buildMonthCells(viewDate);
  const monthLabel = viewDate.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  const openEvent = (slug: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("eventphoto_current_slug", slug);
    }
    router.push(`/events/${slug}`);
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_18rem]">
      <section className="rounded-2xl border border-border/70 bg-card p-3 shadow-sm sm:p-5">
        <div className="mb-3 flex flex-col gap-3 sm:mb-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            {monthEvents.length} {monthEvents.length === 1 ? "event" : "events"} this month
          </p>

          <div className="flex items-center justify-between gap-2 sm:justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const next = startOfMonth(today);
                setViewDate(next);
                setSelectedDate(today);
              }}
            >
              Today
            </Button>
            <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Previous month"
              onClick={() => setViewDate((current) => addMonths(current, -1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-28 text-center text-sm font-medium capitalize sm:min-w-38">
              {monthLabel}
            </div>
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Next month"
              onClick={() => setViewDate((current) => addMonths(current, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px overflow-hidden rounded-xl border border-border/70 bg-border/70">
          {WEEKDAYS.map((day, index) => (
            <div
              key={`${day}-${index}`}
              className="bg-muted/60 px-0.5 py-1 text-center text-[10px] font-semibold uppercase tracking-wide text-muted-foreground sm:px-1"
            >
              <span className="sm:hidden">{WEEKDAYS_SHORT[index]}</span>
              <span className="hidden sm:inline">{day}</span>
            </div>
          ))}

          {cells.map(({ date, inMonth }) => {
            const key = toDateKey(date);
            const dayEvents = eventsByDay.get(key) ?? [];
            const visible = dayEvents.slice(0, 2);
            const extra = dayEvents.length - visible.length;
            const isToday = sameDay(date, today);
            const isSelected = sameDay(date, selectedDate);

            const selectDay = () => {
              setSelectedDate(date);
              if (date.getMonth() !== viewDate.getMonth()) {
                setViewDate(startOfMonth(date));
              }
            };

            return (
              <button
                key={key}
                type="button"
                onClick={selectDay}
                className={cn(
                  "flex min-h-11 flex-col items-stretch gap-0.5 bg-card p-0.5 text-left transition-colors hover:bg-muted/50 sm:min-h-24 sm:p-1",
                  !inMonth && "bg-muted/30",
                  isSelected && "bg-primary/10 hover:bg-primary/15"
                )}
              >
                <span className="flex items-center justify-between gap-0.5">
                  <span
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-medium",
                      isSelected && "bg-primary text-primary-foreground",
                      !isSelected && isToday && "bg-primary/15 text-primary",
                      !isSelected && !isToday && inMonth && "text-foreground",
                      !isSelected && !isToday && !inMonth && "text-muted-foreground"
                    )}
                  >
                    {date.getDate()}
                  </span>
                  {dayEvents.length > 0 && (
                    <span className="hidden rounded-full bg-primary/15 px-1.5 text-[10px] font-semibold tabular-nums text-primary sm:inline">
                      {dayEvents.length}
                    </span>
                  )}
                </span>

                <span className="flex justify-center gap-0.5 sm:hidden">
                  {dayEvents.slice(0, 3).map((event) => (
                    <span
                      key={event.id}
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        CATEGORY_DOTS[event.category] ?? CATEGORY_DOTS.other
                      )}
                    />
                  ))}
                </span>

                <span className="hidden min-w-0 space-y-0.5 sm:block">
                  {visible.map((event) => (
                    <span
                      key={event.id}
                      className={cn(
                        "block w-full truncate rounded px-1 py-0.5 text-[10px] font-medium ring-1",
                        CATEGORY_COLORS[event.category] ?? CATEGORY_COLORS.other
                      )}
                    >
                      {event.name}
                    </span>
                  ))}
                  {extra > 0 && (
                    <span className="block px-1 text-[10px] font-semibold tabular-nums text-primary">
                      +{extra}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <aside className="space-y-4">
        <section className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
          <h3 className="text-sm font-semibold">
            {sameDay(selectedDate, today) ? "Today's events" : formatEventDate(selectedDate)}
          </h3>
          <div className="mt-3 space-y-2">
            {selectedEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground">No events on this day.</p>
            ) : (
              selectedEvents.map((event) => (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => setSelectedEvent(event)}
                  className="flex w-full items-start gap-3 rounded-xl border border-border/70 p-3 text-left hover:bg-muted/40"
                >
                  <span
                    className={cn(
                      "mt-1 h-2.5 w-2.5 shrink-0 rounded-full",
                      CATEGORY_DOTS[event.category] ?? CATEGORY_DOTS.other
                    )}
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">{event.name}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {getCategoryLabel(event.category)} · {event.mediaCount} uploads
                    </span>
                  </span>
                </button>
              ))
            )}
          </div>
        </section>
      </aside>

      <Dialog open={Boolean(selectedEvent)} onOpenChange={(open) => !open && setSelectedEvent(null)}>
        <DialogContent className="max-w-md rounded-2xl sm:max-w-md">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle className="text-base">{selectedEvent.name}</DialogTitle>
                <DialogDescription>
                  {selectedEvent.eventDate
                    ? formatEventDate(selectedEvent.eventDate)
                    : "No event date set"}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-3 text-sm">
                <div className="flex items-center justify-between rounded-xl bg-muted/50 px-3 py-2">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-medium">{getCategoryLabel(selectedEvent.category)}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-muted/50 px-3 py-2">
                  <span className="text-muted-foreground">Plan</span>
                  <span className="font-medium capitalize">{selectedEvent.plan}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-muted/50 px-3 py-2">
                  <span className="text-muted-foreground">Uploads</span>
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    <Camera className="h-3.5 w-3.5" />
                    {selectedEvent.mediaCount}
                  </span>
                </div>
                {typeof selectedEvent.uploadsEnabled === "boolean" && (
                  <div className="flex items-center justify-between rounded-xl bg-muted/50 px-3 py-2">
                    <span className="text-muted-foreground">Guest uploads</span>
                    <span className="font-medium">
                      {selectedEvent.uploadsEnabled ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                )}
                {typeof selectedEvent.protected === "boolean" && (
                  <div className="flex items-center justify-between rounded-xl bg-muted/50 px-3 py-2">
                    <span className="text-muted-foreground">Gallery</span>
                    <span className="font-medium">
                      {selectedEvent.protected ? "Password protected" : "Open"}
                    </span>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedEvent(null)}>
                  Close
                </Button>
                <Button onClick={() => openEvent(selectedEvent.slug)}>Open event</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
