import { describe, expect, it } from "vitest";
import { formatEventDate } from "./format-date";

describe("formatEventDate", () => {
  it("returns an em dash for empty values", () => {
    expect(formatEventDate(null)).toBe("—");
    expect(formatEventDate(undefined)).toBe("—");
    expect(formatEventDate("")).toBe("—");
  });

  it("formats a YYYY-MM-DD date in en-GB", () => {
    expect(formatEventDate("2024-06-15")).toBe(
      new Date("2024-06-15T12:00:00").toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    );
  });

  it("formats a Date instance", () => {
    const date = new Date("2024-01-02T12:00:00");
    expect(formatEventDate(date)).toBe(
      date.toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    );
  });

  it("returns an em dash for invalid dates", () => {
    expect(formatEventDate("not-a-date")).toBe("—");
  });
});
