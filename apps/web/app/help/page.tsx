import type { Metadata } from "next";
import { HelpHero } from "@/components/help/help-hero";
import { HelpCategoryCard } from "@/components/help/category-card";
import { HelpFooter } from "@/components/help/help-footer";
import { helpCategories, countArticles } from "@/lib/help-center-data";

export const metadata: Metadata = {
  title: "Help Center — Event Photo",
  description: "Guides, tutorials, and answers for using Event Photo.",
};

export default function HelpCenterPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <HelpHero variant="home" heading="Guides, tutorials and answers" />

      <main className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="space-y-4">
          {helpCategories.map((category) => (
            <HelpCategoryCard
              key={category.slug}
              slug={category.slug}
              title={category.title}
              description={category.description}
              count={countArticles(category)}
              icon={category.icon}
            />
          ))}
        </div>
      </main>

      <HelpFooter />
    </div>
  );
}
