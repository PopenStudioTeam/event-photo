"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { CaretDown, User, SignOut } from "@phosphor-icons/react";

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
  ORGANIZER_UPDATED_EVENT,
  type OrganizerUser,
} from "@/lib/auth";
import { organizerDisplayName } from "@/lib/event-categories";
import { apiFetch, reportApiError } from "@/lib/api";
import { cn } from "@/lib/utils";

type EventSummary = {
  id: string;
  name: string;
  slug: string;
};

const CURRENT_SLUG_KEY = "eventphoto_current_slug";

function extractEventSlug(pathname: string) {
  const match = pathname.match(/^\/events\/([^/]+)/);
  const slug = match?.[1] ?? null;
  if (!slug || slug === "new") return null;
  return slug;
}

function eventSubpath(pathname: string, slug: string) {
  const rest = pathname.slice(`/events/${slug}`.length);
  if (rest === "/media" || rest.startsWith("/media/")) return "/media";
  if (rest === "/settings" || rest.startsWith("/settings/")) return "/settings";
  return "";
}

const PAGE_META: Record<string, { title: string; description: string }> = {
  "/dashboard": {
    title: "Dashboard",
    description: "Overview of uploads, contributors, and activity",
  },
  "/events": {
    title: "Events",
    description: "Create events, share links, and manage guest uploads",
  },
  "/calendar": {
    title: "Calendar",
    description: "Month view of your events",
  },
  "/settings": {
    title: "Settings",
    description: "Billing, plans, and event upgrades",
  },
  "/profile": {
    title: "Profile",
    description: "Account, subscriptions, and your events",
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
  const [events, setEvents] = useState<EventSummary[]>([]);

  const pageMeta = useMemo(() => getPageMeta(pathname), [pathname]);
  const eventSlug = extractEventSlug(pathname);
  const currentEvent = events.find((event) => event.slug === eventSlug) ?? null;

  useEffect(() => {
    const applyOrganizer = () => setOrganizer(getOrganizer());
    applyOrganizer();
    window.addEventListener(ORGANIZER_UPDATED_EVENT, applyOrganizer);
    return () => window.removeEventListener(ORGANIZER_UPDATED_EVENT, applyOrganizer);
  }, []);

  useEffect(() => {
    if (!eventSlug) {
      setEvents([]);
      return;
    }

    const load = async () => {
      try {
        const data = (await apiFetch("/events")) as EventSummary[];
        setEvents(data);
      } catch (err) {
        reportApiError(err, "Failed to load events");
      }
    };

    load();
  }, [eventSlug]);

  const openEvent = (slug: string) => {
    if (!eventSlug) return;
    localStorage.setItem(CURRENT_SLUG_KEY, slug);
    router.push(`/events/${slug}${eventSubpath(pathname, eventSlug)}`);
  };

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-border/60 bg-background/85 px-3 py-3 backdrop-blur-md sm:px-6 sm:py-4 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Organizer
          </p>
          <h1 className="truncate font-heading text-lg font-semibold tracking-tight sm:text-xl">
            {pageMeta.title}
          </h1>
          {eventSlug && (
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  "mt-1 flex max-w-full items-center gap-1 rounded-lg py-0.5 text-left text-xs font-medium text-primary outline-none md:hidden",
                  "hover:underline focus-visible:ring-2 focus-visible:ring-ring"
                )}
                aria-label="Switch event"
              >
                <span className="truncate">
                  {currentEvent?.name ?? "Select event"}
                </span>
                <CaretDown className="size-3.5 shrink-0" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 rounded-xl md:hidden">
                {events.map((event) => (
                  <DropdownMenuItem
                    key={event.id}
                    className="cursor-pointer rounded-lg"
                    onClick={() => openEvent(event.slug)}
                  >
                    <span className="truncate">{event.name}</span>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer rounded-lg"
                  onClick={() => router.push("/events")}
                >
                  View all events
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <p className="mt-0.5 hidden truncate text-sm text-muted-foreground sm:block">
            {pageMeta.description}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger
              className="rounded-full outline-none ring-offset-background transition-transform hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label="Account menu"
            >
              <Avatar className="h-9 w-9 shrink-0 cursor-pointer border border-border/60 shadow-sm sm:h-10 sm:w-10">
                <AvatarFallback className="bg-muted text-xs font-semibold">
                  {organizerInitials(organizer?.email, organizer?.name)}
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
                        ? organizerDisplayName(organizer.email, organizer.name)
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
