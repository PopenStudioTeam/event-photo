import { useEffect, useState } from "react";

export function useBaseWebUrl(): string {
  const [url, setUrl] = useState(
    () => process.env.NEXT_PUBLIC_BASE_WEB_URL ?? "https://127.0.0.1:3000"
  );

  useEffect(() => {
    setUrl(window.location.origin);
  }, []);

  return url;
}
