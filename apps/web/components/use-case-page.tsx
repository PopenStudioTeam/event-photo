import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PublicHeader } from "@/components/public-header";
import { SiteFooter } from "@/components/site-footer";
import type { UseCase } from "@/lib/use-cases-data";

export function UseCasePage({ useCase }: { useCase: UseCase }) {
  const Icon = useCase.icon;

  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground">
      <PublicHeader />

      <main>
        <section className="mx-auto max-w-4xl px-4 pb-16 pt-16 text-center sm:px-6 sm:pt-24 lg:px-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <Icon className="h-8 w-8" strokeWidth={1.75} />
          </div>

          <div className="mx-auto mt-5 inline-flex rounded-full bg-primary/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-foreground">
            {useCase.heroLabel}
          </div>

          <h1 className="mt-6 text-5xl leading-[0.98] sm:text-6xl">
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
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                How it works
              </div>
              <h2 className="mt-4 text-3xl leading-tight sm:text-4xl">
                Set up for {useCase.navLabel.toLowerCase()}, start to finish.
              </h2>
            </div>

            <div className="relative mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              <div
                aria-hidden="true"
                className="absolute left-0 right-0 top-8 hidden h-px bg-border lg:block"
              />

              {useCase.howItWorks.map((step, index) => {
                const StepIcon = step.icon;

                return (
                  <div key={step.title} className="relative flex flex-col items-center text-center">
                    <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-border bg-card text-primary shadow-sm">
                      <StepIcon className="h-6 w-6" strokeWidth={1.75} />
                      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                        {index + 1}
                      </span>
                    </div>
                    <h3 className="mt-5 text-sm font-bold text-foreground">
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-[16rem] text-xs leading-5 text-muted-foreground">
                      {step.text}
                    </p>
                  </div>
                );
              })}
            </div>
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
