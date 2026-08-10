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
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_oklch(0.55_0.01_280)_0%,_oklch(0.32_0.015_280)_45%,_oklch(0.22_0.01_280)_100%)] text-foreground dark:bg-[radial-gradient(ellipse_at_top,_oklch(0.28_0.02_280)_0%,_oklch(0.18_0.015_280)_55%,_oklch(0.14_0.01_280)_100%)]">
      {children}
    </div>
  );
}
