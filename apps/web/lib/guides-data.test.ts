import { describe, expect, it } from "vitest";
import { getGuideBySlug, getRelatedGuides, guides } from "./guides-data";

describe("guides data", () => {
  it("finds a guide by slug", () => {
    const first = guides[0];
    expect(getGuideBySlug(first.slug)?.title).toBe(first.title);
    expect(getGuideBySlug("missing")).toBeUndefined();
  });

  it("returns related guides with the default limit", () => {
    const related = getRelatedGuides(guides[0].slug);
    expect(related).toHaveLength(Math.min(3, guides.length - 1));
    expect(related.every((guide) => guide.slug !== guides[0].slug)).toBe(true);
  });

  it("honors a custom related-guide limit", () => {
    expect(getRelatedGuides(guides[0].slug, 1)).toHaveLength(1);
  });
});
