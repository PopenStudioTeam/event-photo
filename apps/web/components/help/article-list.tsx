import Link from "next/link";
import type { HelpArticle } from "@/lib/help-center-data";

export function HelpArticleList({
  categorySlug,
  articles,
}: {
  categorySlug: string;
  articles: HelpArticle[];
}) {
  return (
    <div className="divide-y divide-border rounded-xl border border-border bg-card">
      {articles.map((article) => (
        <Link
          key={article.slug}
          href={`/help/${categorySlug}/${article.slug}`}
          className="group flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-accent"
        >
          <span className="text-sm text-foreground">{article.title}</span>
          <span className="shrink-0 text-muted-foreground/50 transition group-hover:translate-x-1 group-hover:text-foreground">
            →
          </span>
        </Link>
      ))}
    </div>
  );
}
