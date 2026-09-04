import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/api", () => ({
  apiFetch: vi.fn(),
}));

import { apiFetch } from "@/lib/api";
import { CoverUploadError, uploadEventCover } from "./upload-event-cover";

function file(name = "cover.jpg", type = "image/jpeg", size = 1024) {
  return new File([new Uint8Array(size)], name, { type });
}

afterEach(() => {
  vi.mocked(apiFetch).mockReset();
  vi.unstubAllGlobals();
});

describe("uploadEventCover", () => {
  it("rejects an invalid cover file before calling the API", async () => {
    await expect(uploadEventCover("wedding", file("cover.heic", "image/heic"))).rejects.toMatchObject({
      name: "CoverUploadError",
    });
    expect(apiFetch).not.toHaveBeenCalled();
  });

  it("uploads to the presigned URL and patches the event", async () => {
    vi.mocked(apiFetch)
      .mockResolvedValueOnce({ uploadUrl: "https://r2.example/put", key: "covers/a.jpg" })
      .mockResolvedValueOnce({
        slug: "wedding",
        coverImageUrl: "https://cdn.example/a.jpg",
        coverImageKey: "covers/a.jpg",
      });

    const put = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    vi.stubGlobal("fetch", put);

    const cover = file();
    await expect(uploadEventCover("wedding", cover)).resolves.toMatchObject({
      coverImageUrl: "https://cdn.example/a.jpg",
    });

    expect(put).toHaveBeenCalledWith(
      "https://r2.example/put",
      expect.objectContaining({
        method: "PUT",
        headers: { "Content-Type": "image/jpeg" },
        body: cover,
      })
    );
    expect(apiFetch).toHaveBeenNthCalledWith(
      2,
      "/events/wedding",
      expect.objectContaining({ method: "PATCH" })
    );
  });

  it("explains a 403 from storage", async () => {
    vi.mocked(apiFetch).mockResolvedValueOnce({
      uploadUrl: "https://r2.example/put",
      key: "covers/a.jpg",
    });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 403 }));

    await expect(uploadEventCover("wedding", file())).rejects.toEqual(
      new CoverUploadError(
        "Storage rejected the upload. Check your R2 bucket CORS settings."
      )
    );
  });
});
