"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/sidebar/organizer-sidebar";
import { TopBar } from "@/components/topbar/topbar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = window.localStorage.getItem("eventphoto_token");
    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted md:flex-row">
      <Sidebar />
      <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col pb-[4.5rem] md:pb-0">
        <div className="flex min-h-screen w-full min-w-0 flex-1 flex-col p-3 sm:p-4 md:min-h-0 md:p-6">
          <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-border/60 bg-background shadow-sm sm:rounded-2xl">
            <TopBar />
            <main className="min-w-0 flex-1 p-3 sm:p-4 md:p-6">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
}
