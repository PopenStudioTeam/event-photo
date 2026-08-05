import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { eq } from "drizzle-orm";
import QRCode from "qrcode";
import { db } from "@app/shared/db";
import { events } from "@app/shared/schema";

const JWT_SECRET = process.env.JWT_SECRET!;

function resolveWebBaseUrl(c: { req: { query: (key: string) => string | undefined; header: (key: string) => string | undefined } }): string {
  const fromQuery = c.req.query("origin");
  if (fromQuery) {
    try {
      return new URL(fromQuery).origin;
    } catch {
      // ignore invalid origin param
    }
  }

  const referer = c.req.header("referer");
  if (referer) {
    try {
      return new URL(referer).origin;
    } catch {
      // ignore invalid referer
    }
  }

  return process.env.BASE_WEB_URL ?? "http://localhost:3000";
}

export const qrRoutes = new Hono().get("/:slug", async (c) => {
  const slug = c.req.param("slug");

  const [event] = await db.select().from(events).where(eq(events.slug, slug));
  if (!event) {
    return c.notFound();
  }

  const url = `${resolveWebBaseUrl(c)}/e/${event.slug}`;

  const pngBuffer = await QRCode.toBuffer(url, {
    type: "png",
    errorCorrectionLevel: "M",
    margin: 1,
    width: 512,
  });

  return new Response(new Uint8Array(pngBuffer), {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=3600",
    },
  });
});