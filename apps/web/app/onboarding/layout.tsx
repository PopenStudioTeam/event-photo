"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_#1e293b_0%,_#0f172a_55%,_#0f172a_100%)] text-foreground">
      {children}
    </div>
  );
}
