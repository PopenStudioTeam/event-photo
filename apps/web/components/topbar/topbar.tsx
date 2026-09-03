"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
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
import { organizerDisplayName } from "@/lib/event-categories";

const PAGE_META: Record<string, { title: string; description: string }> = {
  "/dashboard": {
    title: "Dashboard",
    description: "Overview of uploads, contributors, and activity",
  },
  "/events": {
    title: "Events",
    description: "Create events, share links, and manage guest uploads",
  },
  "/settings": {
    title: "Settings",
    description: "Billing, plans, and event upgrades",
  },
  "/profile": {
    title: "Profile",
    description: "Your organizer account details",
  },
};

function getPageMeta(pathname: string) {
  const eventHomeMatch = pathname.match(/^\/events\/([^/]+)$/);
  if (eventHomeMatch) {
    return {
      title: "Event Home",
      description: "Album link, QR code, and photo wall for your event",
    };
  }

  if (pathname.includes("/media")) {
    return {
      title: "Photos & Videos",
      description: "View, download, and moderate guest uploads",
    };
  }

  if (pathname.includes("/settings")) {
    return {
      title: "Event Settings",
      description: "General, appearance, moderation, and more",
    };
  }

  if (pathname.startsWith("/events/") && pathname !== "/events") {
    return {
      title: "Event details",
      description: "Manage QR codes, uploads, and gallery settings",
    };
  }

  for (const [prefix, meta] of Object.entries(PAGE_META)) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      return meta;
    }
  }

  return {
    title: "Organizer",
    description: "Manage your event photo collections",
  };
}

export function TopBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [organizer, setOrganizer] = useState<OrganizerUser | null>(null);

  const pageMeta = useMemo(() => getPageMeta(pathname), [pathname]);

  useEffect(() => {
    setOrganizer(getOrganizer());
  }, []);

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-border/60 bg-background/85 px-4 py-4 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Organizer
          </p>
          <h1 className="truncate font-heading text-lg font-semibold tracking-tight sm:text-xl">
            {pageMeta.title}
          </h1>
          <p className="mt-0.5 hidden truncate text-sm text-muted-foreground sm:block">
            {pageMeta.description}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger
              className="rounded-full outline-none ring-offset-background transition-transform hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label="Account menu"
            >
              <Avatar className="h-9 w-9 shrink-0 cursor-pointer border border-border/60 shadow-sm sm:h-10 sm:w-10">
                <AvatarFallback className="bg-muted text-xs font-semibold">
                  {organizerInitials(organizer?.email)}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={10}
              className="min-w-52 rounded-xl"
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium text-foreground">
                      {organizer
                        ? organizerDisplayName(organizer.email)
                        : "Organizer account"}
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
                  className="cursor-pointer rounded-lg"
                  onClick={() => router.push("/profile")}
                >
                  <User className="size-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  className="cursor-pointer rounded-lg"
                  onClick={handleLogout}
                >
                  <SignOut className="size-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
