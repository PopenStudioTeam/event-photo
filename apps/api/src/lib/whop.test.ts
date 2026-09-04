import { afterEach, describe, expect, it, vi } from "vitest";
import { resolveWhopCheckoutUrl } from "./whop.js";

afterEach(() => {
  delete process.env.WHOP_SANDBOX;
  delete process.env.WHOP_API_KEY;
  delete process.env.WHOP_PREMIUM_PLAN_ID;
  delete process.env.WHOP_PRO_PLAN_ID;
  vi.unstubAllGlobals();
  vi.resetModules();
});

describe("resolveWhopCheckoutUrl", () => {
  it("returns null when no URL is provided", () => {
    expect(resolveWhopCheckoutUrl(null)).toBeNull();
    expect(resolveWhopCheckoutUrl(undefined)).toBeNull();
    expect(resolveWhopCheckoutUrl("")).toBeNull();
  });

  it("returns absolute URLs unchanged", () => {
    expect(resolveWhopCheckoutUrl("https://whop.com/checkout/abc")).toBe(
      "https://whop.com/checkout/abc"
    );
  });

  it("prefixes a relative path with the live host", () => {
    expect(resolveWhopCheckoutUrl("/checkout/abc")).toBe(
      "https://whop.com/checkout/abc"
    );
  });

  it("prefixes a path without a leading slash", () => {
    expect(resolveWhopCheckoutUrl("checkout/abc")).toBe(
      "https://whop.com/checkout/abc"
    );
  });

  it("uses the sandbox host when WHOP_SANDBOX is set", () => {
    process.env.WHOP_SANDBOX = "true";
    expect(resolveWhopCheckoutUrl("/checkout/abc")).toBe(
      "https://sandbox.whop.com/checkout/abc"
    );
  });
});

describe("getWhopPlanId", () => {
  it("returns the configured plan id", async () => {
    vi.resetModules();
    process.env.WHOP_PREMIUM_PLAN_ID = "plan_premium";
    process.env.WHOP_PRO_PLAN_ID = "plan_pro";
    const { getWhopPlanId } = await import("./whop.js");
    expect(getWhopPlanId("premium")).toBe("plan_premium");
    expect(getWhopPlanId("pro")).toBe("plan_pro");
  });

  it("throws when a plan id is missing", async () => {
    vi.resetModules();
    process.env.WHOP_PREMIUM_PLAN_ID = "";
    process.env.WHOP_PRO_PLAN_ID = "plan_pro";
    const { getWhopPlanId } = await import("./whop.js");
    expect(() => getWhopPlanId("premium")).toThrow(
      "Whop plan is not configured for plan: premium"
    );
  });
});

describe("createWhopCheckout", () => {
  it("posts to Whop and returns the checkout configuration", async () => {
    vi.resetModules();
    process.env.WHOP_API_KEY = "whop_key";
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: "chk_1", purchase_url: "/pay/1" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const { createWhopCheckout } = await import("./whop.js");
    await expect(
      createWhopCheckout({
        planId: "plan_premium",
        redirectUrl: "https://app.example.com/return",
        metadata: { eventId: "evt_1" },
      })
    ).resolves.toEqual({ id: "chk_1", purchase_url: "/pay/1" });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.whop.com/api/v1/checkout_configurations",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer whop_key",
        }),
      })
    );
  });

  it("deletes a checkout configuration", async () => {
    vi.resetModules();
    process.env.WHOP_API_KEY = "whop_key";
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });
    vi.stubGlobal("fetch", fetchMock);

    const { deleteWhopCheckout } = await import("./whop.js");
    await expect(deleteWhopCheckout("chk_1")).resolves.toBeUndefined();
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.whop.com/api/v1/checkout_configurations/chk_1",
      expect.objectContaining({ method: "DELETE" })
    );
  });

  it("throws WhopApiError when Whop rejects the request", async () => {
    vi.resetModules();
    process.env.WHOP_API_KEY = "whop_key";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ error: { message: "Invalid plan" } }),
      })
    );

    const { createWhopCheckout, WhopApiError } = await import("./whop.js");
    await expect(
      createWhopCheckout({
        planId: "plan_premium",
        redirectUrl: "https://app.example.com/return",
        metadata: { eventId: "evt_1" },
      })
    ).rejects.toMatchObject({
      name: "WhopApiError",
      status: 400,
      message: "Invalid plan",
    });
    expect(WhopApiError).toBeDefined();
  });
});
