"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function TopBar() {
  return (
    <header className="flex items-center justify-between gap-3 border-b bg-background px-4 py-3 sm:px-6">
      <div className="min-w-0 truncate font-semibold text-sm sm:text-base">
        Event Photo Admin
      </div>
      <Avatar className="h-8 w-8 shrink-0 sm:h-9 sm:w-9">
        <AvatarFallback>JK</AvatarFallback>
      </Avatar>
    </header>
  );
}
