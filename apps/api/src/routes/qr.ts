import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { eq } from "drizzle-orm";
import QRCode from "qrcode";
import { db } from "@app/shared/db";
import { events } from "@app/shared/schema";

const JWT_SECRET = process.env.JWT_SECRET!;
const BASE_WEB_URL = process.env.BASE_WEB_URL!; // e.g. http://localhost:3000 or https://events.yourdomain.com

export const qrRoutes = new Hono().get("/:slug", async (c) => {
  const slug = c.req.param("slug");

  const [event] = await db.select().from(events).where(eq(events.slug, slug));
  if (!event) {
    return c.notFound();
  }

  const url = `${BASE_WEB_URL}/e/${event.slug}`;

  const pngBuffer = await QRCode.toBuffer(url, {
    type: "png",
    errorCorrectionLevel: "M",
    margin: 1,
    width: 512,
  });

  c.header("Content-Type", "image/png");
  c.header("Cache-Control", "public, max-age=3600");
  return c.body(pngBuffer);
});