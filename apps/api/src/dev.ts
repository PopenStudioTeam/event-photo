import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer as createHttpsServer } from "node:https";
import { serve } from "@hono/node-server";
import app from "./app.js";

const certDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../certs"
);
const keyPath = path.join(certDir, "localhost-key.pem");
const certPath = path.join(certDir, "localhost.pem");
const useHttps = existsSync(keyPath) && existsSync(certPath);

const listener = (info: { port: number }) => {
  const protocol = useHttps ? "https" : "http";
  console.log(`API running on ${protocol}://localhost:${info.port}`);
};

if (useHttps) {
  serve(
    {
      fetch: app.fetch,
      port: 4000,
      createServer: createHttpsServer,
      serverOptions: {
        key: readFileSync(keyPath),
        cert: readFileSync(certPath),
      },
    },
    listener
  );
} else {
  serve(
    {
      fetch: app.fetch,
      port: 4000,
    },
    listener
  );
}
