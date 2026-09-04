import { createHmac, timingSafeEqual } from "node:crypto";

const MAX_TIMESTAMP_AGE_SECONDS = 5 * 60;

type HeaderMap = Record<string, string | undefined>;

function header(headers: HeaderMap, name: string) {
  const target = name.toLowerCase();

  for (const [key, value] of Object.entries(headers)) {
    if (key.toLowerCase() === target) {
      return value;
    }
  }

  return undefined;
}

function signingKeys(secret: string) {
  const keys = [Buffer.from(secret, "utf8")];

  if (secret.startsWith("ws_") && /^[0-9a-fA-F]+$/.test(secret.slice(3))) {
    keys.push(Buffer.from(secret.slice(3), "hex"));
  }

  if (secret.startsWith("whsec_")) {
    keys.push(Buffer.from(secret.slice(6), "base64"));
  }

  return keys;
}

function signaturesMatch(expected: Buffer, providedBase64: string) {
  let provided: Buffer;

  try {
    provided = Buffer.from(providedBase64, "base64");
  } catch {
    return false;
  }

  if (provided.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(provided, expected);
}

export function unwrapWhopWebhook(
  payload: string,
  headers: HeaderMap,
  secret: string
) {
  const webhookId = header(headers, "webhook-id");
  const webhookTimestamp = header(headers, "webhook-timestamp");
  const webhookSignature = header(headers, "webhook-signature");

  if (!webhookId || !webhookTimestamp || !webhookSignature) {
    throw new Error("Missing Whop webhook signature headers");
  }

  const timestamp = Number(webhookTimestamp);

  if (!Number.isFinite(timestamp)) {
    throw new Error("Invalid Whop webhook timestamp");
  }

  const now = Math.floor(Date.now() / 1000);

  if (Math.abs(now - timestamp) > MAX_TIMESTAMP_AGE_SECONDS) {
    throw new Error("Whop webhook timestamp is too old");
  }

  const signedPayload = `${webhookId}.${webhookTimestamp}.${payload}`;
  const candidates = webhookSignature
    .split(" ")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const [, value] = part.split(",", 2);
      return value;
    })
    .filter((value): value is string => Boolean(value));

  const valid = signingKeys(secret).some((key) => {
    const expected = createHmac("sha256", key).update(signedPayload).digest();
    return candidates.some((value) => signaturesMatch(expected, value));
  });

  if (!valid) {
    throw new Error("Invalid Whop webhook signature");
  }

  return JSON.parse(payload) as {
    id?: string;
    type?: string;
    action?: string;
    data?: unknown;
  };
}
