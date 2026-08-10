"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Copy, ExternalLink, Download } from "lucide-react";
import { saveAs } from "file-saver";
import {
  API_URL,
  apiFetch,
  apiFetchBlobWithProgress,
  reportApiError,
} from "@/lib/api";
import { useBaseWebUrl } from "@/lib/use-base-web-url";
import { getCategoryIntro } from "@/lib/event-categories";
import {
  hasSeenWelcome,
  markWelcomeSeen,
  shouldShowWelcomeFromOnboarding,
} from "@/lib/auth-redirect";
import { EventWelcomeDialog } from "@/components/event-welcome-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type EventRecord = {
  id: string;
  name: string;
  slug: string;
  category: string;
  plan: string;
  mediaCount?: number;
};

export default function EventDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [event, setEvent] = useState<EventRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [downloadingQr, setDownloadingQr] = useState(false);
  const [copied, setCopied] = useState(false);

  const baseWebUrl = useBaseWebUrl();
  const albumUrl = event ? `${baseWebUrl}/e/${event.slug}` : "";
  const slideshowUrl = event ? `${baseWebUrl}/events/${event.slug}/slideshow` : "";
  const qrImageUrl = event
    ? `${API_URL}/qr/${event.slug}?origin=${encodeURIComponent(baseWebUrl)}`
    : "";

  useEffect(() => {
    const load = async () => {
      try {
        const events = (await apiFetch("/events")) as EventRecord[];
        const found = events.find((e) => e.slug === slug) ?? null;
        if (!found) {
          router.replace("/events");
          return;
        }
        setEvent(found);

        if (
          shouldShowWelcomeFromOnboarding(slug) ||
          (!hasSeenWelcome(slug) && found)
        ) {
          setWelcomeOpen(true);
        }
      } catch (err) {
        reportApiError(err, "Failed to load event");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug, router]);

  const handleCopy = async (url: string) => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQr = async () => {
    if (!event || downloadingQr) return;
    setDownloadingQr(true);
    try {
      const blob = await apiFetchBlobWithProgress(
        `/qr/${event.slug}?origin=${encodeURIComponent(baseWebUrl)}&download=1`
      );
      saveAs(blob, `${event.slug}-qr.png`);
    } catch (err) {
      console.error(err);
    } finally {
      setDownloadingQr(false);
    }
  };

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading dashboard…</div>;
  }

  if (!event) return null;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[color-mix(in_srgb,var(--brand-champagne-gold)_35%,transparent)] bg-[color-mix(in_srgb,var(--brand-champagne-gold)_12%,var(--background))] px-4 py-3 text-sm text-foreground">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p>
            You&apos;re currently using the limited free plan. Upgrade your event
            to unlock all features.
          </p>
          <Link
            href="/settings"
            className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-[color-mix(in_srgb,var(--brand-champagne-gold)_40%,transparent)] bg-card px-3 text-sm hover:bg-muted"
          >
            Upgrade Plan
          </Link>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            {event.name}
          </h2>
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium capitalize text-primary">
            Plan: {event.plan}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          {getCategoryIntro(event.category)}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="overflow-hidden rounded-2xl border-border/70 bg-gradient-to-br from-primary/5 via-background to-background">
          <CardHeader className="border-b border-border/50 pb-4">
            <CardTitle className="text-lg">Your Digital Album</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 pt-5">
            <p className="text-sm text-muted-foreground">
              Guests can upload or view photos and videos through this link. Share
              it with everyone at your event.
            </p>

            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                readOnly
                value={albumUrl.replace(/^https?:\/\//, "")}
                className="min-w-0 flex-1 rounded-xl border bg-background px-3 py-2 text-sm"
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 rounded-xl"
                  onClick={() => handleCopy(albumUrl)}
                  aria-label="Copy link"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <a
                  href={albumUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-primary px-3 text-sm font-medium text-primary-foreground"
                >
                  Open
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
            {copied && (
              <p className="text-xs text-primary">Link copied to clipboard.</p>
            )}

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
              <div className="rounded-2xl border-2 border-primary/30 bg-white p-3 shadow-sm">
                <img
                  src={qrImageUrl}
                  alt="Event QR code"
                  className="h-40 w-40 object-contain"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl"
                  onClick={handleDownloadQr}
                  disabled={downloadingQr}
                >
                  <Download className="mr-1.5 h-4 w-4" />
                  {downloadingQr ? "Downloading…" : "Download QR Code"}
                </Button>
                <p className="max-w-xs text-xs text-muted-foreground">
                  Print this QR code on table cards, signs, or screens so guests
                  can scan and upload instantly.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden rounded-2xl border-border/70 bg-gradient-to-br from-muted/40 via-background to-background">
          <CardHeader className="border-b border-border/50 pb-4">
            <CardTitle className="text-lg">Your Photo Wall</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 pt-5">
            <p className="text-sm text-muted-foreground">
              Display uploaded photos on projectors or TVs with the live slideshow
              link below.
            </p>

            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                readOnly
                value={slideshowUrl.replace(/^https?:\/\//, "")}
                className="min-w-0 flex-1 rounded-xl border bg-background px-3 py-2 text-sm"
              />
              <a
                href={slideshowUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-primary px-3 text-sm font-medium text-primary-foreground"
              >
                Open
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            <div
              className={cn(
                "relative overflow-hidden rounded-2xl border bg-zinc-900 p-6 text-center text-white",
                "min-h-[220px] flex flex-col items-center justify-center gap-3"
              )}
            >
              <p className="text-sm font-medium">Scan to view or add photos!</p>
              <div className="rounded-lg border-2 border-primary bg-white p-2">
                <img
                  src={qrImageUrl}
                  alt="Slideshow QR preview"
                  className="h-24 w-24 object-contain"
                />
              </div>
              <p className="text-xs text-white/70">
                Open this link on a TV, monitor, or projector for a live photo wall.
              </p>
            </div>

            <p className="text-xs text-muted-foreground">
              Display on: TV · Monitor · Laptop ·{" "}
              <Link
                href="/how-it-works"
                className="font-medium text-primary hover:underline"
              >
                How to do it?
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>

      <EventWelcomeDialog
        open={welcomeOpen}
        onOpenChange={(open) => {
          setWelcomeOpen(open);
          if (!open) markWelcomeSeen(slug);
        }}
      />
    </div>
  );
}
