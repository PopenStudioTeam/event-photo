import { Hono, type Context } from "hono";
import { zValidator } from "@hono/zod-validator";
import { jwt, sign, verify as jwtVerify } from "hono/jwt";
import { nanoid } from "nanoid";
import { db } from "@app/shared/db";
import { media, mediaTypeEnum, events } from "@app/shared/schema";
import { coverUploadSchema, createEventSchema, updateEventSchema, uploadMediaUrlSchema, createMediaSchema, unlockEventSchema } from "@app/shared/validators";
import { count, desc, eq, lt, and, sql } from "drizzle-orm";
import { R2_BUCKET, r2 } from "../lib/r2.js";
import { hashPassword, verifyPassword } from "../lib/password.js";
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "node:crypto";

const JWT_SECRET = process.env.JWT_SECRET!;

type EventRow = typeof events.$inferSelect;

async function hasGalleryAccess(c: Context, event: EventRow): Promise<boolean> {
  if (!event.protected) return true;

  const token = c.req.header("X-Gallery-Token");
  if (!token) return false;

  try {
    const payload = await jwtVerify(token, JWT_SECRET, "HS256");
    return (
      payload.scope === "gallery" &&
      payload.sub === event.id &&
      payload.slug === event.slug
    );
  } catch {
    return false;
  }
}

export const eventRoutes = new Hono()
  .post("/", jwt({ secret: JWT_SECRET, alg: "HS256" }), zValidator("json", createEventSchema), async (c) => {
    const { sub: organizerId } = c.get("jwtPayload") as { sub: string };
    const body = c.req.valid("json");

    if (body.protected && !body.password) {
      return c.json({ error: "Password is required when gallery protection is enabled" }, 400);
    }

    const [event] = await db
      .insert(events)
      .values({
        slug: nanoid(12),
        name: body.name ?? "Untitled Event",
        eventDate: body.eventDate ? new Date(body.eventDate) : null,
        coverImageKey: null,
        organizerId,
        protected: body.protected ?? false,
        protectedPasswordHash: body.password ? hashPassword(body.password) : null,
      })
      .returning();

    const { protectedPasswordHash, ...safeEvent } = event;
    return c.json({ ...safeEvent, hasPassword: Boolean(protectedPasswordHash) }, 201);
  })
  .get("/", jwt({ secret: JWT_SECRET, alg: "HS256" }), async (c) => {
    const { sub: organizerId } = c.get("jwtPayload") as { sub: string };
  
    const myEvents = await db
      .select()
      .from(events)
      .where(eq(events.organizerId, organizerId));
  
    // For MVP, you can do a separate count query per event.
    // If performance becomes an issue, you can aggregate later.
    const eventInfos = await Promise.all(
      myEvents.map(async (event) => {
        const [countRow] = await db
          .select({ count: count() })
          .from(media)
          .where(eq(media.eventId, event.id));
  
        const command = new GetObjectCommand({
          Bucket: R2_BUCKET,
          Key: event.coverImageKey ?? "",
        });
        const url = event.coverImageKey
          ? await getSignedUrl(r2, command, { expiresIn: 300 })
          : null;
  
        return {
          id: event.id,
          slug: event.slug,
          name: event.name,
          eventDate: event.eventDate,
          coverImageKey: event.coverImageKey,
          uploadsEnabled: event.uploadsEnabled,
          organizerId: event.organizerId,
          maxMediaCount: event.maxMediaCount,
          uploadsDeadline: event.uploadsDeadline,
          protected: event.protected,
          hasPassword: Boolean(event.protectedPasswordHash),
          createdAt: event.createdAt,
          coverImageUrl: url,
          mediaCount: countRow.count,
        };
      })
    );
  
    return c.json(eventInfos);
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
    if (updates.protected !== undefined) {
      patch.protected = updates.protected;
      if (!updates.protected) {
        patch.protectedPasswordHash = null;
      }
    }
    if (updates.password) {
      patch.protected = true;
      patch.protectedPasswordHash = hashPassword(updates.password);
    }

    if (updates.protected && !updates.password && !event.protectedPasswordHash) {
      return c.json({ error: "Password is required when gallery protection is enabled" }, 400);
    }

    const [updated] = await db
      .update(events)
      .set(patch)
      .where(eq(events.id, event.id))
      .returning();

    const { protectedPasswordHash, ...safeEvent } = updated;
    return c.json({ ...safeEvent, hasPassword: Boolean(protectedPasswordHash) });
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
  .get("/:slug/media/:mediaId/download", jwt({ secret: JWT_SECRET, alg: "HS256" }), async (c) => {
    const { sub: organizerId } = c.get("jwtPayload") as { sub: string };
    const slug = c.req.param("slug");
    const mediaId = c.req.param("mediaId");

    const [event] = await db.select().from(events).where(eq(events.slug, slug));
    if (!event || event.organizerId !== organizerId) {
      return c.json({ error: "Event not found" }, 404);
    }

    const [item] = await db
      .select()
      .from(media)
      .where(and(eq(media.id, mediaId), eq(media.eventId, event.id)));

    if (!item) {
      return c.json({ error: "Media not found" }, 404);
    }

    const object = await r2.send(
      new GetObjectCommand({
        Bucket: R2_BUCKET,
        Key: item.storageKey,
      })
    );

    if (!object.Body) {
      return c.json({ error: "File not found" }, 404);
    }

    const bytes = await object.Body.transformToByteArray();
    const ext = (item.mimeType ?? "application/octet-stream").split("/")[1] || "bin";
    const baseName =
      item.guestName?.replace(/\s+/g, "_") ||
      item.caption?.slice(0, 20).replace(/\s+/g, "_") ||
      item.id;
    const filename = `${baseName}.${ext}`;

    return c.body(Buffer.from(bytes), 200, {
      "Content-Type": item.mimeType,
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": String(bytes.byteLength),
    });
  })
  .get("/:slug/media", jwt({ secret: JWT_SECRET, alg: "HS256" }), async (c) => {
    const { sub: organizerId } = c.get("jwtPayload") as { sub: string };
    const slug = c.req.param("slug");

    const [event] = await db.select().from(events).where(eq(events.slug, slug));
    if (!event || event.organizerId !== organizerId) {
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
          storageKey: m.storageKey,
          type: m.type,
          mimeType: m.mimeType,
          fileSize: m.fileSize,
          guestName: m.guestName,
          caption: m.caption,
          createdAt: m.createdAt.toISOString(),
          url,
        };
      })
    );

    return c.json(items);
  })
  .delete(
    "/:slug/media/:id",
    jwt({ secret: JWT_SECRET, alg: "HS256" }),
    async (c) => {
      const { sub: organizerId } = c.get("jwtPayload") as { sub: string };
      const slug = c.req.param("slug");
      const id = c.req.param("id");

      // Ensure event belongs to this organizer
      const [event] = await db.select().from(events).where(eq(events.slug, slug));
      if (!event || event.organizerId !== organizerId) {
        return c.json({ error: "Event not found" }, 404);
      }

      // Find media item
      const [item] = await db
        .select()
        .from(media)
        .where(and(eq(media.id, id), eq(media.eventId, event.id)));

      if (!item) {
        return c.json({ error: "Media not found" }, 404);
      }

      // Delete object from R2
      try {
        await r2.send(
          new DeleteObjectCommand({
            Bucket: R2_BUCKET,
            Key: item.storageKey,
          })
        );
      } catch (err) {
        console.error("Failed to delete object from R2", err);
        
        return c.json(
          { error: "Failed to delete file from storage" },
          500
        );
      }

      // Delete DB row
      await db.delete(media).where(eq(media.id, id));

      return c.json({ ok: true });
    }
  );

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
      protected: event.protected,
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
    const cursor = c.req.query("cursor");
  
    const [event] = await db.select().from(events).where(eq(events.slug, slug));
    if (!event) return c.json({ error: "Event not found" }, 404);

    if (!(await hasGalleryAccess(c, event))) {
      return c.json({ error: "Gallery is protected" }, 403);
    }
  
    const items = await db
      .select()
      .from(media)
      .where(
        cursor
          ? and(eq(media.eventId, event.id), lt(media.createdAt, new Date(cursor)))
          : eq(media.eventId, event.id)
      )
      .orderBy(desc(media.createdAt))
      .limit(limit);
  
    const withUrls = await Promise.all(
      items.map(async (m) => {
        const url = await getSignedUrl(
          r2,
          new GetObjectCommand({
            Bucket: R2_BUCKET,
            Key: m.storageKey,
          }),
          { expiresIn: 60 * 10 }
        );
  
        return {
          id: m.id,
          storageKey: m.storageKey,
          type: m.type,
          mimeType: m.mimeType,
          fileSize: m.fileSize,
          guestName: m.guestName,
          caption: m.caption,
          createdAt: m.createdAt?.toISOString(),
          url,
          likesCount: m.likesCount ?? 0,
        };
      })
    );
  
    const nextCursor =
      items.length === limit ? items[items.length - 1].createdAt?.toISOString() : null;
  
    return c.json({ items: withUrls, nextCursor });
  })
  .post("/:slug/media/:id/like", async (c) => {
    const slug = c.req.param("slug");
    const id = c.req.param("id");
  
    const [event] = await db.select().from(events).where(eq(events.slug, slug));
    if (!event) return c.json({ error: "Event not found" }, 404);

    if (!(await hasGalleryAccess(c, event))) {
      return c.json({ error: "Gallery is protected" }, 403);
    }
  
    const [item] = await db
      .select()
      .from(media)
      .where(and(eq(media.id, id), eq(media.eventId, event.id)));
  
    if (!item) return c.json({ error: "Media not found" }, 404);
  
    const [updated] = await db
      .update(media)
      .set({
        likesCount: sql`${media.likesCount} + 1`,
      })
      .where(eq(media.id, id))
      .returning({ likesCount: media.likesCount });
  
    return c.json({ likesCount: updated.likesCount });
  })
  .post("/:slug/unlock", zValidator("json", unlockEventSchema), async (c) => {
    const slug = c.req.param("slug");
    const { password } = c.req.valid("json");

    const [event] = await db.select().from(events).where(eq(events.slug, slug));
    if (!event) return c.json({ error: "Event not found" }, 404);

    if (!event.protected) {
      return c.json({ ok: true, protected: false });
    }

    if (!event.protectedPasswordHash) {
      return c.json({ error: "Event is protected but no password set" }, 400);
    }

    if (!verifyPassword(password, event.protectedPasswordHash)) {
      return c.json({ error: "Invalid password" }, 401);
    }

    const galleryToken = await sign(
      {
        sub: event.id,
        slug: event.slug,
        scope: "gallery",
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
      },
      JWT_SECRET
    );

    return c.json({ ok: true, protected: true, galleryToken });
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