const storageKey = (slug: string) => `gallery_unlock_${slug}`;

export function getGalleryUnlockToken(slug: string): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(storageKey(slug));
}

export function setGalleryUnlockToken(slug: string, token: string) {
  sessionStorage.setItem(storageKey(slug), token);
}

export function clearGalleryUnlockToken(slug: string) {
  sessionStorage.removeItem(storageKey(slug));
}
