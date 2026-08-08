import { Hono, type Context } from "hono";
import { zValidator } from "@hono/zod-validator";
import { jwt, sign, verify as jwtVerify } from "hono/jwt";
import { nanoid } from "nanoid";
import { db } from "@app/shared/db";
import { media, mediaTypeEnum, events, mediaLikes } from "@app/shared/schema";
import {
  coverUploadSchema,
  createEventSchema,
  updateEventSchema,
  uploadMediaUrlSchema,
  createMediaSchema,
  unlockEventSchema,
  listEventsQuerySchema,
  guestMediaQuerySchema,
  likeMediaSchema,
} from "@app/shared/validators";
import { count, desc, eq, lt, and, sql, ne, or, ilike, inArray } from "drizzle-orm";
import { R2_BUCKET, r2 } from "../lib/r2.js";
import { hashPassword, verifyPassword } from "../lib/password.js";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "node:crypto";
import { canUseFeature, getInitialMediaStatus, getMaxMediaCount } from "../lib/event-limits.js";

const JWT_SECRET = process.env.JWT_SECRET!;

type EventRow = typeof events.$inferSelect;

const FREE_EVENT = {
  plan: "free",
  paymentStatus: "free",
} as EventRow;

const PLAN_FEATURE_ERRORS = {
  passwordProtection: "Password protection requires a Premium or Pro plan",
  customization: "Theme customization requires a Premium or Pro plan",
  pov: "POV mode requires a Pro plan",
  revealDate: "Gallery reveal date requires a Pro plan",
  moderation: "Media moderation requires a Premium or Pro plan",
} as const;

function wantsCustomization(body: {
  primaryColor?: string;
  backgroundVariant?: string;
  coverLayout?: string;
  coverOverlay?: string;
}) {
  return (
    (body.primaryColor !== undefined && body.primaryColor !== "#ffffff") ||
    (body.backgroundVariant !== undefined && body.backgroundVariant !== "dark") ||
    (body.coverLayout !== undefined && body.coverLayout !== "banner") ||
    (body.coverOverlay !== undefined && body.coverOverlay !== "none")
  );
}

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
  .post(
    "/",
    jwt({ secret: JWT_SECRET, alg: "HS256" }),
    zValidator("json", createEventSchema),
    async (c) => {
      const { sub: organizerId } = c.get("jwtPayload") as { sub: string };
      const body = c.req.valid("json");

      if (body.plan && body.plan !== "free") {
        return c.json(
          { error: "Upgrade your event through checkout to use a paid plan" },
          403
        );
      }

      if (body.protected && !canUseFeature(FREE_EVENT, "passwordProtection")) {
        return c.json({ error: PLAN_FEATURE_ERRORS.passwordProtection }, 403);
      }

      if (wantsCustomization(body) && !canUseFeature(FREE_EVENT, "customization")) {
        return c.json({ error: PLAN_FEATURE_ERRORS.customization }, 403);
      }

      if (body.povEnabled && !canUseFeature(FREE_EVENT, "pov")) {
        return c.json({ error: PLAN_FEATURE_ERRORS.pov }, 403);
      }

      if (body.povRevealAt && !canUseFeature(FREE_EVENT, "revealDate")) {
        return c.json({ error: PLAN_FEATURE_ERRORS.revealDate }, 403);
      }

      if (body.protected && !body.password) {
        return c.json(
          { error: "Password is required when gallery protection is enabled" },
          400
        );
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
          protectedPasswordHash: body.password
            ? hashPassword(body.password)
            : null,
        
          primaryColor: body.primaryColor ?? "#ffffff",
          backgroundVariant: body.backgroundVariant ?? "dark",
          povEnabled: body.povEnabled ?? false,
          povMaxPerGuest: body.povMaxPerGuest ?? 0,
          povRevealAt: body.povRevealAt
            ? new Date(body.povRevealAt)
            : null,
          coverLayout: body.coverLayout ?? "banner",
          coverOverlay: body.coverOverlay ?? "none",
        
          plan: "free",
          paymentStatus: "free",
          maxMediaCount: getMaxMediaCount(FREE_EVENT),
        })
        .returning();

      const { protectedPasswordHash, ...safeEvent } = event;
      return c.json(
        { ...safeEvent, hasPassword: Boolean(protectedPasswordHash) },
        201
      );
    }
  )
  .get("/", jwt({ secret: JWT_SECRET, alg: "HS256" }), zValidator("query", listEventsQuerySchema), async (c) => {
    const { sub: organizerId } = c.get("jwtPayload") as { sub: string };
    const { q, uploads, protection } = c.req.valid("query");

    const conditions = [eq(events.organizerId, organizerId)];

    if (q) {
      const pattern = `%${q}%`;
      conditions.push(or(ilike(events.name, pattern), ilike(events.slug, pattern))!);
    }

    if (uploads === "enabled") {
      conditions.push(eq(events.uploadsEnabled, true));
    } else if (uploads === "disabled") {
      conditions.push(eq(events.uploadsEnabled, false));
    }

    if (protection === "yes") {
      conditions.push(eq(events.protected, true));
    } else if (protection === "no") {
      conditions.push(eq(events.protected, false));
    }

    const myEvents = await db
      .select()
      .from(events)
      .where(and(...conditions))
      .orderBy(desc(events.createdAt));

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

          primaryColor: event.primaryColor,
          backgroundVariant: event.backgroundVariant,
          povEnabled: event.povEnabled,
          povMaxPerGuest: event.povMaxPerGuest,
          povRevealAt: event.povRevealAt,
          coverLayout: event.coverLayout,
          coverOverlay: event.coverOverlay,

          plan: event.plan,
          paymentStatus: event.paymentStatus,
          paidAt: event.paidAt,
        };
      })
    );

    return c.json(eventInfos);
  })
  .post(
    "/:slug/cover-url",
    jwt({ secret: JWT_SECRET, alg: "HS256" }),
    zValidator("json", coverUploadSchema),
    async (c) => {
      const { sub: organizerId } = c.get("jwtPayload") as { sub: string };
      const slug = c.req.param("slug");
      const { contentType, fileSize } = c.req.valid("json");

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
    }
  )
  .patch(
    "/:slug",
    jwt({ secret: JWT_SECRET, alg: "HS256" }),
    zValidator("json", updateEventSchema),
    async (c) => {
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

      if (updates.protected && !canUseFeature(event, "passwordProtection")) {
        return c.json({ error: PLAN_FEATURE_ERRORS.passwordProtection }, 403);
      }

      if (updates.password && !canUseFeature(event, "passwordProtection")) {
        return c.json({ error: PLAN_FEATURE_ERRORS.passwordProtection }, 403);
      }

      if (
        wantsCustomization(updates) &&
        !canUseFeature(event, "customization")
      ) {
        return c.json({ error: PLAN_FEATURE_ERRORS.customization }, 403);
      }

      if (
        updates.povEnabled === true &&
        !canUseFeature(event, "pov")
      ) {
        return c.json({ error: PLAN_FEATURE_ERRORS.pov }, 403);
      }

      if (updates.povRevealAt && !canUseFeature(event, "revealDate")) {
        return c.json({ error: PLAN_FEATURE_ERRORS.revealDate }, 403);
      }

      if (updates.protected && !updates.password && !event.protectedPasswordHash) {
        return c.json(
          { error: "Password is required when gallery protection is enabled" },
          400
        );
      }

      // Theme updates
      if (updates.primaryColor) {
        patch.primaryColor = updates.primaryColor;
      }
      if (updates.backgroundVariant) {
        patch.backgroundVariant = updates.backgroundVariant;
      }

      // POV updates
      if (typeof updates.povEnabled === "boolean") {
        patch.povEnabled = updates.povEnabled;
      }
      if (typeof updates.povMaxPerGuest === "number") {
        patch.povMaxPerGuest = updates.povMaxPerGuest;
      }
      if (updates.povRevealAt) {
        patch.povRevealAt = new Date(updates.povRevealAt);
      }

      if (updates.coverLayout) {
        patch.coverLayout = updates.coverLayout;
      }
      if (updates.coverOverlay) {
        patch.coverOverlay = updates.coverOverlay;
      }

      if (typeof updates.uploadsEnabled === "boolean") {
        patch.uploadsEnabled = updates.uploadsEnabled;
      }

      if (Object.keys(patch).length === 0) {
        const { protectedPasswordHash, ...safeEvent } = event;
        return c.json({
          ...safeEvent,
          hasPassword: Boolean(protectedPasswordHash),
        });
      }

      const [updated] = await db
        .update(events)
        .set(patch)
        .where(eq(events.id, event.id))
        .returning();

      const { protectedPasswordHash, ...safeEvent } = updated;
      return c.json({ ...safeEvent, hasPassword: Boolean(protectedPasswordHash) });
    }
  )
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

    const [mediaCountRow] = await db
      .select({ count: count() })
      .from(media)
      .where(eq(media.eventId, event.id));

    if (mediaCountRow.count > 0) {
      return c.json({ error: "Cannot delete event with uploaded media" }, 400);
    }

    if (event.coverImageKey) {
      await r2.send(
        new DeleteObjectCommand({
          Bucket: R2_BUCKET,
          Key: event.coverImageKey,
        })
      );
    }

    await db.delete(events).where(eq(events.id, event.id));

    return c.json({ ok: true });
  })
  .get(
    "/:slug/media/:mediaId/download",
    jwt({ secret: JWT_SECRET, alg: "HS256" }),
    async (c) => {
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
      const ext =
        (item.mimeType ?? "application/octet-stream").split("/")[1] || "bin";
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
    }
  )
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

    const items = await Promise.all(
      rows.map(async (m) => {
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
          createdAt: m.createdAt.toISOString(),
          url,
          status: m.status,
          likesCount: m.likesCount ?? 0,
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

      const [event] = await db.select().from(events).where(eq(events.slug, slug));
      if (!event || event.organizerId !== organizerId) {
        return c.json({ error: "Event not found" }, 404);
      }

      const [item] = await db
        .select()
        .from(media)
        .where(and(eq(media.id, id), eq(media.eventId, event.id)));

      if (!item) {
        return c.json({ error: "Media not found" }, 404);
      }

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

      await db.delete(media).where(eq(media.id, id));

      return c.json({ ok: true });
    }
  )
  // Moderation list
  .get(
    "/:slug/media-moderation",
    jwt({ secret: JWT_SECRET, alg: "HS256" }),
    async (c) => {
      const { sub: organizerId } = c.get("jwtPayload") as { sub: string };
      const slug = c.req.param("slug");
      const statusFilter = c.req.query("status") ?? "pending";

      const [event] = await db.select().from(events).where(eq(events.slug, slug));
      if (!event || event.organizerId !== organizerId) {
        return c.json({ error: "Event not found" }, 404);
      }

      if (!canUseFeature(event, "moderation")) {
        return c.json({ error: PLAN_FEATURE_ERRORS.moderation }, 403);
      }

      const rows = await db
        .select()
        .from(media)
        .where(and(eq(media.eventId, event.id), eq(media.status, statusFilter)))
        .orderBy(desc(media.createdAt));

      const items = await Promise.all(
        rows.map(async (m) => {
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
            createdAt: m.createdAt.toISOString(),
            url,
            status: m.status,
          };
        })
      );

      return c.json(items);
    }
  )
  .post(
    "/:slug/media/:id/approve",
    jwt({ secret: JWT_SECRET, alg: "HS256" }),
    async (c) => {
      const { sub: organizerId } = c.get("jwtPayload") as { sub: string };
      const slug = c.req.param("slug");
      const id = c.req.param("id");

      const [event] = await db.select().from(events).where(eq(events.slug, slug));
      if (!event || event.organizerId !== organizerId) {
        return c.json({ error: "Event not found" }, 404);
      }

      if (!canUseFeature(event, "moderation")) {
        return c.json({ error: PLAN_FEATURE_ERRORS.moderation }, 403);
      }

      const [item] = await db
        .select()
        .from(media)
        .where(and(eq(media.id, id), eq(media.eventId, event.id)));

      if (!item) {
        return c.json({ error: "Media not found" }, 404);
      }

      const [updated] = await db
        .update(media)
        .set({ status: "approved" })
        .where(eq(media.id, id))
        .returning();

      return c.json({ ok: true, status: updated.status });
    }
  )
  .post(
    "/:slug/media/:id/reject",
    jwt({ secret: JWT_SECRET, alg: "HS256" }),
    async (c) => {
      const { sub: organizerId } = c.get("jwtPayload") as { sub: string };
      const slug = c.req.param("slug");
      const id = c.req.param("id");

      const [event] = await db.select().from(events).where(eq(events.slug, slug));
      if (!event || event.organizerId !== organizerId) {
        return c.json({ error: "Event not found" }, 404);
      }

      if (!canUseFeature(event, "moderation")) {
        return c.json({ error: PLAN_FEATURE_ERRORS.moderation }, 403);
      }

      const [item] = await db
        .select()
        .from(media)
        .where(and(eq(media.id, id), eq(media.eventId, event.id)));

      if (!item) {
        return c.json({ error: "Media not found" }, 404);
      }

      const [updated] = await db
        .update(media)
        .set({ status: "rejected" })
        .where(eq(media.id, id))
        .returning();

      return c.json({ ok: true, status: updated.status });
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

    const url = event.coverImageKey
      ? await getSignedUrl(r2, command, { expiresIn: 300 })
      : null;

    return c.json({
      slug: event.slug,
      name: event.name,
      eventDate: event.eventDate,
      coverImageUrl: url,
      uploadsEnabled: event.uploadsEnabled,
      protected: event.protected,
      primaryColor: event.primaryColor,
      backgroundVariant: event.backgroundVariant,
      povEnabled: event.povEnabled,
      povMaxPerGuest: event.povMaxPerGuest,
      povRevealAt: event.povRevealAt,
      coverLayout: event.coverLayout,
      coverOverlay: event.coverOverlay,
      moderationEnabled: canUseFeature(event, "moderation"),
    });
  })
  .post("/:slug/media", zValidator("json", createMediaSchema), async (c) => {
    const slug = c.req.param("slug");
    const { key, contentType, fileSize, guestName, guestId, caption } = c.req.valid("json");

    const [event] = await db.select().from(events).where(eq(events.slug, slug));
    if (!event || !event.uploadsEnabled) {
      return c.json({ error: "Event not found or uploads disabled" }, 404);
    }

    const mediaCountRow = await db
      .select({ count: count() })
      .from(media)
      .where(eq(media.eventId, event.id));

    if (mediaCountRow[0].count >= getMaxMediaCount(event)) {
      return c.json({ error: "Upload limit reached for this event" }, 400);
    }

    const now = new Date();
    if (event.uploadsDeadline && now > event.uploadsDeadline) {
      return c.json({ error: "Uploads are closed for this event" }, 400);
    }

    // POV per-guest limit
    if (event.povEnabled && event.povMaxPerGuest > 0) {
      const povFilter = guestId
        ? eq(media.guestId, guestId)
        : guestName
          ? eq(media.guestName, guestName)
          : null;

      if (povFilter) {
        const [guestCountRow] = await db
          .select({ count: count() })
          .from(media)
          .where(and(eq(media.eventId, event.id), povFilter));

        if (guestCountRow.count >= event.povMaxPerGuest) {
          return c.json({ error: "You have used all your shots for this event" }, 400);
        }
      }
    }

    const type: "photo" | "video" =
      contentType.startsWith("video/") ? "video" : "photo";

    const status = getInitialMediaStatus(event);

    const [record] = await db
      .insert(media)
      .values({
        eventId: event.id,
        storageKey: key,
        type,
        mimeType: contentType,
        fileSize,
        guestName,
        guestId,
        caption,
        status,
      })
      .returning();

    return c.json(record, 201);
  })
  .get("/:slug/my-media", zValidator("query", guestMediaQuerySchema), async (c) => {
    const slug = c.req.param("slug");
    const { guestId } = c.req.valid("query");

    const [event] = await db.select().from(events).where(eq(events.slug, slug));
    if (!event) return c.json({ error: "Event not found" }, 404);

    const items = await db
      .select()
      .from(media)
      .where(and(eq(media.eventId, event.id), eq(media.guestId, guestId)))
      .orderBy(desc(media.createdAt));

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
          type: m.type,
          mimeType: m.mimeType,
          guestName: m.guestName,
          caption: m.caption,
          createdAt: m.createdAt?.toISOString(),
          url,
          status: m.status,
        };
      })
    );

    return c.json({ items: withUrls });
  })
  .get("/:slug/media", async (c) => {
    const slug = c.req.param("slug");
    const limit = Number(c.req.query("limit") ?? "30");
    const cursor = c.req.query("cursor");
    const guestId = c.req.query("guestId");

    const [event] = await db.select().from(events).where(eq(events.slug, slug));
    if (!event) return c.json({ error: "Event not found" }, 404);

    if (!(await hasGalleryAccess(c, event))) {
      return c.json({ error: "Gallery is protected" }, 403);
    }

    const now = new Date();
    const revealAt = event.povRevealAt;

    const whereClause = and(
      eq(media.eventId, event.id),
      canUseFeature(event, "moderation")
        ? eq(media.status, "approved")
        : ne(media.status, "rejected")
    );

    if (event.povEnabled && revealAt && now < revealAt) {
      return c.json({
        items: [],
        nextCursor: null,
        revealAt: revealAt.toISOString(),
      });
    }

    const items = await db
      .select()
      .from(media)
      .where(
        cursor
          ? and(whereClause, lt(media.createdAt, new Date(cursor)))
          : whereClause
      )
      .orderBy(desc(media.createdAt))
      .limit(limit);

    let likedIds = new Set<string>();
    if (guestId && items.length > 0) {
      const likes = await db
        .select({ mediaId: mediaLikes.mediaId })
        .from(mediaLikes)
        .where(
          and(
            eq(mediaLikes.guestId, guestId),
            inArray(
              mediaLikes.mediaId,
              items.map((item) => item.id)
            )
          )
        );

      likedIds = new Set(likes.map((like) => like.mediaId));
    }

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
          liked: guestId ? likedIds.has(m.id) : false,
        };
      })
    );

    const nextCursor =
      items.length === limit ? items[items.length - 1].createdAt?.toISOString() : null;

    return c.json({ items: withUrls, nextCursor });
  })
  .post("/:slug/media/:id/like", zValidator("json", likeMediaSchema), async (c) => {
    const slug = c.req.param("slug");
    const id = c.req.param("id");
    const { guestId } = c.req.valid("json");

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

    const [existingLike] = await db
      .select({ id: mediaLikes.id })
      .from(mediaLikes)
      .where(and(eq(mediaLikes.mediaId, id), eq(mediaLikes.guestId, guestId)));

    if (existingLike) {
      return c.json({ likesCount: item.likesCount, liked: true });
    }

    await db.insert(mediaLikes).values({ mediaId: id, guestId });

    const [updated] = await db
      .update(media)
      .set({
        likesCount: sql`${media.likesCount} + 1`,
      })
      .where(eq(media.id, id))
      .returning({ likesCount: media.likesCount });

    return c.json({ likesCount: updated.likesCount, liked: true });
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

export const publicMediaUploadRoutes = new Hono()
  .post("/:slug/upload-url", zValidator("json", uploadMediaUrlSchema), async (c) => {
    const slug = c.req.param("slug");
    const { contentType, fileSize } = c.req.valid("json");

    const [event] = await db.select().from(events).where(eq(events.slug, slug));
    if (!event || !event.uploadsEnabled) {
      return c.json({ error: "Event not found or uploads disabled" }, 404);
    }

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