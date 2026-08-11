import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PublicHeader } from "@/components/public-header";
import { SiteFooter } from "@/components/site-footer";
import type { UseCase } from "@/lib/use-cases-data";

const miniSteps = [
  {
    title: "Create your event",
    text: "Set up your gallery in under two minutes.",
  },
  {
    title: "Share your QR code",
    text: "Print it, send it, or display it on a screen.",
  },
  {
    title: "Watch memories arrive",
    text: "Every guest upload lands in your gallery instantly.",
  },
];

export function UseCasePage({ useCase }: { useCase: UseCase }) {
  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground">
      <PublicHeader />

      <main>
        <section className="mx-auto max-w-4xl px-4 pb-16 pt-16 text-center sm:px-6 sm:pt-24 lg:px-8">
          <div className="inline-flex rounded-full bg-primary/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-foreground">
            {useCase.heroLabel}
          </div>

          <h1 className="mt-7 text-5xl leading-[0.98] sm:text-6xl">
            {useCase.headline}
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            {useCase.subheadline}
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="w-full rounded-full bg-primary px-7 text-primary-foreground hover:bg-[var(--primary-hover)] sm:w-auto"
              >
                Create your event
                <span className="ml-2">↗</span>
              </Button>
            </Link>
            <Link href="/pricing">
              <Button
                size="lg"
                variant="outline"
                className="w-full rounded-full border-border bg-card/65 px-7 sm:w-auto"
              >
                See pricing
              </Button>
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6 lg:px-8">
          <p className="mx-auto max-w-2xl text-center text-sm leading-7 text-muted-foreground sm:text-base">
            {useCase.description}
          </p>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {useCase.features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-[1.75rem] border border-border bg-card p-6 text-foreground"
              >
                <h3 className="text-lg font-bold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-y border-border bg-background/70 px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-3">
            {miniSteps.map((step, index) => (
              <div key={step.title} className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-deep-navy text-sm font-bold text-brand-off-white">
                  {index + 1}
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground">{step.title}</div>
                  <div className="mt-1 text-xs leading-5 text-muted-foreground">
                    {step.text}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl rounded-[2.5rem] bg-brand-deep-navy px-6 py-16 text-center text-brand-off-white sm:px-10 sm:py-20">
            <h2 className="text-3xl leading-tight sm:text-4xl">
              Ready to start your {useCase.navLabel} gallery?
            </h2>
            <Link href="/dashboard" className="mt-8 inline-block">
              <Button
                size="lg"
                className="rounded-full bg-primary px-7 text-primary-foreground hover:bg-[var(--primary-hover)]"
              >
                Create your event
                <span className="ml-2">↗</span>
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
