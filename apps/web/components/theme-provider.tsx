"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ErrorAlertProvider } from "@/components/error-alert-provider";
import { Toaster } from "@/components/ui/toast";

type ThemeProviderProps = {
  children: React.ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Toaster>
        <ErrorAlertProvider>{children}</ErrorAlertProvider>
      </Toaster>
    </NextThemesProvider>
  );
}