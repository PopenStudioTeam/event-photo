export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export async function apiFetch(path: string, options: RequestInit = {}) {
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

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status}`);
  }

  return res.json();
}