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
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card className="sm:col-span-2 lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Total Events</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-semibold sm:text-3xl">
          {eventCount ?? "—"}
        </CardContent>
      </Card>
    </div>
  );
}