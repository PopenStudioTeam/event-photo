import { Hono } from "hono";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { count, desc, eq } from "drizzle-orm";

import { db } from "@app/shared/db";
import {
  events,
  media,
  pricingPlans,
  pricingPlanFeatures,
  testimonials,
} from "@app/shared/schema";
import { r2, R2_BUCKET } from "../lib/r2.js";

export const publicRoutes = new Hono()
  .get("/stats", async (c) => {
    const [mediaCountRow] = await db.select({ count: count() }).from(media);
    const [eventCountRow] = await db.select({ count: count() }).from(events);

    return c.json({
      totalMedia: Number(mediaCountRow?.count ?? 0),
      totalEvents: Number(eventCountRow?.count ?? 0),
    });
  })

  .get("/pricing-plans", async (c) => {
    const plans = await db
      .select()
      .from(pricingPlans)
      .where(eq(pricingPlans.active, true))
      .orderBy(pricingPlans.sortOrder);

    const features = await db
      .select()
      .from(pricingPlanFeatures)
      .orderBy(pricingPlanFeatures.sortOrder);

    const featuresByPlan = new Map<string, string[]>();
    for (const feature of features) {
      const list = featuresByPlan.get(feature.planId) ?? [];
      list.push(feature.label);
      featuresByPlan.set(feature.planId, list);
    }

    return c.json({
      plans: plans.map((plan) => ({
        key: plan.key,
        name: plan.name,
        priceCents: plan.priceCents,
        originalPriceCents: plan.originalPriceCents,
        billingNote: plan.billingNote,
        description: plan.description,
        badge: plan.badge,
        features: featuresByPlan.get(plan.id) ?? [],
      })),
    });
  })

  .get("/testimonials", async (c) => {
    const rows = await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.published, true))
      .orderBy(desc(testimonials.featured), desc(testimonials.createdAt))
      .limit(20);

    const items = await Promise.all(
      rows.map(async (row) => ({
        id: row.id,
        authorName: row.authorName,
        authorRole: row.authorRole,
        category: row.category,
        rating: row.rating,
        quote: row.quote,
        verified: row.verified,
        createdAt: row.createdAt,
        photoUrl: row.photoKey
          ? await getSignedUrl(
              r2,
              new GetObjectCommand({ Bucket: R2_BUCKET, Key: row.photoKey }),
              { expiresIn: 3600 }
            )
          : null,
      }))
    );

    return c.json({ testimonials: items });
  });