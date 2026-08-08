export type GuestSession = {
  guestId: string;
  name: string;
};

const storageKey = (slug: string) => `eventphoto_guest_${slug}`;

export function getGuestSession(slug: string): GuestSession | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(storageKey(slug));
    if (!raw) return null;

    const parsed = JSON.parse(raw) as GuestSession;
    if (!parsed.guestId || !parsed.name) return null;

    return parsed;
  } catch {
    return null;
  }
}

export function saveGuestSession(slug: string, name: string): GuestSession {
  const trimmedName = name.trim();
  const existing = getGuestSession(slug);
  const session: GuestSession = {
    guestId: existing?.guestId ?? crypto.randomUUID(),
    name: trimmedName,
  };

  localStorage.setItem(storageKey(slug), JSON.stringify(session));
  return session;
}

export function clearGuestSession(slug: string) {
  if (typeof window === "undefined") return;
  localStorage.removeItem(storageKey(slug));
}
