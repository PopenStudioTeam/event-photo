import { serve } from "@hono/node-server";
import { Hono } from "hono";
import type { Context } from "hono";
import { cors } from "hono/cors";
import { authRoutes } from "./routes/auth.js";
import { eventRoutes, publicEventRoutes, publicMediaUploadRoutes } from "./routes/event.js";
import { qrRoutes } from "./routes/qr.js";
import { googleAuthRoutes } from "./routes/google-auth.js";
import { rateLimiter } from "hono-rate-limiter";

function clientIp(c: Context) {
  const forwarded = c.req.header("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }
  return c.req.header("x-real-ip") ?? "unknown";
}

const uploadRateLimiter = rateLimiter({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: "draft-6",
  keyGenerator: clientIp,
  skip: (c) => c.req.method !== "POST",
});

const app = new Hono();

app.use("*", cors({ origin: process.env.CORS_ORIGIN ?? "*" }));

app.get("/health", (c) => c.json({ ok: true }));
app.route("/auth", authRoutes);
app.route("/auth", googleAuthRoutes);
app.route("/events", eventRoutes);
app.route("/qr", qrRoutes);

app.route(
  "/e",
  new Hono()
    .use("/:slug/upload-url", uploadRateLimiter)
    .use("/:slug/media", uploadRateLimiter)
    .route("/", publicEventRoutes)
    .route("/", publicMediaUploadRoutes)
);

serve({ fetch: app.fetch, port: 4000 }, (info) => {
  console.log(`API running on http://localhost:${info.port}`);
});