import { afterEach, describe, expect, it, vi } from "vitest";
import {
  clearGuestSession,
  getGuestSession,
  saveGuestSession,
} from "./guest-session";

afterEach(() => {
  localStorage.clear();
  vi.unstubAllGlobals();
});

describe("guest session", () => {
  it("returns null when nothing is stored", () => {
    expect(getGuestSession("party")).toBeNull();
  });

  it("returns null for invalid JSON", () => {
    localStorage.setItem("eventphoto_guest_party", "{");
    expect(getGuestSession("party")).toBeNull();
  });

  it("returns null when required fields are missing", () => {
    localStorage.setItem("eventphoto_guest_party", JSON.stringify({ name: "Ada" }));
    expect(getGuestSession("party")).toBeNull();
  });

  it("saves a trimmed name and a guest id", () => {
    vi.spyOn(crypto, "randomUUID").mockReturnValue(
      "00000000-0000-0000-0000-000000000001"
    );

    const session = saveGuestSession("party", "  Ada  ");
    expect(session).toEqual({
      guestId: "00000000-0000-0000-0000-000000000001",
      name: "Ada",
    });
    expect(getGuestSession("party")).toEqual(session);
  });

  it("reuses an existing guest id", () => {
    localStorage.setItem(
      "eventphoto_guest_party",
      JSON.stringify({ guestId: "existing", name: "Ada" })
    );

    const session = saveGuestSession("party", "Ada Lovelace");
    expect(session.guestId).toBe("existing");
    expect(session.name).toBe("Ada Lovelace");
  });

  it("clears the session", () => {
    saveGuestSession("party", "Ada");
    clearGuestSession("party");
    expect(getGuestSession("party")).toBeNull();
  });
});
