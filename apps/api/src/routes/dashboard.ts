import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { and, count, desc, eq, gte, sql } from "drizzle-orm";

import { db } from "@app/shared/db";
import { events, media } from "@app/shared/schema";

const JWT_SECRET = process.env.JWT_SECRET!;

type EventAnalytics = {
  id: string;
  slug: string;
  name: string;
  eventDate: Date | null;
  mediaCount: number;
  contributorCount: number;
  pendingMediaCount: number;
  approvedMediaCount: number;
  rejectedMediaCount: number;
};

export const dashboardRoutes = new Hono().get(
  "/analytics",
  jwt({ secret: JWT_SECRET, alg: "HS256" }),
  async (c) => {
    const { sub: organizerId } = c.get("jwtPayload") as {
      sub: string;
    };

    const organizerEvents = await db
      .select({
        id: events.id,
        slug: events.slug,
        name: events.name,
        eventDate: events.eventDate,
      })
      .from(events)
      .where(eq(events.organizerId, organizerId))
      .orderBy(desc(events.createdAt));

    const analytics: EventAnalytics[] = await Promise.all(
      organizerEvents.map(async (event) => {
        const [mediaCountRow] = await db
          .select({
            count: count(),
          })
          .from(media)
          .where(eq(media.eventId, event.id));

        const [contributorCountRow] = await db
          .select({
            count: sql<number>`count(distinct nullif(trim(${media.guestName}), ''))`,
          })
          .from(media)
          .where(eq(media.eventId, event.id));

        const [pendingCountRow] = await db
          .select({
            count: count(),
          })
          .from(media)
          .where(
            and(
              eq(media.eventId, event.id),
              eq(media.status, "pending")
            )
          );

        const [approvedCountRow] = await db
          .select({
            count: count(),
          })
          .from(media)
          .where(
            and(
              eq(media.eventId, event.id),
              eq(media.status, "approved")
            )
          );

        const [rejectedCountRow] = await db
          .select({
            count: count(),
          })
          .from(media)
          .where(
            and(
              eq(media.eventId, event.id),
              eq(media.status, "rejected")
            )
          );

        return {
          id: event.id,
          slug: event.slug,
          name: event.name,
          eventDate: event.eventDate,
          mediaCount: Number(mediaCountRow?.count ?? 0),
          contributorCount: Number(contributorCountRow?.count ?? 0),
          pendingMediaCount: Number(pendingCountRow?.count ?? 0),
          approvedMediaCount: Number(approvedCountRow?.count ?? 0),
          rejectedMediaCount: Number(rejectedCountRow?.count ?? 0),
        };
      })
    );

    const totalMedia = analytics.reduce(
      (total, event) => total + event.mediaCount,
      0
    );

    const totalContributors = analytics.reduce(
      (total, event) => total + event.contributorCount,
      0
    );

    const pendingMediaCount = analytics.reduce(
      (total, event) => total + event.pendingMediaCount,
      0
    );

    const approvedMediaCount = analytics.reduce(
      (total, event) => total + event.approvedMediaCount,
      0
    );

    const rejectedMediaCount = analytics.reduce(
      (total, event) => total + event.rejectedMediaCount,
      0
    );

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setHours(0, 0, 0, 0);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);

    const activityRows = await db
      .select({
        date: sql<string>`to_char(date_trunc('day', ${media.createdAt}), 'YYYY-MM-DD')`,
        uploads: count(),
      })
      .from(media)
      .innerJoin(events, eq(media.eventId, events.id))
      .where(
        and(
          eq(events.organizerId, organizerId),
          gte(media.createdAt, thirtyDaysAgo)
        )
      )
      .groupBy(sql`date_trunc('day', ${media.createdAt})`)
      .orderBy(sql`date_trunc('day', ${media.createdAt})`);

    const activityMap = new Map(
      activityRows.map((row) => [
        row.date,
        Number(row.uploads ?? 0),
      ])
    );

    const activity = Array.from({ length: 30 }, (_, index) => {
      const date = new Date(thirtyDaysAgo);
      date.setDate(thirtyDaysAgo.getDate() + index);

      const key = date.toISOString().slice(0, 10);

      return {
        date: key,
        uploads: activityMap.get(key) ?? 0,
      };
    });

    return c.json({
      summary: {
        eventCount: organizerEvents.length,
        mediaCount: totalMedia,
        contributorCount: totalContributors,
        pendingMediaCount,
        approvedMediaCount,
        rejectedMediaCount,
      },
      events: analytics,
      activity,
    });
  }
);