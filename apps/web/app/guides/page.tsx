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
    <div className="min-h-screen overflow-hidden bg-[#fffdfb] text-[#262125]">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-48 -top-48 h-[34rem] w-[34rem] rounded-full bg-rose-200/40 blur-3xl" />
        <div className="absolute -right-48 top-40 h-[34rem] w-[34rem] rounded-full bg-sky-200/40 blur-3xl" />
      </div>

      <PublicHeader />

      <main>
        <section className="mx-auto max-w-4xl px-4 pb-14 pt-20 text-center sm:px-6 sm:pt-28 lg:px-8">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400">
            Guides
          </div>
          <h1 className="mx-auto mt-5 max-w-3xl text-5xl leading-[0.98] sm:text-6xl">
            Get more out of
            <span className="block text-[#b2a8ad]">every event.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-neutral-600 sm:text-lg">
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
                className="group flex h-full flex-col justify-between rounded-[2rem] border border-black/5 bg-white/75 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div>
                  <span className="inline-flex rounded-full bg-[#fff0bd] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em]">
                    {guide.category}
                  </span>
                  <h2 className="mt-5 text-xl leading-snug">{guide.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-neutral-500">
                    {guide.excerpt}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-black/5 pt-4 text-xs text-neutral-500">
                  <span>{guide.readTime}</span>
                  <span className="text-neutral-300 transition group-hover:translate-x-1 group-hover:text-neutral-700">
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