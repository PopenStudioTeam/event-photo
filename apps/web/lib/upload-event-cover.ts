import { apiFetch } from "@/lib/api";
import { normalizeCoverContentType, validateCoverFile } from "@/lib/cover-file";

export type EventWithCover = {
  slug: string;
  coverImageUrl: string | null;
  coverImageKey: string | null;
  coverOverlay?: "none" | "gradient";
  coverLayout?: "banner" | "card";
};

export class CoverUploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CoverUploadError";
  }
}

export async function uploadEventCover(slug: string, file: File) {
  const validationError = validateCoverFile(file);
  if (validationError) {
    throw new CoverUploadError(validationError);
  }

  const contentType = normalizeCoverContentType(file);
  if (!contentType) {
    throw new CoverUploadError("Unsupported cover image type.");
  }

  const presign = await apiFetch<{ uploadUrl: string; key: string }>(
    `/events/${slug}/cover-url`,
    {
      method: "POST",
      body: JSON.stringify({ contentType, fileSize: file.size }),
    }
  );

  const putRes = await fetch(presign.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: file,
  });

  if (!putRes.ok) {
    throw new CoverUploadError(
      putRes.status === 403
        ? "Storage rejected the upload. Check your R2 bucket CORS settings."
        : `Upload to storage failed (${putRes.status}).`
    );
  }

  const updated = await apiFetch<EventWithCover>(`/events/${slug}`, {
    method: "PATCH",
    body: JSON.stringify({ coverImageKey: presign.key }),
  });

  if (!updated.coverImageUrl) {
    throw new CoverUploadError("Cover uploaded but the preview URL was not returned.");
  }

  return updated;
}
