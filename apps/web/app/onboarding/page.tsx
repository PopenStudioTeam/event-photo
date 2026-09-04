"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { API_URL, apiFetch, reportApiError } from "@/lib/api";
import {
  EVENT_CATEGORIES,
  type EventCategory,
  organizerDisplayName,
} from "@/lib/event-categories";
import { getOrganizer, logout, saveOrganizer } from "@/lib/auth";
import { markOnboardingDashboard } from "@/lib/auth-redirect";
import { cn } from "@/lib/utils";

type OnboardingStep =
  | "welcome"
  | "category"
  | "name"
  | "date"
  | "creating"
  | "qr"
  | "success";

export default function OnboardingPage() {
  const router = useRouter();
  const organizer = getOrganizer();

  const [step, setStep] = useState<OnboardingStep>("welcome");
  const [category, setCategory] = useState<EventCategory | null>(null);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [createdSlug, setCreatedSlug] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!organizer) {
      router.replace("/login");
    }
  }, [organizer, router]);

  const displayName = organizerDisplayName(organizer?.email);

  const handleCreateEvent = async (skipDate = false) => {
    if (!name.trim() || !category) return;

    setStep("creating");
    setCreating(true);

    try {
      const body: Record<string, unknown> = {
        name: name.trim(),
        category,
      };
      if (!skipDate && date) {
        body.eventDate = new Date(date).toISOString();
      }

      const created = (await apiFetch("/events", {
        method: "POST",
        body: JSON.stringify(body),
      })) as { slug: string };

      await apiFetch("/auth/complete-onboarding", { method: "POST" });
      saveOrganizer({
        ...organizer!,
        onboardingCompleted: true,
      });

      setCreatedSlug(created.slug);
      window.setTimeout(() => setStep("qr"), 1400);
    } catch (err) {
      reportApiError(err, "Failed to create event");
      setStep("date");
    } finally {
      setCreating(false);
    }
  };

  const handleGoToDashboard = () => {
    if (!createdSlug) return;
    markOnboardingDashboard(createdSlug);
    router.push(`/events/${createdSlug}`);
  };

  const baseWebUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_BASE_WEB_URL ?? "http://localhost:3000";

  const qrImageUrl = createdSlug
    ? `${API_URL}/qr/${createdSlug}?origin=${encodeURIComponent(baseWebUrl)}`
    : "";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <Card className="w-full max-w-lg rounded-3xl border-border/60 bg-card/95 p-8 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.25)] backdrop-blur-sm sm:p-10">
        {step === "welcome" && (
          <div className="space-y-6 text-center">
            <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
              Hey {displayName} 👋
            </h1>
            <p className="text-sm text-muted-foreground">
              Let&apos;s get your digital album and photo wall in no-time!
            </p>
            <Button
              size="lg"
              className="h-12 w-full rounded-xl text-base font-semibold"
              onClick={() => setStep("category")}
            >
              Let&apos;s Go
            </Button>
          </div>
        )}

        {step === "category" && (
          <div className="space-y-6">
            <h2 className="text-center font-heading text-xl font-bold sm:text-2xl">
              What kind of event are you up to?
            </h2>
            <div className="space-y-3">
              {EVENT_CATEGORIES.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => {
                    setCategory(item.value);
                    setStep("name");
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border border-border/70 bg-muted/30 px-4 py-3.5 text-left text-sm font-medium transition-colors",
                    "hover:border-primary/40 hover:bg-muted/60"
                  )}
                >
                  <span className="text-xl">{item.emoji}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "name" && (
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="font-heading text-xl font-bold sm:text-2xl">
                How&apos;d you like to call your event?
              </h2>
              <p className="text-sm text-muted-foreground">
                Don&apos;t worry, you can always change it later.
              </p>
            </div>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="i.e - Birthday Party"
              className="w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-sm focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <Button
              size="lg"
              className="h-12 w-full rounded-xl text-base font-semibold"
              disabled={!name.trim()}
              onClick={() => setStep("date")}
            >
              Continue
            </Button>
          </div>
        )}

        {step === "date" && (
          <form
            className="space-y-6"
            onSubmit={(e: FormEvent) => {
              e.preventDefault();
              handleCreateEvent(false);
            }}
          >
            <div className="space-y-2 text-center">
              <h2 className="font-heading text-xl font-bold sm:text-2xl">
                When is the event?
              </h2>
              <p className="text-sm text-muted-foreground">
                Pick a date for your event (if you already know it)
              </p>
            </div>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-sm"
            />
            <Button
              type="submit"
              size="lg"
              className="h-12 w-full rounded-xl text-base font-semibold"
              disabled={creating}
            >
              Create My Event
            </Button>
            <button
              type="button"
              className="w-full text-sm text-muted-foreground hover:text-foreground"
              onClick={() => handleCreateEvent(true)}
              disabled={creating}
            >
              I don&apos;t know yet
            </button>
          </form>
        )}

        {step === "creating" && (
          <div className="space-y-6 py-4 text-center">
            <h2 className="font-heading text-xl font-bold">We&apos;re on it!</h2>
            <div className="flex justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">
              Creating your digital album…
            </p>
          </div>
        )}

        {step === "qr" && (
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="font-heading text-xl font-bold sm:text-2xl">
                Let&apos;s add your first photos 🤳
              </h2>
              <p className="text-sm text-muted-foreground">
                Scan the QR code and follow the instructions to add new photos.
                The photos will appear on your wall shortly after.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl bg-brand-slate-navy p-6 text-center text-brand-off-white">
              <p className="mb-4 text-sm font-medium">Scan to view or add photos!</p>
              <div className="mx-auto inline-block rounded-xl border-2 border-primary/40 bg-white p-3">
                <img
                  src={qrImageUrl}
                  alt="Event QR code"
                  className="h-44 w-44 object-contain"
                />
              </div>
            </div>

            <button
              type="button"
              className="w-full text-sm font-medium text-muted-foreground hover:text-foreground"
              onClick={() => setStep("success")}
            >
              I&apos;ll do it later &gt;
            </button>
          </div>
        )}

        {step === "success" && (
          <div className="space-y-6 text-center">
            <h2 className="font-heading text-xl font-bold sm:text-2xl">
              You&apos;re all set up!
            </h2>
            <p className="text-sm text-muted-foreground">
              On the next screen, you&apos;ll find your dashboard with the album
              link and QR code to share with your guests. Plus, there&apos;s a
              slideshow link ready to dazzle on the big screens!
            </p>
            <Button
              size="lg"
              className="h-12 w-full rounded-xl text-base font-semibold"
              onClick={handleGoToDashboard}
            >
              Go to your dashboard
            </Button>
          </div>
        )}
      </Card>

      {step === "welcome" && organizer && (
        <p className="mt-6 text-sm text-muted-foreground">
          Not {displayName}?{" "}
          <button
            type="button"
            className="font-semibold text-foreground hover:underline"
            onClick={() => {
              logout();
              router.replace("/login");
            }}
          >
            Sign out
          </button>
        </p>
      )}
    </div>
  );
}
