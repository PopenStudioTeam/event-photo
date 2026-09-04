import { afterEach, describe, expect, it } from "vitest";
import { toHttpsUrl } from "./https-url.js";

afterEach(() => {
  delete process.env.WHOP_REDIRECT_PORT;
});

describe("toHttpsUrl", () => {
  it("leaves non-local URLs unchanged", () => {
    expect(toHttpsUrl("https://app.example.com/return")).toBe(
      "https://app.example.com/return"
    );
  });

  it("rewrites localhost:3000 to the default Whop redirect port", () => {
    expect(toHttpsUrl("http://localhost:3000/billing")).toBe(
      "https://127.0.0.1:3443/billing"
    );
  });

  it("rewrites 127.0.0.1 without a port using WHOP_REDIRECT_PORT", () => {
    process.env.WHOP_REDIRECT_PORT = "4443";
    expect(toHttpsUrl("http://127.0.0.1/return")).toBe(
      "https://127.0.0.1:4443/return"
    );
  });

  it("keeps a non-default local port", () => {
    expect(toHttpsUrl("http://localhost:4000/return")).toBe(
      "https://127.0.0.1:4000/return"
    );
  });
});
