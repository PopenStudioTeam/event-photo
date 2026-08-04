import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { authRoutes } from "./routes/auth.js";
import { eventRoutes, publicEventRoutes, publicMediaUploadRoutes } from "./routes/event.js";
import { qrRoutes } from "./routes/qr.js";
import { googleAuthRoutes } from "./routes/google-auth.js";

const app = new Hono();

app.use("*", cors({ origin: process.env.CORS_ORIGIN ?? "*" }));

app.get("/health", (c) => c.json({ ok: true }));
app.route("/auth", authRoutes);
app.route("/auth", googleAuthRoutes);
app.route("/events", eventRoutes);
app.route("/e", publicEventRoutes);
app.route("/e", publicMediaUploadRoutes);
app.route("/qr", qrRoutes);

serve({ fetch: app.fetch, port: 4000 }, (info) => {
  console.log(`API running on http://localhost:${info.port}`);
});