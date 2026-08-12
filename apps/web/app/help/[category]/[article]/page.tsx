import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HelpHero } from "@/components/help/help-hero";
import { HelpBreadcrumb } from "@/components/help/breadcrumb";
import { HelpArticleList } from "@/components/help/article-list";
import { HelpFeedbackWidget } from "@/components/help/feedback-widget";
import { HelpFooter } from "@/components/help/help-footer";
import {
  helpCategories,
  allArticlesInCategory,
  findHelpArticle,
  relatedArticles,
} from "@/lib/help-center-data";

type HelpArticlePageProps = {
  params: Promise<{ category: string; article: string }>;
};

export function generateStaticParams() {
  return helpCategories.flatMap((category) =>
    allArticlesInCategory(category).map((article) => ({
      category: category.slug,
      article: article.slug,
    }))
  );
}

export async function generateMetadata({
  params,
}: HelpArticlePageProps): Promise<Metadata> {
  const { category, article } = await params;
  const result = findHelpArticle(category, article);
  if (!result) return {};

  return {
    title: `${result.article.title} — Event Photo Help Center`,
    description: result.article.subtitle,
  };
}

function formatArticleDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export default async function HelpArticlePage({
  params,
}: HelpArticlePageProps) {
  const { category: categorySlug, article: articleSlug } = await params;
  const result = findHelpArticle(categorySlug, articleSlug);
  if (!result) notFound();

  const { category, article } = result;
  const related = relatedArticles(category, article.slug);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <HelpHero />

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <HelpBreadcrumb
          items={[
            { label: "All Collections", href: "/help" },
            { label: category.title, href: `/help/${category.slug}` },
            { label: article.title },
          ]}
        />

        <h1 className="mt-6 text-3xl leading-tight text-foreground sm:text-4xl">
          {article.title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{article.subtitle}</p>
        <div className="mt-3 text-xs text-muted-foreground/70">
          {formatArticleDate(article.date)}
        </div>

        <div className="mt-8 space-y-4 border-t border-border pt-8 text-sm leading-7 text-foreground/85">
          {article.body.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-3 text-lg font-bold text-foreground">
              Related Articles
            </h2>
            <HelpArticleList categorySlug={category.slug} articles={related} />
          </div>
        )}

        <div className="mt-10">
          <HelpFeedbackWidget />
        </div>
      </main>

      <HelpFooter />
    </div>
  );
}
