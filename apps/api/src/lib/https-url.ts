export function toHttpsUrl(raw: string) {
  const url = new URL(raw);
  const local =
    url.hostname === "localhost" || url.hostname === "127.0.0.1";

  if (!local) {
    return url.toString();
  }

  url.protocol = "https:";
  url.hostname = "127.0.0.1";

  if (url.port === "3000" || url.port === "") {
    url.port = process.env.WHOP_REDIRECT_PORT ?? "3443";
  }

  return url.toString();
}
