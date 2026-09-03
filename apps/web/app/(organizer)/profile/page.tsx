"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Camera, ChevronRight } from "lucide-react";

import {
  getOrganizer,
  organizerInitials,
  saveOrganizer,
  type OrganizerUser,
} from "@/lib/auth";
import { getCategoryLabel } from "@/lib/event-categories";
import { formatEventDate } from "@/lib/format-date";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiFetch, reportApiError, showErrorAlert, showSuccessToast } from "@/lib/api";
import { cn } from "@/lib/utils";

type Plan = "free" | "premium" | "pro";
type PaymentStatus = "free" | "pending" | "paid" | "failed" | "refunded";

type ProfileEvent = {
  id: string;
  slug: string;
  name: string;
  category: string;
  plan: Plan;
  paymentStatus: PaymentStatus;
  paidAt: string | null;
  eventDate: string | null;
  createdAt: string;
  mediaCount: number;
};

const PLAN_LABEL: Record<Plan, string> = {
  free: "Free",
  premium: "Premium",
  pro: "Pro",
};

const STATUS_STYLE: Record<PaymentStatus, string> = {
  paid: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  pending: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  free: "bg-muted text-muted-foreground",
  failed: "bg-orange-500/15 text-orange-700 dark:text-orange-300",
  refunded: "bg-orange-500/15 text-orange-700 dark:text-orange-300",
};

function formatListDate(value: string | null) {
  if (!value) return "—";
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T12:00:00`)
    : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function StatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium capitalize",
        STATUS_STYLE[status]
      )}
    >
      {status}
    </span>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
      <div className="text-xs font-medium text-muted-foreground">{title}</div>
      <div className="mt-2 text-3xl font-semibold tabular-nums">{value}</div>
    </div>
  );
}

function DetailBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-muted/60 px-3 py-2.5">
      <div className="text-[11px] font-medium text-muted-foreground">{label}</div>
      <div className="mt-0.5 break-all text-sm font-medium">{value}</div>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [organizer, setOrganizer] = useState<OrganizerUser | null>(null);
  const [name, setName] = useState("");
  const [events, setEvents] = useState<ProfileEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingName, setSavingName] = useState(false);

  useEffect(() => {
    const load = async () => {
      const local = getOrganizer();
      if (local) {
        setOrganizer(local);
        setName(local.name?.trim() ?? "");
      }

      try {
        const [me, result] = await Promise.all([
          apiFetch<{ organizer: OrganizerUser }>("/auth/me"),
          apiFetch("/events"),
        ]);
        setOrganizer(me.organizer);
        setName(me.organizer.name?.trim() ?? "");
        saveOrganizer(me.organizer);
        setEvents(result as ProfileEvent[]);
      } catch (err) {
        console.error(err);
        reportApiError(err, "Failed to load profile details.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const saveName = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      showErrorAlert("Enter a name.");
      return;
    }

    setSavingName(true);
    try {
      const response = await apiFetch<{ organizer: OrganizerUser }>("/auth/me", {
        method: "PATCH",
        body: JSON.stringify({ name: trimmed }),
      });
      setOrganizer(response.organizer);
      setName(response.organizer.name?.trim() ?? trimmed);
      saveOrganizer(response.organizer);
      showSuccessToast("Name updated.");
    } catch (err) {
      reportApiError(err, "Failed to update name.");
    } finally {
      setSavingName(false);
    }
  };

  const stats = useMemo(() => {
    const paid = events.filter((event) => event.paymentStatus === "paid").length;
    const free = events.filter((event) => event.plan === "free").length;
    return {
      all: events.length,
      paid,
      free,
    };
  }, [events]);

  const subscriptions = useMemo(() => {
    return [...events].sort((a, b) => {
      const rank = (event: ProfileEvent) => {
        if (event.paymentStatus === "paid") return 0;
        if (event.paymentStatus === "pending") return 1;
        if (event.plan !== "free") return 2;
        return 3;
      };
      return rank(a) - rank(b);
    });
  }, [events]);

  const openEvent = (slug: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("eventphoto_current_slug", slug);
    }
    router.push(`/events/${slug}`);
  };

  const displayName = organizer?.name?.trim() || "Organizer";
  const initials = organizerInitials(organizer?.email, organizer?.name);

  return (
    <div className="grid gap-4 md:grid-cols-[minmax(16rem,20rem)_minmax(0,1fr)] xl:grid-cols-[22rem_minmax(0,1fr)]">
      <div>
        <section className="relative rounded-2xl border border-border/70 bg-card p-5 shadow-sm md:sticky md:top-4">
          <div className="flex flex-col items-center text-center">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="bg-primary/15 text-xl font-semibold text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <h2 className="mt-4 font-heading text-lg font-semibold tracking-tight">
              {displayName}
            </h2>
            <span className="mt-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
              Organizer
            </span>
          </div>

          <div className="mt-5 space-y-2 text-left">
            <Label htmlFor="organizer-name">Name</Label>
            <Input
              id="organizer-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              className="h-9 rounded-xl text-sm"
              maxLength={80}
            />
            <Button
              className="w-full rounded-xl"
              onClick={saveName}
              disabled={savingName}
            >
              {savingName ? "Saving…" : "Save name"}
            </Button>
          </div>

          <Link href="/settings" className="mt-3 block">
            <Button variant="outline" className="w-full rounded-xl">
              Billing settings
            </Button>
          </Link>

          <div className="mt-5 space-y-2">
            <DetailBox
              label="Email"
              value={organizer?.email ?? "Not available"}
            />
            <DetailBox
              label="Events created"
              value={loading ? "Loading…" : String(stats.all)}
            />
          </div>
        </section>
      </div>

      <div className="min-w-0 space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <StatCard title="All events" value={stats.all} />
          <StatCard title="Paid plans" value={stats.paid} />
          <StatCard title="Free plans" value={stats.free} />
        </div>

        <section className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold">Subscriptions</h3>
            <Link
              href="/settings"
              className="text-xs font-medium text-primary hover:underline"
            >
              Manage billing
            </Link>
          </div>

          {loading ? (
            <p className="text-sm text-muted-foreground">Loading subscriptions…</p>
          ) : subscriptions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No events yet. Plans are attached to each event after you create one.
            </p>
          ) : (
            <div className="space-y-2">
              {subscriptions.map((event) => (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => openEvent(event.slug)}
                  className="flex w-full items-center gap-3 rounded-xl border border-border/70 p-3 text-left transition-colors hover:bg-muted/40"
                >
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{event.name}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {PLAN_LABEL[event.plan]}
                      {event.paidAt ? ` · Paid ${formatEventDate(event.paidAt)}` : ""}
                    </div>
                  </div>
                  <StatusBadge status={event.paymentStatus} />
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold">Events</h3>
            <Link
              href="/events"
              className="text-xs font-medium text-primary hover:underline"
            >
              View all
            </Link>
          </div>

          {loading ? (
            <p className="text-sm text-muted-foreground">Loading events…</p>
          ) : events.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No events yet. Create an event to see it here.
            </p>
          ) : (
            <div className="space-y-2">
              {events.map((event) => (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => openEvent(event.slug)}
                  className="flex w-full items-center gap-3 rounded-xl border border-border/70 p-3 text-left transition-colors hover:bg-muted/40"
                >
                  <div className="w-14 shrink-0 text-xs font-medium text-muted-foreground">
                    {formatListDate(event.eventDate ?? event.createdAt)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{event.name}</div>
                    <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span>{getCategoryLabel(event.category)}</span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1">
                        <Camera className="h-3 w-3" />
                        {event.mediaCount}
                      </span>
                    </div>
                  </div>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium capitalize text-muted-foreground">
                    {event.plan}
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
