import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AssetPlaceholder } from "./asset-placeholder";

export function StatTestimonialBanner({
  quote,
  description,
  quoteName,
  quoteRole,
  cta,
  mediaLabels,
}: {
  quote: string;
  description: string;
  quoteName: string;
  quoteRole: string;
  cta: { label: string; href: string };
  mediaLabels: [string, string];
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="grid items-center gap-10 rounded-[2.5rem] border border-border bg-card p-8 sm:p-10 lg:grid-cols-2 lg:p-14">
        <div>
          <p className="text-lg font-semibold leading-snug text-foreground sm:text-xl">
            &ldquo;{quote}&rdquo;
          </p>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            {description}
          </p>

          <div className="mt-6 flex items-center gap-3">
            <AssetPlaceholder
              label="Photo: guest or host headshot"
              className="h-11 w-11 min-h-0 shrink-0 rounded-full p-0"
            />
            <div>
              <div className="text-xs font-semibold text-foreground">
                {quoteName}
              </div>
              <div className="text-xs text-muted-foreground">{quoteRole}</div>
            </div>
          </div>

          <Link href={cta.href} className="mt-6 inline-block">
            <Button className="rounded-full bg-primary px-6 text-primary-foreground hover:bg-[var(--primary-hover)]">
              {cta.label}
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <AssetPlaceholder label={mediaLabels[0]} className="min-h-[220px]" />
          <AssetPlaceholder label={mediaLabels[1]} className="min-h-[220px]" />
        </div>
      </div>
    </section>
  );
}
