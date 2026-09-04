import { afterEach, describe, expect, it } from "vitest";
import { qrFilename, resolveWebBaseUrl } from "./qr.js";

function request(input: {
  origin?: string;
  referer?: string;
}) {
  return {
    req: {
      query: (key: string) => (key === "origin" ? input.origin : undefined),
      header: (key: string) => (key === "referer" ? input.referer : undefined),
    },
  };
}

afterEach(() => {
  delete process.env.BASE_WEB_URL;
});

describe("resolveWebBaseUrl", () => {
  it("prefers a valid origin query param", () => {
    expect(
      resolveWebBaseUrl(
        request({ origin: "https://photos.example.com/events/a", referer: "http://localhost:3000" })
      )
    ).toBe("https://photos.example.com");
  });

  it("ignores an invalid origin and uses the referer", () => {
    expect(
      resolveWebBaseUrl(request({ origin: "not-a-url", referer: "https://app.example.com/x" }))
    ).toBe("https://app.example.com");
  });

  it("falls back to BASE_WEB_URL", () => {
    process.env.BASE_WEB_URL = "https://live.example.com";
    expect(resolveWebBaseUrl(request({}))).toBe("https://live.example.com");
  });

  it("falls back to localhost when nothing is set", () => {
    expect(resolveWebBaseUrl(request({}))).toBe("http://localhost:3000");
  });
});

describe("qrFilename", () => {
  it("slugifies the event name", () => {
    expect(qrFilename("abc", " Summer Wedding! ")).toBe("summer_wedding-qr.png");
  });

  it("uses the slug when the name has no safe characters", () => {
    expect(qrFilename("party-1", "!!!")).toBe("party-1-qr.png");
  });
});
