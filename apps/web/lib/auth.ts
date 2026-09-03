"use client";

const TOKEN_KEY = "eventphoto_token";
const USER_KEY = "eventphoto_user";

export type OrganizerUser = {
  id: string;
  email: string;
  name?: string | null;
  onboardingCompleted?: boolean;
};

export const ORGANIZER_UPDATED_EVENT = "eventphoto-organizer-updated";

function readJwtExpiry(token: string): number | null {
  const payloadPart = token.split(".")[1];
  if (!payloadPart) return null;

  try {
    const padded = payloadPart
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(payloadPart.length + ((4 - (payloadPart.length % 4)) % 4), "=");
    const payload = JSON.parse(atob(padded)) as { exp?: unknown };
    return typeof payload.exp === "number" ? payload.exp : null;
  } catch {
    return null;
  }
}

function isJwtExpired(token: string): boolean {
  const exp = readJwtExpiry(token);
  if (exp == null) return false;
  return exp <= Math.floor(Date.now() / 1000);
}

export function saveToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;

  if (isJwtExpired(token)) {
    logout();
    return null;
  }

  return token;
}

export function clearToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function saveOrganizer(organizer: OrganizerUser) {
  if (typeof window !== "undefined") {
    localStorage.setItem(USER_KEY, JSON.stringify(organizer));
    window.dispatchEvent(new Event(ORGANIZER_UPDATED_EVENT));
  }
}

export function getOrganizer(): OrganizerUser | null {
  if (typeof window === "undefined") return null;
  if (!getToken()) return null;

  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as OrganizerUser;
  } catch {
    return null;
  }
}

export function clearOrganizer() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(USER_KEY);
  }
}

export function logout() {
  clearToken();
  clearOrganizer();
}

const LOGIN_PATHS = new Set(["/login", "/auth/login", "/auth/register"]);

export function logoutAndRedirectToLogin() {
  logout();
  if (typeof window === "undefined") return;
  if (LOGIN_PATHS.has(window.location.pathname)) return;
  window.location.replace("/login");
}

export function organizerInitials(email: string | undefined, name?: string | null) {
  const source = name?.trim() || email;
  if (!source) return "?";
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.trim().slice(0, 2).toUpperCase();
  }
  const local = email?.split("@")[0] ?? "";
  const parts = local.split(/[._-]+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return local.slice(0, 2).toUpperCase() || "?";
}
