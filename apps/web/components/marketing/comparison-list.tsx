import Link from "next/link";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AssetPlaceholder } from "./asset-placeholder";

export function ComparisonList({
  heading,
  emphasis,
  subtext,
  collageLabel,
  oursPoints,
  othersPoints,
  cta,
}: {
  heading: string;
  emphasis: string;
  subtext: string;
  collageLabel: string;
  oursPoints: string[];
  othersPoints: string[];
  cta: { label: string; href: string };
}) {
  return (
    <section className="border-y border-border bg-background/70 px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl leading-tight sm:text-4xl">
            {heading} <span className="text-primary">{emphasis}</span>
          </h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
            {subtext}
          </p>
        </div>

        <div className="mt-12">
          <AssetPlaceholder label={collageLabel} className="min-h-[220px]" />
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[1.75rem] border border-primary/30 bg-primary/10 p-6">
            <div className="text-sm font-bold uppercase tracking-[0.1em] text-primary">
              Event Photo
            </div>
            <ul className="mt-4 space-y-3">
              {oursPoints.map((point) => (
                <li key={point} className="flex items-start gap-2 text-sm text-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[1.75rem] border border-border bg-card p-6">
            <div className="text-sm font-bold uppercase tracking-[0.1em] text-muted-foreground">
              Other photo-sharing apps
            </div>
            <ul className="mt-4 space-y-3">
              {othersPoints.map((point) => (
                <li key={point} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link href={cta.href}>
            <Button size="lg" className="rounded-full bg-primary px-7 text-primary-foreground hover:bg-[var(--primary-hover)]">
              {cta.label}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
