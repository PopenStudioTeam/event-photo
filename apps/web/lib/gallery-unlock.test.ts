import { afterEach, describe, expect, it } from "vitest";
import {
  clearGalleryUnlockToken,
  getGalleryUnlockToken,
  setGalleryUnlockToken,
} from "./gallery-unlock";

afterEach(() => {
  sessionStorage.clear();
});

describe("gallery unlock token", () => {
  it("returns null when nothing is stored", () => {
    expect(getGalleryUnlockToken("summer-wedding")).toBeNull();
  });

  it("stores and reads a token per slug", () => {
    setGalleryUnlockToken("summer-wedding", "unlock-1");
    expect(getGalleryUnlockToken("summer-wedding")).toBe("unlock-1");
    expect(getGalleryUnlockToken("other-event")).toBeNull();
  });

  it("clears a token for a slug", () => {
    setGalleryUnlockToken("summer-wedding", "unlock-1");
    clearGalleryUnlockToken("summer-wedding");
    expect(getGalleryUnlockToken("summer-wedding")).toBeNull();
  });
});
