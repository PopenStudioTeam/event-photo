import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AssetPlaceholder } from "./asset-placeholder";

export type HighlightFeature = {
  icon: LucideIcon;
  title: string;
  text: string;
};

export function FeatureHighlight({
  heading,
  subtext,
  features,
  mockupLabel,
  cta,
}: {
  heading: string;
  subtext: string;
  features: HighlightFeature[];
  mockupLabel: string;
  cta?: { label: string; href: string };
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl leading-tight sm:text-4xl">{heading}</h2>
        <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
          {subtext}
        </p>
        {cta && (
          <Link href={cta.href} className="mt-6 inline-block">
            <Button className="rounded-full bg-primary px-6 text-primary-foreground hover:bg-[var(--primary-hover)]">
              {cta.label}
            </Button>
          </Link>
        )}
      </div>

      <div className="mt-14 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="grid gap-4 sm:grid-cols-2">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-[1.75rem] border border-border bg-card p-6"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <h3 className="mt-5 text-sm font-bold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  {feature.text}
                </p>
              </div>
            );
          })}
        </div>

        <AssetPlaceholder label={mockupLabel} className="min-h-[420px]" />
      </div>
    </section>
  );
}
