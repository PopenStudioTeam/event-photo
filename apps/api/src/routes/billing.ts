import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";

import { db } from "@app/shared/db";
import { events } from "@app/shared/schema";
import { createCheckoutSchema } from "@app/shared/validators";

import {
  createWhopCheckout,
  getWhopPlanId,
  resolveWhopCheckoutUrl,
  WhopApiError,
} from "../lib/whop.js";
import { canPurchasePlan } from "../lib/event-limits.js";

const JWT_SECRET = process.env.JWT_SECRET!;
const WEB_APP_URL = process.env.WEB_APP_URL ?? "https://127.0.0.1:3443";

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

      if (!canPurchasePlan(event, plan)) {
        return c.json(
          {
            error:
              event.plan === plan
                ? "This event is already on this plan"
                : "This event is already paid. Choose Premium or Pro before checkout — Whop charges each plan in full, so we do not offer upgrades.",
            plan: event.plan,
          },
          400
        );
      }

      const accountId = process.env.WHOP_ACCOUNT_ID?.trim();

      let checkout;

      try {
        checkout = await createWhopCheckout({
          planId: getWhopPlanId(plan),
          accountId: accountId || undefined,
          redirectUrl: `${WEB_APP_URL}/events/${encodeURIComponent(
            event.slug
          )}/settings?tab=plan&payment=success`,
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
          ...(event.paymentStatus === "paid"
            ? {}
            : { paymentStatus: "pending" as const }),
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
