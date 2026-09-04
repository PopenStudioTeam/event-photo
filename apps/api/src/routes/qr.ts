import { Hono } from "hono";
import { eq } from "drizzle-orm";
import QRCode from "qrcode";
import { db } from "@app/shared/db";
import { events } from "@app/shared/schema";
import { qrFilename, resolveWebBaseUrl } from "../lib/qr.js";

export const qrRoutes = new Hono().get("/:slug", async (c) => {
  const slug = c.req.param("slug");

  const [event] = await db.select().from(events).where(eq(events.slug, slug));
  if (!event) {
    return c.notFound();
  }

  const url = `${resolveWebBaseUrl(c)}/e/${event.slug}`;
  const download = c.req.query("download") === "1";

  const pngBuffer = await QRCode.toBuffer(url, {
    type: "png",
    errorCorrectionLevel: "M",
    margin: 1,
    width: 512,
  });

  const headers: Record<string, string> = {
    "Content-Type": "image/png",
    "Cache-Control": download ? "private, no-cache" : "public, max-age=3600",
  };

  if (download) {
    headers["Content-Disposition"] = `attachment; filename="${qrFilename(event.slug, event.name)}"`;
  }

  return new Response(new Uint8Array(pngBuffer), {
    status: 200,
    headers,
  });
});
