"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { apiFetch, reportApiError, showErrorAlert } from "@/lib/api";
import { EVENT_CATEGORIES, type EventCategory } from "@/lib/event-categories";
import { cn } from "@/lib/utils";
import { EVENT_PLANS, eventPlanSettingsPath, type EventPlan } from "@/lib/plans";

type NewEventDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function NewEventDialog({ open, onOpenChange }: NewEventDialogProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState<EventCategory>("party");
  const [protectedGallery, setProtectedGallery] = useState(false);
  const [password, setPassword] = useState("");
  const [plan, setPlan] = useState<EventPlan>("free");
  const [creating, setCreating] = useState(false);

  const resetForm = () => {
    setName("");
    setDate("");
    setCategory("party");
    setProtectedGallery(false);
    setPassword("");
    setPlan("free");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showErrorAlert("Name is required");
      return;
    }

    if (protectedGallery && password.length < 4) {
      showErrorAlert("Gallery password must be at least 4 characters");
      return;
    }

    setCreating(true);

    try {
      const body: Record<string, unknown> = {
        name: name.trim(),
        category,
        protected: protectedGallery,
      };

      if (date) {
        body.eventDate = new Date(date).toISOString();
      }

      if (protectedGallery) {
        body.password = password;
      }

      const created = await apiFetch("/events", {
        method: "POST",
        body: JSON.stringify(body),
      });

      const event = created as { slug: string };

      onOpenChange(false);
      resetForm();
      if (typeof window !== "undefined") {
        localStorage.setItem("eventphoto_current_slug", event.slug);
      }
      router.push(
        plan === "free"
          ? `/events/${event.slug}`
          : eventPlanSettingsPath(event.slug)
      );
    } catch (err) {
      console.error(err);
      reportApiError(err, "Failed to create event");
    } finally {
      setCreating(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) resetForm();
      }}
    >
      <DialogContent className="max-w-md rounded-xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add new event</DialogTitle>
        </DialogHeader>

        <form className="space-y-4 pt-2 text-sm" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-xs font-medium">
              What&apos;s the event title? <span className="text-destructive">*</span>
            </label>
            <input
              className="w-full rounded-md border px-3 py-2 text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Dan and Rachel Wedding"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium">When does it happen?</label>
            <input
              type="date"
              className="w-full rounded-md border px-3 py-2 text-sm"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium">
              What are you up to? <span className="text-destructive">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {EVENT_CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={cn(
                    "rounded-xl border px-2 py-2 text-xs font-medium transition-colors",
                    category === cat.value
                      ? "border-primary bg-primary/5 text-primary"
                      : "hover:border-primary/40"
                  )}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium">Choose a plan</label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.values(EVENT_PLANS) as (typeof EVENT_PLANS)[EventPlan][]).map(
                (details) => (
                  <button
                    key={details.id}
                    type="button"
                    onClick={() => setPlan(details.id)}
                    className={cn(
                      "rounded-xl border px-2 py-2 text-left transition-colors",
                      plan === details.id
                        ? "border-primary bg-primary/5 text-primary"
                        : "hover:border-primary/40"
                    )}
                  >
                    <div className="text-xs font-medium">{details.name}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {details.price}
                    </div>
                  </button>
                )
              )}
            </div>
            <p className="text-[11px] text-muted-foreground">
              {plan === "free"
                ? "Starts on Free. You can choose Premium or Pro in event settings before paying."
                : `The event is created on Free first. Next you’ll choose ${EVENT_PLANS[plan].name} checkout.`}
            </p>
          </div>

          <div className="space-y-3 rounded-md border bg-muted/40 p-3">
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                className="mt-0.5"
                checked={protectedGallery}
                onChange={(e) => {
                  setProtectedGallery(e.target.checked);
                  if (!e.target.checked) setPassword("");
                }}
              />
              <span>
                <span className="block text-xs font-medium">Protect gallery with password</span>
                <span className="block text-[11px] text-muted-foreground">
                  Guests must enter a password to view photos and videos.
                </span>
              </span>
            </label>

            {protectedGallery && (
              <div className="space-y-1">
                <label className="text-xs font-medium">Gallery password</label>
                <input
                  type="password"
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 4 characters"
                  minLength={4}
                />
              </div>
            )}
          </div>

          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                onOpenChange(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={creating}>
              {creating ? "Creating…" : "Create Event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
