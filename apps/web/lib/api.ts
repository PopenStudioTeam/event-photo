import { getToken, logoutAndRedirectToLogin } from "./auth";
import { showErrorAlert } from "./error-alert";

export { showErrorAlert } from "./error-alert";
export { showSuccessToast } from "./success-toast";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://127.0.0.1:4000";

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export type UserFacingErrorOptions = {
  /** Show API body details for 401 responses (login/register). */
  showAuthFailureDetail?: boolean;
};

function isGenericErrorStatus(status: number) {
  return status === 401 || status === 408 || status >= 500;
}

function isPlainApiStatusMessage(message: string) {
  return /^API error \d+$/.test(message);
}

export function getUserFacingErrorMessage(
  error: unknown,
  fallback: string,
  options?: UserFacingErrorOptions
): string {
  if (!(error instanceof ApiError)) {
    return fallback;
  }

  if (error.status === 401 && !options?.showAuthFailureDetail) {
    return "Your session expired. Please sign in again.";
  }

  if (isGenericErrorStatus(error.status)) {
    return fallback;
  }

  if (error.message && !isPlainApiStatusMessage(error.message)) {
    return error.message;
  }

  return fallback;
}

export function reportApiError(
  error: unknown,
  fallback: string,
  options?: UserFacingErrorOptions
) {
  showErrorAlert(getUserFacingErrorMessage(error, fallback, options));
}

function isLoginAuthPath(path: string) {
  return (
    path.startsWith("/auth/login") ||
    path.startsWith("/auth/register") ||
    path.startsWith("/auth/google")
  );
}

function isPublicApiPath(path: string) {
  return (
    path.startsWith("/e/") ||
    path.startsWith("/public") ||
    path.startsWith("/qr") ||
    path.startsWith("/health") ||
    path.startsWith("/webhooks")
  );
}

function endSessionIfUnauthorized(path: string, error: ApiError) {
  if (error.status !== 401) return;
  if (isLoginAuthPath(path) || isPublicApiPath(path)) return;
  logoutAndRedirectToLogin();
}

async function readApiErrorResponse(res: Response) {
  let message = `API error ${res.status}`;

  try {
    const body = (await res.json()) as { error?: string };
    if (body.error) message = body.error;
  } catch {
    // ignore non-json error bodies
  }

  return new ApiError(res.status, message);
}

function galleryTokenForPath(path: string): string | null {
  if (typeof window === "undefined") return null;
  const match = path.match(/^\/e\/([^/?]+)/);
  if (!match) return null;
  return sessionStorage.getItem(`gallery_unlock_${match[1]}`);
}

export async function apiFetch<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> | undefined),
    "Content-Type": options.body
      ? "application/json"
      : (options.headers as Record<string, string> | undefined)?.["Content-Type"] ?? "",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const galleryToken = galleryTokenForPath(path);
  if (galleryToken) {
    headers["X-Gallery-Token"] = galleryToken;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await readApiErrorResponse(res);
    endSessionIfUnauthorized(path, error);
    throw error;
  }

  return res.json() as Promise<T>;
}

export async function apiFetchBlob(path: string, options: RequestInit = {}) {
  const token = getToken();

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> | undefined),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await readApiErrorResponse(res);
    endSessionIfUnauthorized(path, error);
    throw error;
  }

  return res.blob();
}

export async function apiFetchBlobWithProgress(
  path: string,
  options: RequestInit = {},
  onProgress?: (percent: number) => void
): Promise<Blob> {
  const token = getToken();

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> | undefined),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await readApiErrorResponse(res);
    endSessionIfUnauthorized(path, error);
    throw error;
  }

  const contentLength = res.headers.get("Content-Length");
  const total = contentLength ? Number(contentLength) : 0;

  if (!res.body || !total) {
    onProgress?.(0);
    const blob = await res.blob();
    onProgress?.(100);
    return blob;
  }

  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    received += value.length;
    onProgress?.(Math.min(100, Math.round((received / total) * 100)));
  }

  onProgress?.(100);
  return new Blob(chunks as BlobPart[], {
    type: res.headers.get("Content-Type") ?? "application/octet-stream",
  });
}
