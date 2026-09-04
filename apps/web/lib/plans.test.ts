import { describe, expect, it } from "vitest";
import {
  alreadyHasPlan,
  eventPlanSettingsPath,
  isCurrentPaidPlan,
} from "./plans";

describe("alreadyHasPlan", () => {
  it("treats an unpaid event as still on free", () => {
    expect(alreadyHasPlan("premium", "pending", "free")).toBe(true);
    expect(alreadyHasPlan("free", "free", "premium")).toBe(false);
  });

  it("locks all paid plans after a purchase", () => {
    expect(alreadyHasPlan("premium", "paid", "pro")).toBe(true);
    expect(alreadyHasPlan("premium", "paid", "premium")).toBe(true);
  });
});

describe("isCurrentPaidPlan", () => {
  it("marks free as current when the event is unpaid", () => {
    expect(isCurrentPaidPlan("free", "free", "free")).toBe(true);
    expect(isCurrentPaidPlan("pro", "paid", "pro")).toBe(true);
  });
});

describe("eventPlanSettingsPath", () => {
  it("points at the event plan tab", () => {
    expect(eventPlanSettingsPath("wedding")).toBe(
      "/events/wedding/settings?tab=plan"
    );
  });

  it("can start checkout for a paid plan", () => {
    expect(eventPlanSettingsPath("wedding", "pro")).toBe(
      "/events/wedding/settings?tab=plan&checkout=pro"
    );
  });
});
