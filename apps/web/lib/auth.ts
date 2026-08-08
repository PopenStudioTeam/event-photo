"use client";

const TOKEN_KEY = "eventphoto_token";
const USER_KEY = "eventphoto_user";

export type OrganizerUser = {
  id: string;
  email: string;
};

export function saveToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function saveOrganizer(organizer: OrganizerUser) {
  if (typeof window !== "undefined") {
    localStorage.setItem(USER_KEY, JSON.stringify(organizer));
  }
}

export function getOrganizer(): OrganizerUser | null {
  if (typeof window === "undefined") return null;

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

export function organizerInitials(email: string | undefined) {
  if (!email) return "?";
  const local = email.split("@")[0] ?? "";
  const parts = local.split(/[._-]+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return local.slice(0, 2).toUpperCase() || "?";
}
