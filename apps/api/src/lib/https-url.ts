export function toHttpsUrl(raw: string) {
  const url = new URL(raw);

  if (url.hostname === "localhost" || url.hostname === "127.0.0.1") {
    url.protocol = "https:";
  }

  if (url.hostname === "localhost") {
    url.hostname = "127.0.0.1";
  }

  return url.toString();
}
