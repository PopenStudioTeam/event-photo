"use client";

import { useEffect } from "react";
import { getToken, logoutAndRedirectToLogin } from "@/lib/auth";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!getToken()) {
      logoutAndRedirectToLogin();
    }
  }, []);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_#1e293b_0%,_#0f172a_55%,_#0f172a_100%)] text-foreground">
      {children}
    </div>
  );
}
