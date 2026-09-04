import { createHmac } from "node:crypto";
import { afterEach, describe, expect, it, vi } from "vitest";
import { unwrapWhopWebhook } from "./whop-webhook.js";

const SECRET = "whop_test_secret";
const PAYLOAD = JSON.stringify({ type: "payment.succeeded", data: { id: "pay_1" } });

function sign(
  payload: string,
  id: string,
  timestamp: number,
  secret = SECRET
) {
  const expected = createHmac("sha256", Buffer.from(secret, "utf8"))
    .update(`${id}.${timestamp}.${payload}`)
    .digest("base64");

  return {
    "webhook-id": id,
    "webhook-timestamp": String(timestamp),
    "webhook-signature": `v1,${expected}`,
  };
}

afterEach(() => {
  vi.useRealTimers();
});

describe("unwrapWhopWebhook", () => {
  it("returns the parsed payload for a valid signature", () => {
    const timestamp = 1_700_000_000;
    vi.useFakeTimers();
    vi.setSystemTime(timestamp * 1000);

    expect(unwrapWhopWebhook(PAYLOAD, sign(PAYLOAD, "msg_1", timestamp), SECRET)).toEqual(
      JSON.parse(PAYLOAD)
    );
  });

  it("accepts case-insensitive header names", () => {
    const timestamp = 1_700_000_000;
    vi.useFakeTimers();
    vi.setSystemTime(timestamp * 1000);
    const headers = sign(PAYLOAD, "msg_1", timestamp);

    expect(
      unwrapWhopWebhook(
        PAYLOAD,
        {
          "Webhook-Id": headers["webhook-id"],
          "Webhook-Timestamp": headers["webhook-timestamp"],
          "Webhook-Signature": headers["webhook-signature"],
        },
        SECRET
      )
    ).toEqual(JSON.parse(PAYLOAD));
  });

  it("throws when signature headers are missing", () => {
    expect(() => unwrapWhopWebhook(PAYLOAD, {}, SECRET)).toThrow(
      "Missing Whop webhook signature headers"
    );
  });

  it("throws when the timestamp is not a number", () => {
    expect(() =>
      unwrapWhopWebhook(
        PAYLOAD,
        {
          "webhook-id": "msg_1",
          "webhook-timestamp": "soon",
          "webhook-signature": "v1,abc",
        },
        SECRET
      )
    ).toThrow("Invalid Whop webhook timestamp");
  });

  it("throws when the timestamp is too old", () => {
    const timestamp = 1_700_000_000;
    vi.useFakeTimers();
    vi.setSystemTime((timestamp + 6 * 60) * 1000);

    expect(() =>
      unwrapWhopWebhook(PAYLOAD, sign(PAYLOAD, "msg_1", timestamp), SECRET)
    ).toThrow("Whop webhook timestamp is too old");
  });

  it("throws when the signature does not match", () => {
    const timestamp = 1_700_000_000;
    vi.useFakeTimers();
    vi.setSystemTime(timestamp * 1000);

    expect(() =>
      unwrapWhopWebhook(PAYLOAD, sign(PAYLOAD, "msg_1", timestamp, "other"), SECRET)
    ).toThrow("Invalid Whop webhook signature");
  });
});
