import Link from "next/link";
import type { Guide } from "@/lib/guides-data";

type RelatedGuidesProps = {
  guides: Guide[];
};

export function RelatedGuides({ guides }: RelatedGuidesProps) {
  if (guides.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 border-t border-border pt-12">
      <h2 className="text-2xl font-semibold tracking-tight">
        You might also like…
      </h2>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {guides.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="group flex h-full flex-col rounded-[1.75rem] border border-border bg-brand-ivory-white/70 p-5 transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:bg-card/70"
          >
            <span className="inline-flex w-fit rounded-full bg-primary/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-foreground">
              {guide.category}
            </span>
            <h3 className="mt-4 text-lg leading-snug text-foreground transition group-hover:text-primary">
              {guide.title}
            </h3>
            <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">
              {guide.excerpt}
            </p>
            <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
              <span>{guide.readTime}</span>
              <span className="transition group-hover:translate-x-1 group-hover:text-foreground">
                →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
