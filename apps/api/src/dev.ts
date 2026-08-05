import { serve } from "@hono/node-server";
import app from "./app.js";

serve({ fetch: app.fetch, port: 4000 }, (info) => {
  console.log(`API running on http://localhost:${info.port}`);
});
