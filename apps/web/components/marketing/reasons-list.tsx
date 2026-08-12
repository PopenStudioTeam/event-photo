import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AssetPlaceholder } from "./asset-placeholder";

export type Reason = {
  icon: LucideIcon;
  title: string;
  text: string;
};

export function ReasonsList({
  heading,
  subtext,
  reasons,
  imageLabel,
  cta,
}: {
  heading: string;
  subtext: string;
  reasons: Reason[];
  imageLabel: string;
  cta?: { label: string; href: string };
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="text-3xl leading-tight sm:text-4xl">{heading}</h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
            {subtext}
          </p>

          <div className="mt-8 space-y-6">
            {reasons.map((reason) => {
              const Icon = reason.icon;

              return (
                <div key={reason.title} className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary transition-transform duration-300 hover:scale-110">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      {reason.title}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {reason.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {cta && (
            <Link href={cta.href} className="mt-8 inline-block">
              <Button className="rounded-full bg-primary px-6 text-primary-foreground hover:bg-[var(--primary-hover)]">
                {cta.label}
              </Button>
            </Link>
          )}
        </div>

        <AssetPlaceholder label={imageLabel} className="min-h-[360px]" />
      </div>
    </section>
  );
}
