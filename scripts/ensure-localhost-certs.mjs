import { mkdirSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const certDir = path.join(root, "certs");
const keyPath = path.join(certDir, "localhost-key.pem");
const certPath = path.join(certDir, "localhost.pem");

if (existsSync(keyPath) && existsSync(certPath)) {
  process.exit(0);
}

mkdirSync(certDir, { recursive: true });

function resolveOpenssl() {
  if (process.env.OPENSSL_PATH) {
    return process.env.OPENSSL_PATH;
  }

  const found = spawnSync(
    process.platform === "win32" ? "where" : "which",
    ["openssl"],
    { encoding: "utf8" }
  );
  const first = found.stdout?.split(/\r?\n/).map((line) => line.trim()).find(Boolean);

  return first || (process.platform === "win32" ? "openssl.exe" : "openssl");
}

const openssl = resolveOpenssl();

if (!process.env.OPENSSL_CONF) {
  const candidates = [
    path.join(path.dirname(openssl), "../conf/openssl.cnf"),
    path.join(path.dirname(openssl), "openssl.cnf"),
  ];
  const conf = candidates.find((file) => existsSync(file));
  if (conf) {
    process.env.OPENSSL_CONF = conf;
  }
}

const result = spawnSync(
  openssl,
  [
    "req",
    "-x509",
    "-nodes",
    "-newkey",
    "rsa:2048",
    "-days",
    "365",
    "-keyout",
    keyPath,
    "-out",
    certPath,
    "-subj",
    "/CN=localhost",
    "-addext",
    "subjectAltName=DNS:localhost,IP:127.0.0.1",
  ],
  { stdio: "inherit", env: process.env }
);

if (result.error || result.status !== 0) {
  console.error(
    "Could not create local HTTPS certificates. Install OpenSSL or set OPENSSL_PATH."
  );
  process.exit(result.status ?? 1);
}

console.log("Created local HTTPS certificates in certs/");
