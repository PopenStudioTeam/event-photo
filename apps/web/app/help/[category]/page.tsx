import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HelpHero } from "@/components/help/help-hero";
import { HelpBreadcrumb } from "@/components/help/breadcrumb";
import { HelpArticleList } from "@/components/help/article-list";
import { HelpFooter } from "@/components/help/help-footer";
import { helpCategories, findHelpCategory, countArticles } from "@/lib/help-center-data";

type HelpCategoryPageProps = {
  params: Promise<{ category: string }>;
};

export function generateStaticParams() {
  return helpCategories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({
  params,
}: HelpCategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = findHelpCategory(categorySlug);
  if (!category) return {};

  return {
    title: `${category.title} — Event Photo Help Center`,
    description: category.description,
  };
}

export default async function HelpCategoryPage({
  params,
}: HelpCategoryPageProps) {
  const { category: categorySlug } = await params;
  const category = findHelpCategory(categorySlug);
  if (!category) notFound();

  const Icon = category.icon;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <HelpHero />

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <HelpBreadcrumb
          items={[{ label: "All Collections", href: "/help" }, { label: category.title }]}
        />

        <div className="mt-6 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>
        <h1 className="mt-4 text-3xl leading-tight text-foreground">
          {category.title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {category.description}
        </p>
        <div className="mt-1 text-xs text-muted-foreground/70">
          {countArticles(category)} articles
        </div>

        <div className="mt-8 space-y-10">
          {category.groups.map((group, index) => (
            <div key={group.title ?? `group-${index}`}>
              {group.title && (
                <h2 className="mb-3 text-lg font-bold text-foreground">
                  {group.title}
                </h2>
              )}
              <HelpArticleList
                categorySlug={category.slug}
                articles={group.articles}
              />
            </div>
          ))}
        </div>
      </main>

      <HelpFooter />
    </div>
  );
}
