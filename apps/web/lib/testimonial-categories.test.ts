import { describe, expect, it } from "vitest";
import { testimonialCategoryLabel } from "./testimonial-categories";

describe("testimonialCategoryLabel", () => {
  it("maps known categories", () => {
    expect(testimonialCategoryLabel("corporate")).toBe("Corporate");
    expect(testimonialCategoryLabel("party")).toBe("Party/Celebration");
  });

  it("falls back to Other", () => {
    expect(testimonialCategoryLabel("reunion")).toBe("Other");
  });
});
