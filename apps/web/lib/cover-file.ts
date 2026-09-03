export const COVER_MAX_BYTES = 5 * 1024 * 1024;
export const COVER_ACCEPT = "image/jpeg,image/png,image/webp";
export const COVER_ACCEPT_LABEL = "JPG, PNG, or WebP";

const ALLOWED_COVER_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export function normalizeCoverContentType(file: File): string | null {
  const type = file.type === "image/jpg" ? "image/jpeg" : file.type;
  if (ALLOWED_COVER_TYPES.has(type)) return type;

  const extension = file.name.split(".").pop()?.toLowerCase();
  if (extension === "jpg" || extension === "jpeg") return "image/jpeg";
  if (extension === "png") return "image/png";
  if (extension === "webp") return "image/webp";

  return null;
}

export function validateCoverFile(file: File): string | null {
  if (file.size > COVER_MAX_BYTES) {
    return "Cover image must be 5 MB or smaller.";
  }

  const contentType = normalizeCoverContentType(file);
  if (!contentType) {
    if (file.type.startsWith("image/")) {
      return `Unsupported image type. Use ${COVER_ACCEPT_LABEL} (HEIC is not supported).`;
    }
    return `Please choose a cover image (${COVER_ACCEPT_LABEL}).`;
  }

  return null;
}
