"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function TopBar() {
  return (
    <header className="flex items-center justify-between border-b px-4 py-2 bg-background">
      <div className="font-semibold">Event Photo Admin</div>
      <Avatar className="h-8 w-8">
        <AvatarFallback>JK</AvatarFallback>
      </Avatar>
    </header>
  );
}