import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/api", () => ({
  apiFetch: vi.fn(),
}));

import { apiFetch } from "@/lib/api";
import {
  hasSeenWelcome,
  markOnboardingDashboard,
  markWelcomeSeen,
  resolvePostAuthPath,
  shouldShowWelcomeFromOnboarding,
} from "./auth-redirect";

const organizer = { id: "1", email: "host@example.com" };

afterEach(() => {
  localStorage.clear();
  vi.mocked(apiFetch).mockReset();
});

describe("resolvePostAuthPath", () => {
  it("sends organizers to onboarding when needed", async () => {
    await expect(
      resolvePostAuthPath({
        token: "t",
        organizer,
        needsOnboarding: true,
      })
    ).resolves.toBe("/onboarding");
    expect(JSON.parse(localStorage.getItem("eventphoto_user") ?? "")).toEqual(
      organizer
    );
  });

  it("opens the only event when one is provided", async () => {
    await expect(
      resolvePostAuthPath({ token: "t", organizer }, [{ slug: "wedding" }])
    ).resolves.toBe("/events/wedding");
  });

  it("opens the dashboard when there are multiple events", async () => {
    await expect(
      resolvePostAuthPath({ token: "t", organizer }, [
        { slug: "a" },
        { slug: "b" },
      ])
    ).resolves.toBe("/dashboard");
  });

  it("fetches events when they are not passed in", async () => {
    vi.mocked(apiFetch).mockResolvedValueOnce([{ slug: "solo" }]);
    await expect(resolvePostAuthPath({ token: "t", organizer })).resolves.toBe(
      "/events/solo"
    );
  });

  it("opens the dashboard when event fetch fails", async () => {
    vi.mocked(apiFetch).mockRejectedValueOnce(new Error("offline"));
    await expect(resolvePostAuthPath({ token: "t", organizer })).resolves.toBe(
      "/dashboard"
    );
  });
});

describe("welcome flags", () => {
  it("records and reads welcome seen", () => {
    expect(hasSeenWelcome("wedding")).toBe(false);
    markWelcomeSeen("wedding");
    expect(hasSeenWelcome("wedding")).toBe(true);
  });

  it("shows the onboarding welcome once", () => {
    expect(shouldShowWelcomeFromOnboarding("wedding")).toBe(false);
    markOnboardingDashboard("wedding");
    expect(shouldShowWelcomeFromOnboarding("wedding")).toBe(true);
    expect(shouldShowWelcomeFromOnboarding("wedding")).toBe(false);
  });
});
