"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  Home,
  Images,
  Plus,
  Settings,
  Sparkles,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { apiFetch, reportApiError } from "@/lib/api";
import { getOrganizer } from "@/lib/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NewEventDialog } from "@/components/new-event-dialog";

type EventSummary = {
  id: string;
  name: string;
  slug: string;
  mediaCount?: number;
  createdAt?: string;
};

function extractEventSlug(pathname: string) {
  const match = pathname.match(/^\/events\/([^/]+)/);
  return match?.[1] ?? null;
}

function NavLink({
  href,
  label,
  icon: Icon,
  active,
  compact = false,
}: {
  href: string;
  label: string;
  icon: typeof Home;
  active: boolean;
  compact?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center transition-all duration-200",
        compact
          ? "flex-col gap-1 rounded-2xl px-3 py-2 text-[11px]"
          : "gap-3 rounded-xl px-3 py-2.5 text-sm",
        active
          ? compact
            ? "bg-primary/10 font-medium text-primary"
            : "border-l-2 border-primary bg-primary/10 font-medium text-primary"
          : compact
            ? "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
      )}
    >
      <Icon className={cn(compact ? "h-5 w-5" : "h-4 w-4 shrink-0")} />
      <span className={cn(compact ? "leading-none" : "font-medium")}>{label}</span>
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const eventSlug = extractEventSlug(pathname);
  const inEventContext = Boolean(eventSlug && eventSlug !== "new");

  const [events, setEvents] = useState<EventSummary[]>([]);
  const [newEventOpen, setNewEventOpen] = useState(false);
  const organizer = getOrganizer();

  const currentEvent = useMemo(
    () => events.find((e) => e.slug === eventSlug) ?? null,
    [events, eventSlug]
  );

  useEffect(() => {
    const load = async () => {
      try {
        const data = (await apiFetch("/events")) as EventSummary[];
        setEvents(data);
      } catch (err) {
        reportApiError(err, "Failed to load events");
      }
    };
    load();
  }, [pathname]);

  const eventNav = eventSlug
    ? [
        { href: `/events/${eventSlug}`, label: "Home", icon: Home },
        { href: `/events/${eventSlug}/media`, label: "Photos & Videos", icon: Images },
        { href: `/events/${eventSlug}/settings`, label: "Event Settings", icon: Settings },
      ]
    : [];

  const listNav = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/events", label: "My Events", icon: CalendarDays },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  const navItems = inEventContext ? eventNav : listNav;

  const sidebarInner = (
    <>
      <div className="mb-4 shrink-0 rounded-2xl bg-muted/50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="truncate font-heading text-base font-semibold tracking-tight">
              Event Photo
            </div>
            <div className="text-xs text-muted-foreground">Organizer workspace</div>
          </div>
        </div>
      </div>

      {inEventContext && (
        <div className="mb-4 shrink-0 space-y-2 px-1">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Current Event
            </span>
            <Link
              href="/events"
              className="text-[11px] font-medium text-primary hover:underline"
            >
              View All
            </Link>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex w-full items-center justify-between gap-2 rounded-xl border border-border/70 bg-background px-3 py-2.5 text-left text-sm font-medium hover:bg-muted/50">
              <span className="truncate">
                {currentEvent?.name ?? "Select event"}
              </span>
              <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 rounded-xl">
              {events.map((evt) => (
                <DropdownMenuItem
                  key={evt.id}
                  className="cursor-pointer rounded-lg"
                  onClick={() => router.push(`/events/${evt.slug}`)}
                >
                  {evt.name}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer rounded-lg text-primary"
                onClick={() => setNewEventOpen(true)}
              >
                <Plus className="h-4 w-4" />
                Create new event
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer rounded-lg"
                onClick={() => router.push("/events")}
              >
                View all my events
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            href="/settings"
            className="flex items-center justify-center gap-2 rounded-xl bg-amber-400/90 px-3 py-2.5 text-sm font-semibold text-amber-950 shadow-sm transition hover:bg-amber-400"
          >
            <Star className="h-4 w-4" />
            Upgrade Your Event
          </Link>
        </div>
      )}

      <nav className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto px-1">
        {navItems.map((item) => {
          const isHome = item.href.match(/^\/events\/[^/]+$/) !== null;
          const active = isHome
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <NavLink key={item.href} {...item} active={active} />
          );
        })}
      </nav>

      <div className="mt-4 shrink-0 rounded-2xl border border-dashed border-border/80 bg-muted/30 p-4">
        <div className="text-xs font-medium text-foreground">My Account</div>
        <div className="mt-1 truncate text-xs text-muted-foreground">
          {organizer?.email ?? "Organizer"}
        </div>
      </div>
    </>
  );

  return (
    <>
      <aside className="fixed left-4 top-4 z-30 hidden h-[calc(100dvh-2rem)] w-[17rem] md:flex xl:left-5 xl:top-5 xl:h-[calc(100dvh-2.5rem)] xl:w-72">
        <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/90 p-3 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.1)] backdrop-blur-sm lg:rounded-3xl dark:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.35)]">
          {sidebarInner}
        </div>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-40 px-4 pb-4 pt-2 md:hidden">
        <div className="mx-auto grid max-w-md grid-cols-3 gap-1 rounded-2xl border border-border/70 bg-background/95 p-1.5 shadow-[0_10px_40px_-12px_rgba(15,23,42,0.18)] backdrop-blur-xl">
          {navItems.map((item) => {
            const isEventHome = item.href.match(/^\/events\/[^/]+$/) !== null;
            const active = isEventHome
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <NavLink key={item.href} {...item} compact active={active} />
            );
          })}
        </div>
      </nav>

      <NewEventDialog open={newEventOpen} onOpenChange={setNewEventOpen} />
    </>
  );
}
