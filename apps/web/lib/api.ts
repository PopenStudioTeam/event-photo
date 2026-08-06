export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

function galleryTokenForPath(path: string): string | null {
  if (typeof window === "undefined") return null;
  const match = path.match(/^\/e\/([^/?]+)/);
  if (!match) return null;
  return sessionStorage.getItem(`gallery_unlock_${match[1]}`);
}

export async function apiFetch<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const token =
    typeof window !== "undefined"
      ? window.localStorage.getItem("eventphoto_token")
      : null;

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
    let message = `API error ${res.status}`;
    try {
      const body = (await res.json()) as { error?: string };
      if (body.error) message = body.error;
    } catch {
      // ignore non-json error bodies
    }
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}

export async function apiFetchBlob(path: string, options: RequestInit = {}) {
  const token =
    typeof window !== "undefined"
      ? window.localStorage.getItem("eventphoto_token")
      : null;

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
    throw new Error(`API error ${res.status}`);
  }

  return res.blob();
}

export async function apiFetchBlobWithProgress(
  path: string,
  options: RequestInit = {},
  onProgress?: (percent: number) => void
): Promise<Blob> {
  const token =
    typeof window !== "undefined"
      ? window.localStorage.getItem("eventphoto_token")
      : null;

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
    throw new Error(`API error ${res.status}`);
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