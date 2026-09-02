import { describe, expect, it } from "vitest";
import {
  getCategoryIntro,
  getCategoryLabel,
  organizerDisplayName,
} from "./event-categories";

describe("getCategoryLabel", () => {
  it("returns the matching label", () => {
    expect(getCategoryLabel("wedding")).toBe("Wedding");
  });

  it("falls back to Other", () => {
    expect(getCategoryLabel("unknown")).toBe("Other");
    expect(getCategoryLabel(null)).toBe("Other");
  });
});

describe("getCategoryIntro", () => {
  it("returns a category-specific intro", () => {
    expect(getCategoryIntro("birthday")).toContain("birthday");
  });

  it("uses a generic intro for unknown categories", () => {
    expect(getCategoryIntro("meetup")).toContain("manage your event");
  });
});

describe("organizerDisplayName", () => {
  it("returns Organizer when email is missing", () => {
    expect(organizerDisplayName(undefined)).toBe("Organizer");
  });

  it("title-cases then uppercases dotted local parts", () => {
    expect(organizerDisplayName("jane.doe@example.com")).toBe("JANE DOE");
  });

  it("uppercases a single local part", () => {
    expect(organizerDisplayName("host@example.com")).toBe("HOST");
  });
});
