import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";
import { timingSafeEqual } from "node:crypto";

import { db } from "@app/shared/db";
import { events } from "@app/shared/schema";
import { createCheckoutSchema } from "@app/shared/validators";

import {
  createWhopCheckout,
  getWhopPlanId,
  resolveWhopCheckoutUrl,
  WhopApiError,
} from "../lib/whop.js";
import { EVENT_LIMITS } from "../lib/event-limits.js";

const JWT_SECRET = process.env.JWT_SECRET!;
const WEB_APP_URL = process.env.WEB_APP_URL ?? "https://127.0.0.1:3443";
const PAYMENT_BYPASS_KEY = process.env.PAYMENT_BYPASS_KEY?.trim() ?? "";

function paymentBypassMatches(provided: string | undefined) {
  if (!PAYMENT_BYPASS_KEY || !provided) return false;
  const expected = Buffer.from(PAYMENT_BYPASS_KEY);
  const received = Buffer.from(provided);
  if (expected.length !== received.length) return false;
  return timingSafeEqual(expected, received);
}

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
      const { plan, bypassKey } = c.req.valid("json");

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

      if (bypassKey) {
        if (!PAYMENT_BYPASS_KEY || !paymentBypassMatches(bypassKey)) {
          return c.json({ error: "Invalid payment key" }, 403);
        }

        const [updated] = await db
          .update(events)
          .set({
            plan,
            paymentStatus: "paid",
            maxMediaCount: EVENT_LIMITS[plan].maxMediaCount,
            paidAt: new Date(),
          })
          .where(eq(events.id, event.id))
          .returning({
            slug: events.slug,
            plan: events.plan,
            paymentStatus: events.paymentStatus,
            paidAt: events.paidAt,
          });

        return c.json({
          bypassed: true,
          event: updated,
        });
      }

      const planId = getWhopPlanId(plan);
      const accountId = process.env.WHOP_ACCOUNT_ID?.trim();

      let checkout;

      try {
        checkout = await createWhopCheckout({
          planId,
          accountId: accountId || undefined,
          redirectUrl: `${WEB_APP_URL}/settings?payment=success&event=${encodeURIComponent(
            event.slug
          )}`,
          metadata: {
            eventId: event.id,
            eventSlug: event.slug,
            organizerId,
            plan,
          },
        });
      } catch (error) {
        const status = error instanceof WhopApiError ? error.status : undefined;

        console.error("Whop checkout failed", error);

        if (status === 401) {
          return c.json(
            {
              error:
                "Whop rejected the API key. In the Whop dashboard go to Developer → API keys, create an Account API key (not an App key), set WHOP_API_KEY, and restart the API.",
            },
            400
          );
        }

        return c.json(
          {
            error:
              "Whop checkout could not be created. Check WHOP_API_KEY, WHOP_ACCOUNT_ID, and the plan IDs.",
          },
          400
        );
      }

      const checkoutUrl = resolveWhopCheckoutUrl(checkout.purchase_url);

      if (!checkoutUrl) {
        return c.json({ error: "Whop checkout URL was not returned" }, 400);
      }

      await db
        .update(events)
        .set({
          paymentStatus: "pending",
          whopCheckoutConfigurationId: checkout.id,
        })
        .where(eq(events.id, event.id));

      return c.json({
        checkoutUrl,
        sessionId: checkout.id,
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
        whopCheckoutConfigurationId: event.whopCheckoutConfigurationId,
      });
    }
  );
