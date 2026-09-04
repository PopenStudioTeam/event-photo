import { afterEach, describe, expect, it, vi } from "vitest";
import {
  ApiError,
  apiFetch,
  apiFetchBlob,
  apiFetchBlobWithProgress,
  getUserFacingErrorMessage,
  reportApiError,
} from "./api";
import { saveToken } from "./auth";
import { setErrorAlertListener } from "./error-alert";

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
      "/backend/events",
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
      "/backend/e/wedding/media",
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

  it("ends the session on 401 for protected paths", async () => {
    saveToken("abc");
    const replace = vi.fn();
    vi.stubGlobal("location", { pathname: "/dashboard", replace });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ error: "Unauthorized" }),
      })
    );

    await expect(apiFetch("/events")).rejects.toMatchObject({ status: 401 });
    expect(localStorage.getItem("eventphoto_token")).toBeNull();
    expect(replace).toHaveBeenCalledWith("/login");
  });

  it("keeps the session on 401 for public event paths", async () => {
    saveToken("abc");
    const replace = vi.fn();
    vi.stubGlobal("location", { pathname: "/e/wedding", replace });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ error: "Unauthorized" }),
      })
    );

    await expect(apiFetch("/e/wedding/media")).rejects.toMatchObject({
      status: 401,
    });
    expect(localStorage.getItem("eventphoto_token")).toBe("abc");
    expect(replace).not.toHaveBeenCalled();
  });
});

describe("reportApiError", () => {
  afterEach(() => {
    setErrorAlertListener(null);
  });

  it("shows the user-facing message", () => {
    const listener = vi.fn();
    setErrorAlertListener(listener);
    reportApiError(new ApiError(400, "Name is required"), "Failed");
    expect(listener).toHaveBeenCalledWith("Name is required");
  });
});

describe("apiFetchBlob", () => {
  afterEach(() => {
    localStorage.clear();
    vi.unstubAllGlobals();
  });

  it("returns the response blob", async () => {
    saveToken("abc");
    const blob = new Blob(["png"], { type: "image/png" });
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      blob: async () => blob,
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(apiFetchBlob("/qr/wedding")).resolves.toBe(blob);
    expect(fetchMock).toHaveBeenCalledWith(
      "/backend/qr/wedding",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer abc",
        }),
      })
    );
  });
});

describe("apiFetchBlobWithProgress", () => {
  afterEach(() => {
    localStorage.clear();
    vi.unstubAllGlobals();
  });

  it("reports 0 then 100 when the body length is unknown", async () => {
    const blob = new Blob(["data"]);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        headers: { get: () => null },
        body: null,
        blob: async () => blob,
      })
    );

    const onProgress = vi.fn();
    await expect(apiFetchBlobWithProgress("/events/a/zip", {}, onProgress)).resolves.toBe(
      blob
    );
    expect(onProgress).toHaveBeenNthCalledWith(1, 0);
    expect(onProgress).toHaveBeenLastCalledWith(100);
  });

  it("reports progress while reading the body", async () => {
    const chunk = new Uint8Array([1, 2, 3, 4]);
    const reader = {
      read: vi
        .fn()
        .mockResolvedValueOnce({ done: false, value: chunk })
        .mockResolvedValueOnce({ done: true, value: undefined }),
    };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        headers: {
          get: (name: string) =>
            name === "Content-Length" ? String(chunk.length) : "application/zip",
        },
        body: { getReader: () => reader },
      })
    );

    const onProgress = vi.fn();
    const result = await apiFetchBlobWithProgress("/events/a/zip", {}, onProgress);
    expect(result).toBeInstanceOf(Blob);
    expect(onProgress).toHaveBeenCalledWith(100);
  });
});
