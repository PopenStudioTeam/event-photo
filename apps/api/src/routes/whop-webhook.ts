import { Hono } from "hono";
import { and, eq, ne } from "drizzle-orm";

import { db } from "@app/shared/db";
import { events } from "@app/shared/schema";
import { EVENT_LIMITS } from "../lib/event-limits.js";
import { unwrapWhopWebhook } from "../lib/whop-webhook.js";

const WEBHOOK_SECRET = process.env.WHOP_WEBHOOK_SECRET;

if (!WEBHOOK_SECRET) {
  throw new Error("WHOP_WEBHOOK_SECRET is not configured");
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
}

function asString(value: unknown) {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function readPlan(value: unknown): "premium" | "pro" | null {
  return value === "premium" || value === "pro" ? value : null;
}

function readMetadata(data: Record<string, unknown>) {
  return asRecord(data.metadata) ?? {};
}

async function markEventPaid(options: {
  eventId: string;
  plan: "premium" | "pro";
  checkoutConfigurationId: string | null;
  paymentId: string | null;
}) {
  await db
    .update(events)
    .set({
      plan: options.plan,
      paymentStatus: "paid",
      maxMediaCount: EVENT_LIMITS[options.plan].maxMediaCount,
      whopCheckoutConfigurationId: options.checkoutConfigurationId,
      whopPaymentId: options.paymentId,
      paidAt: new Date(),
    })
    .where(eq(events.id, options.eventId));
}

export const whopWebhookRoutes = new Hono().post("/whop", async (c) => {
  const rawBody = await c.req.text();
  const headers = Object.fromEntries(c.req.raw.headers);

  let webhookEvent: ReturnType<typeof unwrapWhopWebhook>;

  try {
    webhookEvent = unwrapWhopWebhook(rawBody, headers, WEBHOOK_SECRET);
  } catch (error) {
    console.error("Invalid Whop webhook signature", error);
    return c.json({ error: "Invalid webhook signature" }, 400);
  }

  const eventType = webhookEvent.type ?? webhookEvent.action;

  try {
    switch (eventType) {
      case "payment.succeeded": {
        const data = asRecord(webhookEvent.data);

        if (!data) {
          break;
        }

        const metadata = readMetadata(data);
        const eventId = asString(metadata.eventId);
        const plan = readPlan(metadata.plan);

        if (!eventId || !plan) {
          console.error("Payment webhook is missing valid metadata");
          break;
        }

        await markEventPaid({
          eventId,
          plan,
          checkoutConfigurationId: asString(data.checkout_configuration_id),
          paymentId: asString(data.id),
        });

        break;
      }

      case "payment.failed": {
        const data = asRecord(webhookEvent.data);

        if (!data) {
          break;
        }

        const eventId = asString(readMetadata(data).eventId);

        if (eventId) {
          await db
            .update(events)
            .set({
              paymentStatus: "failed",
              whopCheckoutConfigurationId: null,
            })
            .where(
              and(eq(events.id, eventId), ne(events.paymentStatus, "paid"))
            );
        }

        break;
      }

      case "payment.canceled": {
        const data = asRecord(webhookEvent.data);

        if (!data) {
          break;
        }

        const metadata = readMetadata(data);
        const eventId = asString(metadata.eventId);
        const checkoutId = asString(data.checkout_configuration_id);

        if (eventId) {
          await db
            .update(events)
            .set({
              paymentStatus: "free",
              whopCheckoutConfigurationId: null,
            })
            .where(
              and(eq(events.id, eventId), ne(events.paymentStatus, "paid"))
            );
        } else if (checkoutId) {
          await db
            .update(events)
            .set({
              paymentStatus: "free",
              whopCheckoutConfigurationId: null,
            })
            .where(
              and(
                eq(events.whopCheckoutConfigurationId, checkoutId),
                ne(events.paymentStatus, "paid")
              )
            );
        }

        break;
      }

      case "refund.created": {
        const data = asRecord(webhookEvent.data);
        const payment = asRecord(data?.payment);
        const paymentId =
          asString(payment?.id) ?? asString(data?.payment_id);

        if (paymentId) {
          await db
            .update(events)
            .set({
              plan: "free",
              paymentStatus: "refunded",
              maxMediaCount: EVENT_LIMITS.free.maxMediaCount,
              paidAt: null,
              whopPaymentId: null,
              protected: false,
              protectedPasswordHash: null,
              povEnabled: false,
              povMaxPerGuest: 0,
              povRevealAt: null,
            })
            .where(eq(events.whopPaymentId, paymentId));
        }

        break;
      }

      default:
        break;
    }

    return c.json({ received: true });
  } catch (error) {
    console.error("Whop webhook processing failed", error);
    return c.json({ error: "Webhook processing failed" }, 500);
  }
});
