import { Hono } from "hono";
import { eq } from "drizzle-orm";
import QRCode from "qrcode";
import { db } from "@app/shared/db";
import { events } from "@app/shared/schema";

function resolveWebBaseUrl(c: {
  req: {
    query: (key: string) => string | undefined;
    header: (key: string) => string | undefined;
  };
}): string {
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

  return process.env.BASE_WEB_URL ?? "https://127.0.0.1:3000";
}

function qrFilename(slug: string, name: string) {
  const safeName =
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_|_$/g, "") || slug;
  return `${safeName}-qr.png`;
}

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
