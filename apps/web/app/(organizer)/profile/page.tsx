"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { apiFetch } from "@/lib/api";
import { getOrganizer, type OrganizerUser } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const [organizer, setOrganizer] = useState<OrganizerUser | null>(null);
  const [eventCount, setEventCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setOrganizer(getOrganizer());

    const loadEvents = async () => {
      try {
        const events = await apiFetch<{ id: string }[]>("/events");
        setEventCount(events.length);
      } catch (err) {
        console.error(err);
        setError("Failed to load profile details.");
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div>
        <h1 className="text-lg font-semibold sm:text-xl">Profile</h1>
        <p className="text-sm text-muted-foreground">
          Your organizer account details.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <div className="text-xs font-medium text-muted-foreground">
              Email
            </div>
            <div className="mt-1 break-all">
              {organizer?.email ?? "Not available"}
            </div>
          </div>

          <div>
            <div className="text-xs font-medium text-muted-foreground">
              Account ID
            </div>
            <div className="mt-1 break-all font-mono text-xs">
              {organizer?.id ?? "—"}
            </div>
          </div>

          <div>
            <div className="text-xs font-medium text-muted-foreground">
              Events created
            </div>
            <div className="mt-1">
              {loading ? "Loading…" : (eventCount ?? 0)}
            </div>
          </div>

          {error && <div className="text-xs text-red-500">{error}</div>}

          <div className="flex flex-col gap-2 pt-2 sm:flex-row">
            <Link href="/events">
              <Button variant="outline" size="sm">
                View events
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="outline" size="sm">
                Billing settings
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
