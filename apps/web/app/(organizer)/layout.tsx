"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/sidebar/organizer-sidebar";
import { TopBar } from "@/components/topbar/topbar";
import { getToken } from "@/lib/auth";
import { fetchAuthMe } from "@/lib/auth-redirect";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const guard = async () => {
      if (!getToken()) {
        router.replace("/login");
        return;
      }

      if (pathname === "/onboarding") return;

      try {
        const me = await fetchAuthMe();
        if (me.needsOnboarding) {
          router.replace("/onboarding");
        }
      } catch {
        // Allow page to render; individual pages will surface errors.
      }
    };

    guard();
  }, [router, pathname]);

  return (
    <div className="organizer-shell min-h-screen bg-[radial-gradient(ellipse_at_top,_#F5F3FA_0%,_var(--background)_55%)] dark:bg-[radial-gradient(ellipse_at_top,_#1e293b_0%,_var(--background)_50%)]">
      <Sidebar />

      <div className="flex min-h-screen flex-col pb-24 md:ml-[calc(17rem+2rem)] md:pb-4 md:pr-4 md:pt-4 xl:ml-[calc(18rem+2.5rem)] xl:pb-5 xl:pr-5 xl:pt-5">
        <div className="flex min-h-[calc(100dvh-2rem)] w-full min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-border/70 bg-background/95 shadow-[0_10px_40px_-12px_rgba(15,23,42,0.12)] backdrop-blur-sm xl:min-h-[calc(100dvh-2.5rem)] lg:rounded-3xl dark:shadow-[0_10px_40px_-12px_rgba(0,0,0,0.45)]">
          <TopBar />
          <main className="min-w-0 flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-6xl p-4 sm:p-6 lg:p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
