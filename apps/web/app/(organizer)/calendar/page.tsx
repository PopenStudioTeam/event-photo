"use client";

import { useEffect, useState } from "react";
import { apiFetch, reportApiError } from "@/lib/api";
import { EventCalendar, type CalendarEvent } from "@/components/event-calendar";

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [today, setToday] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setToday(new Date());

    const load = async () => {
      setLoading(true);
      try {
        const res = (await apiFetch("/events")) as CalendarEvent[];
        setEvents(res);
      } catch (err) {
        reportApiError(err, "Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading || !today) {
    return <div className="text-sm text-muted-foreground">Loading calendar…</div>;
  }

  return <EventCalendar events={events} today={today} />;
}
