import { Hono } from "hono";
import { eq } from "drizzle-orm";
import Stripe from "stripe";

import { db } from "@app/shared/db";
import { events } from "@app/shared/schema";
import { stripe } from "../lib/stripe.js";
import { EVENT_LIMITS } from "../lib/event-limits.js";

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

if (!WEBHOOK_SECRET) {
  throw new Error("STRIPE_WEBHOOK_SECRET is not configured");
}

export const stripeWebhookRoutes = new Hono().post(
  "/stripe",
  async (c) => {
    const signature = c.req.header("Stripe-Signature");

    if (!signature) {
      return c.json({ error: "Missing Stripe signature" }, 400);
    }

    const rawBody = await c.req.text();

    let stripeEvent: Stripe.Event;

    try {
      stripeEvent = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        WEBHOOK_SECRET
      );
    } catch (error) {
      console.error("Invalid Stripe webhook signature", error);
      return c.json({ error: "Invalid webhook signature" }, 400);
    }

    try {
      switch (stripeEvent.type) {
        case "checkout.session.completed": {
          const session = stripeEvent.data.object as Stripe.Checkout.Session;

          const eventId = session.metadata?.eventId;
          const plan = session.metadata?.plan;

          if (!eventId || (plan !== "premium" && plan !== "pro")) {
            console.error("Checkout session is missing valid metadata");
            break;
          }

          const paymentIntentId =
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : null;

          await db
            .update(events)
            .set({
              plan,
              paymentStatus: "paid",
              maxMediaCount: EVENT_LIMITS[plan].maxMediaCount,
              stripeCheckoutSessionId: session.id,
              stripePaymentIntentId: paymentIntentId,
              paidAt: new Date(),
            })
            .where(eq(events.id, eventId));

          break;
        }

        case "checkout.session.async_payment_failed": {
          const session = stripeEvent.data.object as Stripe.Checkout.Session;
          const eventId = session.metadata?.eventId;

          if (eventId) {
            await db
              .update(events)
              .set({
                paymentStatus: "failed",
              })
              .where(eq(events.id, eventId));
          }

          break;
        }

        case "checkout.session.expired": {
          const session = stripeEvent.data.object as Stripe.Checkout.Session;
          const eventId = session.metadata?.eventId;

          if (eventId) {
            await db
              .update(events)
              .set({
                paymentStatus: "failed",
              })
              .where(eq(events.id, eventId));
          }

          break;
        }

        case "charge.refunded": {
          const charge = stripeEvent.data.object as Stripe.Charge;
          const paymentIntentId =
            typeof charge.payment_intent === "string"
              ? charge.payment_intent
              : null;

          if (paymentIntentId) {
            await db
              .update(events)
              .set({
                paymentStatus: "refunded",
              })
              .where(eq(events.stripePaymentIntentId, paymentIntentId));
          }

          break;
        }

        default:
          break;
      }

      return c.json({ received: true });
    } catch (error) {
      console.error("Stripe webhook processing failed", error);
      return c.json({ error: "Webhook processing failed" }, 500);
    }
  }
);