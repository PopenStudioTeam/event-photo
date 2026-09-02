import { describe, expect, it } from "vitest";
import {
  allArticlesInCategory,
  countArticles,
  findHelpArticle,
  findHelpCategory,
  helpCategories,
  relatedArticles,
} from "./help-center-data";

describe("help center data", () => {
  it("finds a category by slug", () => {
    expect(findHelpCategory("general")?.title).toBe("General");
    expect(findHelpCategory("missing")).toBeUndefined();
  });

  it("counts articles across groups", () => {
    const category = findHelpCategory("general");
    expect(category).toBeDefined();
    expect(countArticles(category!)).toBe(allArticlesInCategory(category!).length);
    expect(countArticles(category!)).toBeGreaterThan(0);
  });

  it("finds an article by category and slug", () => {
    const result = findHelpArticle("general", "what-is-event-photo");
    expect(result?.article.title).toBe("What is Event Photo?");
    expect(findHelpArticle("general", "missing")).toBeNull();
    expect(findHelpArticle("missing", "what-is-event-photo")).toBeNull();
  });

  it("returns related articles excluding the current one", () => {
    const category = helpCategories[0];
    const related = relatedArticles(category, "what-is-event-photo", 2);
    expect(related).toHaveLength(2);
    expect(related.every((article) => article.slug !== "what-is-event-photo")).toBe(
      true
    );
  });
});
