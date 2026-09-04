"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch, reportApiError } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { eventPlanSettingsPath, type EventPlan, type PaymentStatus } from "@/lib/plans";

type Event = {
  id: string;
  slug: string;
  name: string;
  plan: EventPlan;
  paymentStatus: PaymentStatus;
};

export default function SettingsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await apiFetch("/events");
        setEvents(result as Event[]);
      } catch (err) {
        reportApiError(err, "Failed to load billing settings.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className="text-sm text-muted-foreground">
        Loading billing settings…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">Event plans</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            Each event has its own plan. Open an event to choose Free, Premium,
            or Pro.
          </p>
          {events.length === 0 ? (
            <p>Create an event before choosing a plan.</p>
          ) : (
            <div className="space-y-2">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex flex-col gap-2 rounded-md border p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-foreground">
                      {event.name}
                    </div>
                    <div className="text-xs capitalize">
                      Current plan: {event.plan} · {event.paymentStatus}
                    </div>
                  </div>
                  <Link
                    href={eventPlanSettingsPath(event.slug)}
                    className="inline-flex h-8 items-center justify-center rounded-md border bg-background px-3 text-sm font-medium text-foreground hover:bg-muted"
                  >
                    Choose plan
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
