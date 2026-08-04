"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function DashboardPage() {
  const [eventCount, setEventCount] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const events = await apiFetch("/events");
        setEventCount((events as any[]).length);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Total Events</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-semibold">
          {eventCount ?? "—"}
        </CardContent>
      </Card>
      {/* Later: add more cards for media count, uploads today, etc. */}
    </div>
  );
}