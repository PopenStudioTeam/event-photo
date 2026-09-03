"use client";

import type { ReactNode } from "react";
import { RedirectIfAuthenticated } from "@/components/redirect-if-authenticated";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <RedirectIfAuthenticated>{children}</RedirectIfAuthenticated>;
}
