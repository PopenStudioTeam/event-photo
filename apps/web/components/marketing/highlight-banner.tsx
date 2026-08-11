import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AssetPlaceholder } from "./asset-placeholder";

export function HighlightBanner({
  heading,
  bullets,
  cta,
  secondaryCta,
  mediaLabel,
}: {
  heading: string;
  bullets: string[];
  cta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  mediaLabel: string;
}) {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-10 rounded-[2.5rem] bg-primary/10 p-8 sm:p-12 lg:grid-cols-2 lg:gap-16 lg:p-16">
        <div>
          <h2 className="text-3xl leading-tight sm:text-4xl">{heading}</h2>
          <ul className="mt-6 space-y-2">
            {bullets.map((bullet) => (
              <li
                key={bullet}
                className="flex items-start gap-2 text-sm text-foreground/85"
              >
                <span className="text-primary">✓</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <Link href={cta.href} className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full rounded-full bg-primary px-7 text-primary-foreground hover:bg-[var(--primary-hover)] sm:w-auto"
              >
                {cta.label}
              </Button>
            </Link>
            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                className="text-sm font-medium text-foreground hover:underline"
              >
                {secondaryCta.label} →
              </Link>
            )}
          </div>
        </div>

        <AssetPlaceholder
          type="video"
          label={mediaLabel}
          className="min-h-[280px] border-primary/30 bg-card/60"
        />
      </div>
    </section>
  );
}
