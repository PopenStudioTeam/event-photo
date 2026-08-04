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
import { apiFetch } from "@/lib/api";

type NewEventDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function NewEventDialog({ open, onOpenChange }: NewEventDialogProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    setCreating(true);
    setError(null);

    try {
      const body: Record<string, unknown> = {
        name: name.trim(),
      };

      if (date) {
        body.eventDate = new Date(date).toISOString();
      }

      const created = await apiFetch("/events", {
        method: "POST",
        body: JSON.stringify(body),
      });

      const event = created as { slug: string };

      onOpenChange(false);
      setName("");
      setDate("");
      router.push(`/events/${event.slug}`);
    } catch (err) {
      console.error(err);
      setError("Failed to create event");
    } finally {
      setCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-xl">
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

          {error && <div className="text-xs text-red-500">{error}</div>}

          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                onOpenChange(false);
                setName("");
                setDate("");
                setError(null);
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