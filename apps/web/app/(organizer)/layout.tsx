"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/sidebar/organizer-sidebar";
import { TopBar } from "@/components/topbar/topbar";
import { getToken, logoutAndRedirectToLogin, saveOrganizer } from "@/lib/auth";
import { fetchAuthMe } from "@/lib/auth-redirect";
import { ApiError } from "@/lib/api";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [allowed, setAllowed] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const guard = async () => {
      setAllowed(false);
      setSessionError(null);

      if (!getToken()) {
        logoutAndRedirectToLogin();
        return;
      }

      if (pathname === "/onboarding") {
        if (!cancelled) setAllowed(true);
        return;
      }

      try {
        const me = await fetchAuthMe();
        if (cancelled) return;
        saveOrganizer(me.organizer);
        if (me.needsOnboarding) {
          router.replace("/onboarding");
          return;
        }
        setAllowed(true);
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 401) {
          logoutAndRedirectToLogin();
          return;
        }
        setSessionError(
          "Could not verify your session. Check that the API is running, then refresh."
        );
      }
    };

    void guard();

    return () => {
      cancelled = true;
    };
  }, [router, pathname]);

  if (sessionError) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-4 text-sm text-muted-foreground">
        {sessionError}
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-4 text-sm text-muted-foreground">
        Checking your session…
      </div>
    );
  }

  return (
    <div className="organizer-shell min-h-dvh bg-[radial-gradient(ellipse_at_top,_#E4D4FF_0%,_var(--background)_55%)] dark:bg-[radial-gradient(ellipse_at_top,_#3B1D6E_0%,_var(--background)_55%)]">
      <Sidebar />

      <div className="flex min-h-dvh flex-col pb-[calc(5.75rem+env(safe-area-inset-bottom))] md:ml-[calc(17rem+2rem)] md:pb-4 md:pr-4 md:pt-4 xl:ml-[calc(18rem+2.5rem)] xl:pb-5 xl:pr-5 xl:pt-5">
        <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden bg-background/95 md:min-h-[calc(100dvh-2rem)] md:rounded-2xl md:border md:border-border/70 md:shadow-[0_10px_40px_-12px_rgba(15,23,42,0.12)] md:backdrop-blur-sm lg:rounded-3xl xl:min-h-[calc(100dvh-2.5rem)] dark:md:shadow-[0_10px_40px_-12px_rgba(0,0,0,0.45)]">
          <TopBar />
          <main className="min-w-0 flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-6xl px-3 py-4 sm:p-6 lg:p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
