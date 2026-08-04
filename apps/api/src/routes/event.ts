import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { jwt } from "hono/jwt";
import { nanoid } from "nanoid";
import { db } from "@app/shared/db";
import { media, mediaTypeEnum, events } from "@app/shared/schema";
import { coverUploadSchema, createEventSchema, updateEventSchema, uploadMediaUrlSchema, createMediaSchema } from "@app/shared/validators";
import { count, desc, eq, lt } from "drizzle-orm";
import { R2_BUCKET, r2 } from "../lib/r2.js";
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "node:crypto";

const JWT_SECRET = process.env.JWT_SECRET!;

export const eventRoutes = new Hono()
  .post("/", jwt({ secret: JWT_SECRET, alg: "HS256" }), zValidator("json", createEventSchema), async (c) => {
    const { sub: organizerId } = c.get("jwtPayload") as { sub: string };
    const body = c.req.valid("json");

    const [event] = await db
      .insert(events)
      .values({
        slug: nanoid(12),
        name: body.name ?? "Untitled Event",
        eventDate: body.eventDate ? new Date(body.eventDate) : null,
        coverImageKey: null,
        organizerId,
      })
      .returning();

    return c.json(event, 201);
  })
  .get("/", jwt({ secret: JWT_SECRET, alg: "HS256" }), async (c) => {
    const { sub: organizerId } = c.get("jwtPayload") as { sub: string };
    const myEvents = await db.select().from(events).where(eq(events.organizerId, organizerId));
    const eventsWithCoverUrls = await Promise.all(myEvents.map(async (event) => {
      const command = new GetObjectCommand({
        Bucket: R2_BUCKET,
        Key: event.coverImageKey ?? "",
      });
      const url = await getSignedUrl(r2, command, { expiresIn: 300 });
      return { ...event, coverImageUrl: url };
    }));
    return c.json(eventsWithCoverUrls);
  })
  .post("/:slug/cover-url", jwt({ secret: JWT_SECRET, alg: "HS256" }), zValidator("json", coverUploadSchema), async (c) => {
    const { sub: organizerId } = c.get("jwtPayload") as { sub: string };
    const slug = c.req.param("slug");
    const { contentType, fileSize } = c.req.valid("json");

    // Ownership check — organizer may only touch their own events
    const [event] = await db.select().from(events).where(eq(events.slug, slug));
    if (!event || event.organizerId !== organizerId) {
      return c.json({ error: "Event not found" }, 404);
    }

    const key = `events/${event.id}/cover-${Date.now()}`;
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      ContentType: contentType,
      ContentLength: fileSize,
    });
    const uploadUrl = await getSignedUrl(r2, command, { expiresIn: 300 });

    return c.json({ uploadUrl, key });
  })
  .patch("/:slug", jwt({ secret: JWT_SECRET, alg: "HS256" }), zValidator("json", updateEventSchema), async (c) => {
    const { sub: organizerId } = c.get("jwtPayload") as { sub: string };
    const slug = c.req.param("slug");
    const updates = c.req.valid("json");

    const [event] = await db.select().from(events).where(eq(events.slug, slug));
    if (!event || event.organizerId !== organizerId) {
      return c.json({ error: "Event not found" }, 404);
    }

    const patch: Record<string, unknown> = {};

    if (updates.name) {
      patch.name = updates.name;
    }
    if (updates.eventDate) {
      patch.eventDate = new Date(updates.eventDate);
    }
    if (updates.coverImageKey) {
      // Delete old cover from R2 if it exists and is different
      if (event.coverImageKey && event.coverImageKey !== updates.coverImageKey) {
        await r2.send(
          new DeleteObjectCommand({
            Bucket: R2_BUCKET,
            Key: event.coverImageKey,
          })
        );
      }
    
      patch.coverImageKey = updates.coverImageKey;
    }

    const [updated] = await db
      .update(events)
      .set(patch)
      .where(eq(events.id, event.id))
      .returning();

    return c.json(updated);
  })
  .delete("/:slug", jwt({ secret: JWT_SECRET, alg: "HS256" }), async (c) => {
    const { sub: organizerId } = c.get("jwtPayload") as { sub: string };
    const slug = c.req.param("slug");

    const [event] = await db.select().from(events).where(eq(events.slug, slug));
    if (!event || event.organizerId !== organizerId) {
      return c.json({ error: "Event not found" }, 404);
    }

    if (event.eventDate && event.eventDate < new Date()) {
      return c.json({ error: "Cannot delete event that has already happened" }, 400);
    }

    // Check if any media exists for this event
    const [mediaCount] = await db
      .select({ count: count() })
      .from(media)
      .where(eq(media.eventId, event.id));

    if (mediaCount.count > 0) {
      return c.json({ error: "Cannot delete event with uploaded media" }, 400);
    }

    // Delete cover image from R2 if it exists
    if (event.coverImageKey) {
      await r2.send(
        new DeleteObjectCommand({
          Bucket: R2_BUCKET,
          Key: event.coverImageKey,
        })
      );
    }

    // Delete event (media rows will be cascaded if any existed, but we block above)
    await db.delete(events).where(eq(events.id, event.id));

    return c.json({ ok: true });
  })
  .get("/:slug/media", async (c) => {
    const slug = c.req.param("slug");
  
    const [event] = await db.select().from(events).where(eq(events.slug, slug));
    if (!event) {
      return c.json({ error: "Event not found" }, 404);
    }
  
    const rows = await db
      .select()
      .from(media)
      .where(eq(media.eventId, event.id))
      .orderBy(media.createdAt);
  
    // Build response with URLs (you can use presigned GET or your own CDN URL)
    const items = await Promise.all(
      rows.map(async (m) => {
        const url = await getSignedUrl(r2, new GetObjectCommand({
          Bucket: R2_BUCKET,
          Key: m.storageKey,
        }), { expiresIn: 60 * 10 });
  
        return {
          id: m.id,
          key: m.storageKey,
          url,
          guestName: m.guestName,
          createdAt: m.createdAt.toISOString(),
        };
      })
    );
  
    return c.json(items);
  });

export const publicEventRoutes = new Hono()
  .get("/:slug", async (c) => {
    const { slug } = c.req.param();
    const [event] = await db.select().from(events).where(eq(events.slug, slug));
    if (!event) {
      return c.json({ error: "Event not found" }, 404);
    }

    const command = new GetObjectCommand({
      Bucket: R2_BUCKET,
      Key: event.coverImageKey ?? "",
    });

    const url = await getSignedUrl(r2, command, { expiresIn: 300 });

    return c.json({
      slug: event.slug,
      name: event.name,
      eventDate: event.eventDate,
      coverImageUrl: url,
      uploadsEnabled: event.uploadsEnabled,
    });
  })
  .post("/:slug/media", zValidator("json", createMediaSchema), async (c) => {
    const slug = c.req.param("slug");
    const { key, contentType, fileSize, guestName, caption } = c.req.valid("json");
  
    const [event] = await db.select().from(events).where(eq(events.slug, slug));
    if (!event || !event.uploadsEnabled) {
      return c.json({ error: "Event not found or uploads disabled" }, 404);
    }
  
    const mediaCount = await db
      .select({ count: count() })
      .from(media)
      .where(eq(media.eventId, event.id));
  
    if (mediaCount[0].count >= event.maxMediaCount) {
      return c.json({ error: "Upload limit reached for this event" }, 400);
    }
  
    const now = new Date();
    if (event.uploadsDeadline && now > event.uploadsDeadline) {
      return c.json({ error: "Uploads are closed for this event" }, 400);
    }
  
    const type = contentType.startsWith("video/") ? "video" : "photo";
  
    const [record] = await db
      .insert(media)
      .values({
        eventId: event.id,
        storageKey: key,
        type,
        mimeType: contentType,
        fileSize,
        guestName,
        caption,
      })
      .returning();
  
    return c.json(record, 201);
  })
  .get("/:slug/media", async (c) => {
    const slug = c.req.param("slug");
    const limit = Number(c.req.query("limit") ?? "30");
    const cursor = c.req.query("cursor"); // optional: timestamp or id

    const [event] = await db.select().from(events).where(eq(events.slug, slug));
    if (!event) return c.json({ error: "Event not found" }, 404);

    let query = db
      .select()
      .from(media)
      .where(eq(media.eventId, event.id))
      .orderBy(desc(media.createdAt))
      .limit(limit);

    // Simple cursor: createdAt < cursor
    if (cursor) {
      query = query.where(lt(media.createdAt, new Date(cursor)));
    }

    const items = await query;

    const nextCursor =
      items.length === limit ? items[items.length - 1].createdAt?.toISOString() : null;

    return c.json({ items, nextCursor });
  });

// Guest upload routes
export const publicMediaUploadRoutes = new Hono()
  .post("/:slug/upload-url", zValidator("json", uploadMediaUrlSchema), async (c) => {
    const slug = c.req.param("slug");
    const { contentType, fileSize } = c.req.valid("json");

    const [event] = await db.select().from(events).where(eq(events.slug, slug));
    if (!event || !event.uploadsEnabled) {
      return c.json({ error: "Event not found or uploads disabled" }, 404);
    }

    // Enforce type: image vs video for DB later
    const type = contentType.startsWith("video/") ? "video" : "photo";

    const key = `events/${event.id}/media/${Date.now()}-${crypto.randomUUID()}`;

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      ContentType: contentType,
      ContentLength: fileSize,
    });

    const uploadUrl = await getSignedUrl(r2, command, { expiresIn: 300 });

    return c.json({ uploadUrl, key, type });
  });