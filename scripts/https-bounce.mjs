import { createServer } from "node:https";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const keyPath = path.join(root, "certs/localhost-key.pem");
const certPath = path.join(root, "certs/localhost.pem");
const port = Number(process.env.WHOP_REDIRECT_PORT ?? 3443);
const appOrigin = process.env.WHOP_REDIRECT_APP_ORIGIN ?? "http://localhost:3000";

export function startWhopHttpsBounce() {
  const server = createServer(
    {
      key: readFileSync(keyPath),
      cert: readFileSync(certPath),
    },
    (req, res) => {
      const location = `${appOrigin}${req.url ?? "/"}`;
      res.writeHead(302, { Location: location });
      res.end();
    }
  );

  server.listen(port, "127.0.0.1", () => {
    console.log(
      `Whop HTTPS bounce: https://127.0.0.1:${port} → ${appOrigin}`
    );
  });

  return server;
}
