import { describe, expect, it } from "vitest";
import {
  normalizeCoverContentType,
  validateCoverFile,
} from "./cover-file";

function file(name: string, type: string, size = 1024) {
  return new File([new Uint8Array(size)], name, { type });
}

describe("normalizeCoverContentType", () => {
  it("normalizes image/jpg to image/jpeg", () => {
    expect(normalizeCoverContentType(file("cover.jpg", "image/jpg"))).toBe(
      "image/jpeg"
    );
  });

  it("infers type from extension when missing", () => {
    expect(normalizeCoverContentType(file("cover.png", ""))).toBe("image/png");
  });

  it("returns null for unsupported types", () => {
    expect(normalizeCoverContentType(file("cover.heic", "image/heic"))).toBeNull();
  });
});

describe("validateCoverFile", () => {
  it("accepts a valid jpeg", () => {
    expect(validateCoverFile(file("cover.jpg", "image/jpeg"))).toBeNull();
  });

  it("rejects files over 5 MB", () => {
    expect(
      validateCoverFile(file("cover.jpg", "image/jpeg", 5 * 1024 * 1024 + 1))
    ).toContain("5 MB");
  });

  it("rejects HEIC with a helpful message", () => {
    expect(validateCoverFile(file("cover.heic", "image/heic"))).toContain("HEIC");
  });
});
