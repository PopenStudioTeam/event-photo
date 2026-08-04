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
    <div className="min-h-screen bg-muted flex items-stretch">
      <Sidebar /> {/* keep as-is or slightly rounded */}
      <div className="flex-1 flex justify-center py-6 px-4 md:px-8">
        <div className="w-full max-w-6xl bg-background rounded-2xl shadow-sm border border-border/60 flex flex-col">
          <TopBar />
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}