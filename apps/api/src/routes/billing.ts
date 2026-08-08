import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";

import { db } from "@app/shared/db";
import { events } from "@app/shared/schema";
import { createCheckoutSchema } from "@app/shared/validators";

import { stripe, getStripePriceId } from "../lib/stripe.js";

const JWT_SECRET = process.env.JWT_SECRET!;
const WEB_APP_URL = process.env.WEB_APP_URL ?? "http://localhost:3000";

export const billingRoutes = new Hono()
  .post(
    "/events/:slug/checkout",
    jwt({ secret: JWT_SECRET, alg: "HS256" }),
    zValidator("json", createCheckoutSchema),
    async (c) => {
      const { sub: organizerId } = c.get("jwtPayload") as {
        sub: string;
      };

      const slug = c.req.param("slug");
      const { plan } = c.req.valid("json");

      const [event] = await db
        .select()
        .from(events)
        .where(
          and(
            eq(events.slug, slug),
            eq(events.organizerId, organizerId)
          )
        );

      if (!event) {
        return c.json({ error: "Event not found" }, 404);
      }

      if (event.paymentStatus === "paid") {
        return c.json(
          {
            error: "This event has already been paid for",
            plan: event.plan,
          },
          400
        );
      }

      const priceId = getStripePriceId(plan);

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: `${WEB_APP_URL}/settings?payment=success&event=${encodeURIComponent(
          event.slug
        )}`,
        cancel_url: `${WEB_APP_URL}/settings?payment=cancelled&event=${encodeURIComponent(
          event.slug
        )}`,
        metadata: {
          eventId: event.id,
          eventSlug: event.slug,
          organizerId,
          plan,
        },
        payment_intent_data: {
          metadata: {
            eventId: event.id,
            eventSlug: event.slug,
            organizerId,
            plan,
          },
        },
      });

      await db
        .update(events)
        .set({
          paymentStatus: "pending",
          stripeCheckoutSessionId: session.id,
        })
        .where(eq(events.id, event.id));

      return c.json({
        checkoutUrl: session.url,
        sessionId: session.id,
      });
    }
  )
  .get(
    "/events/:slug/status",
    jwt({ secret: JWT_SECRET, alg: "HS256" }),
    async (c) => {
      const { sub: organizerId } = c.get("jwtPayload") as {
        sub: string;
      };

      const slug = c.req.param("slug");

      const [event] = await db
        .select()
        .from(events)
        .where(
          and(
            eq(events.slug, slug),
            eq(events.organizerId, organizerId)
          )
        );

      if (!event) {
        return c.json({ error: "Event not found" }, 404);
      }

      return c.json({
        eventId: event.id,
        slug: event.slug,
        plan: event.plan,
        paymentStatus: event.paymentStatus,
        paidAt: event.paidAt,
        stripeCheckoutSessionId: event.stripeCheckoutSessionId,
      });
    }
  );
