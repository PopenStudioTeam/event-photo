export function resolveWebBaseUrl(c: {
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

  return process.env.BASE_WEB_URL ?? "http://localhost:3000";
}

export function qrFilename(slug: string, name: string) {
  const safeName =
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_|_$/g, "") || slug;
  return `${safeName}-qr.png`;
}
