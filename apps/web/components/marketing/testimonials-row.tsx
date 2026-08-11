import { Star } from "lucide-react";
import { AssetPlaceholder } from "./asset-placeholder";

export type Testimonial = {
  quote: string;
  name: string;
  location: string;
  photoLabel?: string;
};

export function TestimonialsRow({
  heading,
  subtext,
  testimonials,
}: {
  heading: string;
  subtext: string;
  testimonials: Testimonial[];
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl leading-tight sm:text-4xl">{heading}</h2>
        <p className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span className="flex text-primary">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} className="h-4 w-4 fill-current" />
            ))}
          </span>
          {subtext}
        </p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-3">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.name}
            className="flex h-full flex-col justify-between rounded-[1.75rem] border border-border bg-card p-6"
          >
            <div>
              <div className="flex text-primary">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-6 text-foreground/85">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
            </div>

            <div className="mt-6">
              {testimonial.photoLabel && (
                <AssetPlaceholder
                  label={testimonial.photoLabel}
                  className="mb-4 min-h-[120px]"
                />
              )}
              <div className="text-xs font-semibold text-foreground">
                {testimonial.name}
              </div>
              <div className="text-xs text-muted-foreground">
                {testimonial.location}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
