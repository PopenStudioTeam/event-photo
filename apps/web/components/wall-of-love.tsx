"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Star, Tag } from "lucide-react";
import { apiFetch, reportApiError } from "@/lib/api";
import { ReviewModal } from "@/components/review-modal";
import { testimonialCategoryLabel } from "@/lib/testimonial-categories";

type Testimonial = {
  id: string;
  authorName: string;
  authorRole: string | null;
  category: string;
  rating: number;
  quote: string;
  verified: boolean;
  createdAt: string;
  photoUrl: string | null;
};

function formatReviewDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function WallOfLove() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadTestimonials() {
    try {
      const res = await apiFetch<{ testimonials: Testimonial[] }>(
        "/public/testimonials"
      );
      setTestimonials(res.testimonials);
    } catch (err) {
      reportApiError(err, "Failed to load the wall of love");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial load, setState is gated behind the async fetch
    void loadTestimonials();
  }, []);

  return (
    <>
      <section className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 pb-14 pt-16 text-center sm:px-6 sm:pt-24 lg:px-8">
        <h1 className="text-4xl leading-tight sm:text-5xl">Our Stories</h1>
        <p className="max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
          People from all over the world sprinkle some magic at their events
          using Event Photo 💗
        </p>
        <ReviewModal onSubmitted={loadTestimonials} />
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-24 sm:px-6 lg:px-8 lg:pb-32">
        {loading ? (
          <p className="text-center text-sm text-muted-foreground">Loading…</p>
        ) : testimonials.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            No reviews yet — be the first to share your experience.
          </p>
        ) : (
          <div className="columns-1 gap-5 sm:columns-2">
            {testimonials.map((testimonial) => (
              <article
                key={testimonial.id}
                className="mb-5 break-inside-avoid rounded-xl border border-border bg-card p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="text-sm font-bold text-foreground">
                    {testimonial.authorName}
                  </div>
                  <div className="shrink-0 text-xs text-muted-foreground">
                    {formatReviewDate(testimonial.createdAt)}
                  </div>
                </div>

                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1 font-semibold text-primary">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    {testimonial.rating.toFixed(1)}
                  </span>
                  {testimonial.verified && (
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Verified customer
                    </span>
                  )}
                </div>

                <div className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                  <Tag className="h-3 w-3" />
                  {testimonialCategoryLabel(testimonial.category)}
                </div>

                <p className="mt-4 text-sm leading-7 text-foreground/85">
                  {testimonial.quote}
                </p>

                {testimonial.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={testimonial.photoUrl}
                    alt={`Photo shared by ${testimonial.authorName}`}
                    className="mt-4 w-full rounded-lg border border-border object-cover"
                  />
                ) : null}
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
