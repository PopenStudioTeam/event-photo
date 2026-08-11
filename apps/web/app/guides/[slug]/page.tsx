import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PublicHeader } from "@/components/public-header";
import { SiteFooter } from "@/components/site-footer";
import { getGuideBySlug, guides } from "@/lib/guides-data";

type GuidePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return { title: "Guide not found — Event Photo" };
  }

  return {
    title: `${guide.title} — Event Photo`,
    description: guide.excerpt,
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground">
      <PublicHeader />

      <main>
        <section className="mx-auto max-w-3xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24 lg:px-8">
          <Link
            href="/guides"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to guides
          </Link>

          <div className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            {guide.category} · {guide.readTime}
          </div>

          <h1 className="mt-4 text-4xl leading-tight sm:text-5xl">
            {guide.title}
          </h1>

          <div className="mt-8 space-y-5 text-sm leading-7 text-foreground/80 sm:text-base">
            {guide.body.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section className="px-4 pb-24 sm:px-6 lg:px-8 lg:pb-32">
          <div className="mx-auto max-w-3xl overflow-hidden rounded-[2.5rem] bg-brand-deep-navy px-6 py-12 text-center text-brand-off-white sm:px-10 sm:py-16">
            <h2 className="text-3xl leading-tight sm:text-4xl">
              Ready to try it on your event?
            </h2>
            <Link href="/dashboard" className="mt-6 inline-block">
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