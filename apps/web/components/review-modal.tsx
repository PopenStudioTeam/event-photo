"use client";

import { useRef, useState } from "react";
import { Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiFetch, reportApiError } from "@/lib/api";

const MAX_PHOTO_BYTES = 8 * 1024 * 1024;

type UploadUrlResponse = { uploadUrl: string; key: string };

export function ReviewModal({
  onSubmitted,
}: {
  onSubmitted?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [experience, setExperience] = useState("");
  const [email, setEmail] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function resetForm() {
    setName("");
    setRating(0);
    setHoverRating(0);
    setExperience("");
    setEmail("");
    setPhotoFile(null);
    setError(null);
    setSubmitted(false);
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) resetForm();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    const trimmedExperience = experience.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || rating === 0 || !trimmedExperience) {
      setError("Please add your name, a rating, and your experience.");
      return;
    }

    if (photoFile && photoFile.size > MAX_PHOTO_BYTES) {
      setError("Photo must be smaller than 8MB.");
      return;
    }

    setSubmitting(true);
    try {
      let photoKey: string | undefined;

      if (photoFile) {
        const uploadTarget = await apiFetch<UploadUrlResponse>(
          "/public/testimonials/upload-url",
          {
            method: "POST",
            body: JSON.stringify({
              contentType: photoFile.type,
              fileSize: photoFile.size,
            }),
          }
        );

        await fetch(uploadTarget.uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": photoFile.type },
          body: photoFile,
        });

        photoKey = uploadTarget.key;
      }

      await apiFetch("/public/testimonials", {
        method: "POST",
        body: JSON.stringify({
          authorName: trimmedName,
          authorEmail: trimmedEmail || undefined,
          rating,
          quote: trimmedExperience,
          photoKey,
        }),
      });

      setSubmitted(true);
      onSubmitted?.();
    } catch (err) {
      reportApiError(err, "Failed to submit your review");
      setError("Could not submit your review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Button
        size="lg"
        variant="outline"
        className="rounded-full border-primary text-primary hover:bg-primary/10"
        onClick={() => setOpen(true)}
      >
        Submit a review
      </Button>

      <DialogContent className="max-w-lg gap-6 rounded-2xl p-6 sm:p-8">
        {submitted ? (
          <div className="py-6 text-center">
            <DialogHeader>
              <DialogTitle className="text-xl">Thank you! 💗</DialogTitle>
            </DialogHeader>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Your review will appear on the Wall of Love once it&apos;s been
              reviewed.
            </p>
            <Button
              className="mt-6 rounded-full bg-primary text-primary-foreground hover:bg-[var(--primary-hover)]"
              onClick={() => handleOpenChange(false)}
            >
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <DialogHeader>
              <DialogTitle className="text-xl">Submit a review</DialogTitle>
            </DialogHeader>

            <div>
              <label className="text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground">
                Your name
              </label>
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-2 h-11 rounded-xl px-4 text-sm"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground">
                Rating
              </label>
              <div className="mt-2 flex gap-1">
                {Array.from({ length: 5 }).map((_, index) => {
                  const value = index + 1;
                  const filled = value <= (hoverRating || rating);

                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                      onMouseEnter={() => setHoverRating(value)}
                      onMouseLeave={() => setHoverRating(0)}
                      aria-label={`${value} star${value === 1 ? "" : "s"}`}
                      className="p-0.5"
                    >
                      <Star
                        className={`h-7 w-7 transition ${
                          filled
                            ? "fill-primary text-primary"
                            : "fill-transparent text-border"
                        }`}
                        strokeWidth={1.5}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground">
                Tell us about your experience
              </label>
              <textarea
                value={experience}
                onChange={(event) => setExperience(event.target.value)}
                placeholder="What did you like using our product? What made your experience great?"
                rows={4}
                className="mt-2 w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm leading-6 outline-none transition focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground">
                Photo from your event
              </label>
              <div className="mt-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(event) =>
                    setPhotoFile(event.target.files?.[0] ?? null)
                  }
                />
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl border-border"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {photoFile ? photoFile.name : "Upload photo"}
                </Button>
              </div>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                Share a photo of Event Photo in action during your event.
                Identifying information will be censored.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground">
                Your email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Optional"
                className="mt-2 h-11 rounded-xl px-4 text-sm"
              />
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                Your email won&apos;t be shared. It&apos;s only for us to
                verify you as a customer.
              </p>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-primary py-6 text-base text-primary-foreground hover:bg-[var(--primary-hover)]"
            >
              {submitting ? "Submitting…" : "Submit Review"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
