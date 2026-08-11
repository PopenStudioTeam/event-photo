"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { AssetPlaceholder } from "@/components/marketing/asset-placeholder";

export type BusinessTab = {
  label: string;
  heading: string;
  description: string;
  quote: string;
  quoteName: string;
  quoteRole: string;
};

export function BusinessTabs({ tabs }: { tabs: BusinessTab[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = tabs[activeIndex];

  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl leading-tight sm:text-4xl">
          What&apos;s your business?
        </h2>
        <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
          See how Event Photo fits the way you already work.
        </p>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
        <div className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          {tabs.map((tab, index) => (
            <button
              key={tab.label}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`shrink-0 rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                index === activeIndex
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="rounded-[1.75rem] border border-border bg-card p-7 sm:p-8">
          <h3 className="text-lg font-bold text-foreground">{active.heading}</h3>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {active.description}
          </p>

          <div className="mt-6 flex text-primary">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} className="h-3.5 w-3.5 fill-current" />
            ))}
          </div>
          <p className="mt-3 text-sm italic leading-6 text-foreground/85">
            &ldquo;{active.quote}&rdquo;
          </p>
          <div className="mt-4 flex items-center gap-3">
            <AssetPlaceholder
              label="Photo: customer headshot"
              className="h-11 w-11 min-h-0 shrink-0 rounded-full p-0"
            />
            <div>
              <div className="text-xs font-semibold text-foreground">
                {active.quoteName}
              </div>
              <div className="text-xs text-muted-foreground">{active.quoteRole}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
