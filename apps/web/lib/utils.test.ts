import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("joins class names", () => {
    expect(cn("px-2", "py-1")).toBe("px-2 py-1");
  });

  it("skips falsy values", () => {
    expect(cn("block", false && "hidden", null, undefined, "text-sm")).toBe(
      "block text-sm"
    );
  });

  it("merges conflicting Tailwind classes", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });
});
