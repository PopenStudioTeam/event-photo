"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { CalendarDays, Home, Settings, Sparkles } from "lucide-react";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/events", label: "Events", icon: CalendarDays },
  { href: "/settings", label: "Settings", icon: Settings },
];

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
            : "bg-primary text-primary-foreground shadow-sm"
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

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed left-4 top-4 z-30 hidden h-[calc(100dvh-2rem)] w-[17rem] md:flex xl:left-5 xl:top-5 xl:h-[calc(100dvh-2.5rem)] xl:w-72">
        <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/90 p-3 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.1)] backdrop-blur-sm lg:rounded-3xl dark:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.35)]">
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

          <nav className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto px-1">
            {items.map((item) => (
              <NavLink
                key={item.href}
                {...item}
                active={pathname.startsWith(item.href)}
              />
            ))}
          </nav>

          <div className="mt-4 shrink-0 rounded-2xl border border-dashed border-border/80 bg-muted/30 p-4 text-xs leading-relaxed text-muted-foreground">
            Share your event link or QR code so guests can upload photos without installing an app.
          </div>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 px-4 pb-4 pt-2 md:hidden">
        <div className="mx-auto grid max-w-md grid-cols-3 gap-1 rounded-2xl border border-border/70 bg-background/95 p-1.5 shadow-[0_10px_40px_-12px_rgba(15,23,42,0.18)] backdrop-blur-xl">
          {items.map((item) => (
            <NavLink
              key={item.href}
              {...item}
              compact
              active={pathname.startsWith(item.href)}
            />
          ))}
        </div>
      </nav>
    </>
  );
}
