import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AssetPlaceholder } from "./asset-placeholder";

export type HowItWorksStep = {
  title: string;
  description: string;
  bullets?: string[];
  imageLabel: string;
  note?: { label: string; href: string };
  cta?: { label: string; href: string };
};

export function HowItWorksFlow({
  heading,
  subtext,
  steps,
}: {
  heading: string;
  subtext: string;
  steps: HowItWorksStep[];
}) {
  return (
    <section
      id="how-it-works"
      className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32"
    >
      <div className="mx-auto max-w-2xl text-center">
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
          How it works
        </div>
        <h2 className="mt-4 text-3xl leading-tight sm:text-4xl">{heading}</h2>
        <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
          {subtext}
        </p>
      </div>

      <div className="mt-16 flex flex-col gap-20">
        {steps.map((step, index) => {
          const reversed = index % 2 === 1;

          return (
            <div
              key={step.title}
              className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
                reversed ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-sm font-bold text-primary-foreground">
                  {index + 1}
                </div>
                <h3 className="mt-5 text-2xl sm:text-3xl">{step.title}</h3>
                <p className="mt-3 max-w-md text-sm leading-7 text-muted-foreground sm:text-base">
                  {step.description}
                </p>

                {step.bullets && (
                  <ul className="mt-5 space-y-2">
                    {step.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <span className="text-primary">✓</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {step.note && (
                  <Link
                    href={step.note.href}
                    className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
                  >
                    {step.note.label} →
                  </Link>
                )}

                {step.cta && (
                  <Link href={step.cta.href} className="mt-6 inline-block">
                    <Button className="rounded-full bg-primary px-6 text-primary-foreground hover:bg-[var(--primary-hover)]">
                      {step.cta.label}
                    </Button>
                  </Link>
                )}
              </div>

              <AssetPlaceholder label={step.imageLabel} className="min-h-[300px]" />
            </div>
          );
        })}
      </div>
    </section>
  );
}
