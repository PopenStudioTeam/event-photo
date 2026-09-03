import { Hono } from "hono";
import type { Context } from "hono";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { count, desc, eq } from "drizzle-orm";
import { rateLimiter } from "hono-rate-limiter";
import crypto from "node:crypto";

import { db } from "@app/shared/db";
import {
  events,
  guideComments,
  media,
  pricingPlans,
  pricingPlanFeatures,
  testimonials,
} from "@app/shared/schema";
import {
  createGuideCommentSchema,
  createTestimonialSchema,
  guideSlugParamSchema,
  testimonialPhotoUploadSchema,
} from "@app/shared/validators";
import { r2, R2_BUCKET, getSignedUploadUrl } from "../lib/r2.js";

function clientIp(c: Context) {
  const forwarded = c.req.header("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }
  return c.req.header("x-real-ip") ?? "unknown";
}

const commentRateLimiter = rateLimiter({
  windowMs: 60 * 1000,
  limit: 5,
  standardHeaders: "draft-6",
  keyGenerator: clientIp,
});

const reviewRateLimiter = rateLimiter({
  windowMs: 60 * 1000,
  limit: 5,
  standardHeaders: "draft-6",
  keyGenerator: clientIp,
});

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
  })

  .post("/testimonials/upload-url", reviewRateLimiter, async (c) => {
    const body = await c.req.json().catch(() => null);
    const parsed = testimonialPhotoUploadSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: parsed.error.flatten() }, 400);
    }

    const key = `testimonials/${Date.now()}-${crypto.randomUUID()}`;
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      ContentType: parsed.data.contentType,
      ContentLength: parsed.data.fileSize,
    });
    const uploadUrl = await getSignedUploadUrl(command);

    return c.json({ uploadUrl, key });
  })

  .post("/testimonials", reviewRateLimiter, async (c) => {
    const body = await c.req.json().catch(() => null);
    const parsed = createTestimonialSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: parsed.error.flatten() }, 400);
    }

    const [testimonial] = await db
      .insert(testimonials)
      .values({
        authorName: parsed.data.authorName,
        authorEmail: parsed.data.authorEmail,
        rating: parsed.data.rating,
        quote: parsed.data.quote,
        photoKey: parsed.data.photoKey,
        source: "guest",
        category: "other",
        verified: false,
        published: false,
      })
      .returning({ id: testimonials.id });

    return c.json(
      {
        testimonial,
        message: "Thanks! Your review will appear on the wall once it's reviewed.",
      },
      201
    );
  })

  .get("/guides/:slug/comments", async (c) => {
    const slugResult = guideSlugParamSchema.safeParse(c.req.param("slug"));
    if (!slugResult.success) {
      return c.json({ error: "Invalid guide slug" }, 400);
    }

    const rows = await db
      .select({
        id: guideComments.id,
        authorName: guideComments.authorName,
        body: guideComments.body,
        createdAt: guideComments.createdAt,
      })
      .from(guideComments)
      .where(eq(guideComments.guideSlug, slugResult.data))
      .orderBy(desc(guideComments.createdAt))
      .limit(100);

    return c.json({ comments: rows });
  })

  .post("/guides/:slug/comments", commentRateLimiter, async (c) => {
    const slugResult = guideSlugParamSchema.safeParse(c.req.param("slug"));
    if (!slugResult.success) {
      return c.json({ error: "Invalid guide slug" }, 400);
    }

    const body = await c.req.json().catch(() => null);
    const parsed = createGuideCommentSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: parsed.error.flatten() }, 400);
    }

    const [comment] = await db
      .insert(guideComments)
      .values({
        guideSlug: slugResult.data,
        authorName: parsed.data.authorName,
        authorEmail: parsed.data.authorEmail,
        body: parsed.data.body,
      })
      .returning({
        id: guideComments.id,
        authorName: guideComments.authorName,
        body: guideComments.body,
        createdAt: guideComments.createdAt,
      });

    return c.json({ comment }, 201);
  });