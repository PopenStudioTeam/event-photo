"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, SignOut } from "@phosphor-icons/react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "../theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  getOrganizer,
  logout,
  organizerInitials,
  type OrganizerUser,
} from "@/lib/auth";

export function TopBar() {
  const router = useRouter();
  const [organizer, setOrganizer] = useState<OrganizerUser | null>(null);

  useEffect(() => {
    setOrganizer(getOrganizer());
  }, []);

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <header className="flex items-center justify-between gap-3 border-b bg-background px-4 py-3 sm:px-6">
      <div className="min-w-0 truncate font-semibold text-sm sm:text-base">
        Event Photo Admin
      </div>
      <div className="flex items-center gap-2 self-end">
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger
            className="rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="Account menu"
          >
            <Avatar className="h-8 w-8 shrink-0 cursor-pointer sm:h-9 sm:w-9">
              <AvatarFallback>
                {organizerInitials(organizer?.email)}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={8} className="min-w-48">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-medium text-foreground">
                    {organizer?.email ?? "Organizer account"}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Manage your profile and session
                  </span>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => router.push("/profile")}
              >
                <User className="size-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                className="cursor-pointer"
                onClick={handleLogout}
              >
                <SignOut className="size-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
