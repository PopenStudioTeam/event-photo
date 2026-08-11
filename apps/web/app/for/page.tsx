import type { Metadata } from "next";
import Link from "next/link";
import { PublicHeader } from "@/components/public-header";
import { SiteFooter } from "@/components/site-footer";
import { useCases } from "@/lib/use-cases-data";

export const metadata: Metadata = {
  title: "Use cases — Event Photo",
  description:
    "See how Event Photo fits weddings, parties, birthdays, and corporate events.",
};

export default function UseCasesIndexPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground">
      <PublicHeader />

      <main>
        <section className="mx-auto max-w-4xl px-4 pb-14 pt-20 text-center sm:px-6 sm:pt-28 lg:px-8">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Use cases
          </div>
          <h1 className="mx-auto mt-5 max-w-3xl text-5xl leading-[0.98] sm:text-6xl">
            Built for every
            <span className="block text-muted-foreground">kind of gathering.</span>
          </h1>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {useCases.map((useCase) => (
              <Link
                key={useCase.slug}
                href={`/for/${useCase.slug}`}
                className="group relative min-h-[290px] overflow-hidden rounded-[2rem] border border-border bg-card p-6 transition duration-500 hover:-translate-y-2"
              >
                <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-primary/20 blur-2xl transition group-hover:scale-150" />
                <div className="relative flex h-full flex-col justify-between">
                  <div className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
                    {useCase.navLabel}
                  </div>
                  <div>
                    <div className="text-2xl leading-tight text-foreground">
                      {useCase.headline}
                    </div>
                    <div className="mt-5 text-5xl text-primary/40">✦</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}