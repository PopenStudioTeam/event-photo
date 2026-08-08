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

type NewEventDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function NewEventDialog({ open, onOpenChange }: NewEventDialogProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [protectedGallery, setProtectedGallery] = useState(false);
  const [password, setPassword] = useState("");
  const [creating, setCreating] = useState(false);

  const resetForm = () => {
    setName("");
    setDate("");
    setProtectedGallery(false);
    setPassword("");
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
      router.push(`/events/${event.slug}`);
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
          <DialogTitle>New event</DialogTitle>
        </DialogHeader>

        <form className="space-y-3 pt-2 text-sm" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-xs font-medium">Name</label>
            <input
              className="w-full rounded-md border px-3 py-2 text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Event name"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium">Date (optional)</label>
            <input
              type="date"
              className="w-full rounded-md border px-3 py-2 text-sm"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
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
              {creating ? "Creating…" : "Create event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
