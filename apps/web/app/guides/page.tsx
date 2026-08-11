import type { Metadata } from "next";
import Link from "next/link";
import { PublicHeader } from "@/components/public-header";
import { SiteFooter } from "@/components/site-footer";
import { guides } from "@/lib/guides-data";

export const metadata: Metadata = {
  title: "Guides — Event Photo",
  description:
    "Practical guides for setting up moderation, QR cards, POV mode, privacy, and upload timelines.",
};

export default function GuidesPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-48 -top-48 h-[34rem] w-[34rem] rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -right-48 top-40 h-[34rem] w-[34rem] rounded-full bg-card/70 blur-3xl" />
      </div>

      <PublicHeader />

      <main>
        <section className="mx-auto max-w-4xl px-4 pb-14 pt-20 text-center sm:px-6 sm:pt-28 lg:px-8">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Guides
          </div>
          <h1 className="mx-auto mt-5 max-w-3xl text-5xl leading-[0.98] sm:text-6xl">
            Get more out of
            <span className="block text-muted-foreground">every event.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            Short, practical guides for setting up moderation, QR cards, POV
            mode, privacy, and upload timelines.
          </p>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="group flex h-full flex-col justify-between rounded-[2rem] border border-border bg-card/75 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div>
                  <span className="inline-flex rounded-full bg-primary/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-foreground">
                    {guide.category}
                  </span>
                  <h2 className="mt-5 text-xl leading-snug text-foreground">{guide.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {guide.excerpt}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
                  <span>{guide.readTime}</span>
                  <span className="text-muted-foreground/50 transition group-hover:translate-x-1 group-hover:text-foreground">
                    →
                  </span>
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