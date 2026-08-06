import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

export function hashPassword(password: string) {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt.toString("hex")}:${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const sep = stored.lastIndexOf(":");
  if (sep === -1) return false;

  const saltPart = stored.slice(0, sep);
  const hashHex = stored.slice(sep + 1);
  if (!saltPart || !hashHex) return false;

  try {
    const salt =
      /^[0-9a-f]{32}$/i.test(saltPart)
        ? Buffer.from(saltPart, "hex")
        : Buffer.from(saltPart, "latin1");

    const candidate = scryptSync(password, salt, 64);
    return timingSafeEqual(Buffer.from(hashHex, "hex"), candidate);
  } catch {
    return false;
  }
}
