import { describe, expect, it } from "vitest";
import {
  DEFAULT_QR_GREETING,
  QR_LAYOUT_CONFIG,
  formatQrCardDate,
  resolveQrGreeting,
} from "./qr-card-renderer";

describe("resolveQrGreeting", () => {
  it("returns the trimmed custom greeting", () => {
    expect(resolveQrGreeting("warm", "  Hello guests  ")).toBe("Hello guests");
  });

  it("falls back to the layout default", () => {
    expect(resolveQrGreeting("clean", "   ")).toBe(
      QR_LAYOUT_CONFIG.clean.defaultGreeting
    );
  });

  it("keeps a shared default greeting constant", () => {
    expect(DEFAULT_QR_GREETING.length).toBeGreaterThan(0);
  });
});

describe("formatQrCardDate", () => {
  it("formats a valid date with month and year", () => {
    expect(formatQrCardDate("2024-06-15")).toMatch(/2024/);
    expect(formatQrCardDate("2024-06-15")).toMatch(/15/);
  });

  it("uses a fallback for a missing date", () => {
    expect(formatQrCardDate(null)).toBe("No date set");
  });
});
