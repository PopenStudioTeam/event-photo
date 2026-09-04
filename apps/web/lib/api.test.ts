import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError, apiFetch, getUserFacingErrorMessage } from "./api";
import { saveToken } from "./auth";

describe("getUserFacingErrorMessage", () => {
  it("returns the fallback for non-API errors", () => {
    expect(getUserFacingErrorMessage(new Error("boom"), "Try again")).toBe(
      "Try again"
    );
  });

  it("hides 401 details by default", () => {
    expect(
      getUserFacingErrorMessage(new ApiError(401, "Invalid credentials"), "Failed")
    ).toBe("Your session expired. Please sign in again.");
  });

  it("shows 401 details when requested", () => {
    expect(
      getUserFacingErrorMessage(new ApiError(401, "Invalid credentials"), "Failed", {
        showAuthFailureDetail: true,
      })
    ).toBe("Failed");
  });

  it("uses the fallback for server errors", () => {
    expect(getUserFacingErrorMessage(new ApiError(500, "DB down"), "Failed")).toBe(
      "Failed"
    );
  });

  it("uses the API message for client errors", () => {
    expect(
      getUserFacingErrorMessage(new ApiError(400, "Name is required"), "Failed")
    ).toBe("Name is required");
  });

  it("uses the fallback for generic API status messages", () => {
    expect(getUserFacingErrorMessage(new ApiError(404, "API error 404"), "Failed")).toBe(
      "Failed"
    );
  });
});

describe("apiFetch", () => {
  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.unstubAllGlobals();
  });

  it("sends the bearer token when one is stored", async () => {
    saveToken("abc");
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ items: [] }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(apiFetch("/events")).resolves.toEqual({ items: [] });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://127.0.0.1:4000/events",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer abc",
        }),
      })
    );
  });

  it("attaches a gallery unlock token for public event paths", async () => {
    sessionStorage.setItem("gallery_unlock_wedding", "unlock-1");
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await apiFetch("/e/wedding/media");
    expect(fetchMock).toHaveBeenCalledWith(
      "https://127.0.0.1:4000/e/wedding/media",
      expect.objectContaining({
        headers: expect.objectContaining({
          "X-Gallery-Token": "unlock-1",
        }),
      })
    );
  });

  it("throws ApiError using the response body", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ error: "Name is required" }),
      })
    );

    await expect(apiFetch("/events")).rejects.toMatchObject({
      name: "ApiError",
      status: 400,
      message: "Name is required",
    });
  });
});
