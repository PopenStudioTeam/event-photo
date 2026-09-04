import { describe, expect, it } from "vitest";
import type { events } from "@app/shared/schema";
import {
  canUseFeature,
  EVENT_LIMITS,
  getInitialMediaStatus,
  getMaxMediaCount,
  hasPaidPlan,
} from "./event-limits.js";

type EventRow = typeof events.$inferSelect;

function event(overrides: Partial<EventRow> = {}): EventRow {
  return {
    plan: "free",
    paymentStatus: "free",
    ...overrides,
  } as EventRow;
}

describe("hasPaidPlan", () => {
  it("is true only for paid premium or pro events", () => {
    expect(hasPaidPlan(event({ plan: "premium", paymentStatus: "paid" }))).toBe(
      true
    );
    expect(hasPaidPlan(event({ plan: "pro", paymentStatus: "paid" }))).toBe(true);
    expect(hasPaidPlan(event({ plan: "free", paymentStatus: "paid" }))).toBe(
      false
    );
    expect(
      hasPaidPlan(event({ plan: "premium", paymentStatus: "pending" }))
    ).toBe(false);
  });
});

describe("canUseFeature", () => {
  it("blocks every feature on the free plan", () => {
    expect(canUseFeature(event(), "moderation")).toBe(false);
  });

  it("blocks features until the event is paid", () => {
    expect(
      canUseFeature(event({ plan: "premium", paymentStatus: "pending" }), "moderation")
    ).toBe(false);
  });

  it("allows premium features after payment", () => {
    const paidPremium = event({ plan: "premium", paymentStatus: "paid" });
    expect(canUseFeature(paidPremium, "moderation")).toBe(true);
    expect(canUseFeature(paidPremium, "pov")).toBe(false);
  });

  it("allows pro-only features after payment", () => {
    const paidPro = event({ plan: "pro", paymentStatus: "paid" });
    expect(canUseFeature(paidPro, "pov")).toBe(true);
    expect(canUseFeature(paidPro, "revealDate")).toBe(true);
  });
});

describe("getMaxMediaCount", () => {
  it("uses the free cap when the event is not paid", () => {
    expect(
      getMaxMediaCount(event({ plan: "pro", paymentStatus: "pending" }))
    ).toBe(EVENT_LIMITS.free.maxMediaCount);
  });

  it("uses the plan cap after payment", () => {
    expect(
      getMaxMediaCount(event({ plan: "pro", paymentStatus: "paid" }))
    ).toBe(EVENT_LIMITS.pro.maxMediaCount);
  });
});

describe("getInitialMediaStatus", () => {
  it("approves uploads when moderation is off", () => {
    expect(getInitialMediaStatus(event())).toBe("approved");
  });

  it("holds uploads as pending when moderation is on", () => {
    expect(
      getInitialMediaStatus(event({ plan: "premium", paymentStatus: "paid" }))
    ).toBe("pending");
  });
});
