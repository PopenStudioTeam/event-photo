import { spawn, spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { startWhopHttpsBounce } from "./https-bounce.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const webRoot = path.join(root, "apps/web");

spawnSync(process.execPath, [path.join(root, "scripts/ensure-localhost-certs.mjs")], {
  cwd: root,
  stdio: "inherit",
  env: process.env,
});

startWhopHttpsBounce();

const child = spawn("pnpm", ["exec", "next", "dev"], {
  cwd: webRoot,
  stdio: "inherit",
  shell: true,
  env: process.env,
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
