"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth";
import { fetchAuthMe, resolvePostAuthPath } from "@/lib/auth-redirect";

export function RedirectIfAuthenticated({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const redirectSignedIn = async () => {
      const token = getToken();
      if (!token) {
        setReady(true);
        return;
      }

      try {
        const me = await fetchAuthMe();
        const path = await resolvePostAuthPath({
          token,
          organizer: me.organizer,
          needsOnboarding: me.needsOnboarding,
        });
        router.replace(path);
      } catch {
        setReady(true);
      }
    };

    redirectSignedIn();
  }, [router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Redirecting…
      </div>
    );
  }

  return children;
}
