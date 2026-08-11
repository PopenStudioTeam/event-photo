"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Guide } from "@/lib/guides-data";
import { AssetPlaceholder } from "@/components/marketing/asset-placeholder";
import { cn } from "@/lib/utils";

export function GuidesGrid({ guides }: { guides: Guide[] }) {
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(guides.map((guide) => guide.category)))],
    [guides]
  );
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? guides
      : guides.filter((guide) => guide.category === activeCategory);

  return (
    <>
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={cn(
              "rounded-full border px-4 py-2 text-xs font-medium transition",
              activeCategory === category
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:text-foreground"
            )}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <AssetPlaceholder
              label={`Cover image for "${guide.title}"`}
              className="min-h-[140px] rounded-none border-0 border-b border-dashed border-border bg-primary/10"
            />

            <div className="flex flex-1 flex-col justify-between p-6">
              <div>
                <span className="inline-flex rounded-full bg-primary/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-foreground">
                  {guide.category}
                </span>
                <h2 className="mt-4 text-lg leading-snug text-foreground">
                  {guide.title}
                </h2>
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
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
