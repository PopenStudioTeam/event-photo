"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, CalendarDays, Settings } from "lucide-react";

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
        "flex items-center gap-2 text-sm transition-colors",
        compact
          ? "flex-col gap-1 px-2 py-2 text-[11px]"
          : "px-4 py-2",
        active
          ? compact
            ? "text-foreground font-medium"
            : "bg-muted font-medium"
          : compact
            ? "text-muted-foreground"
            : "text-muted-foreground hover:bg-muted"
      )}
    >
      <Icon className={cn(compact ? "h-5 w-5" : "h-4 w-4")} />
      <span>{label}</span>
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-56 shrink-0 border-r bg-background md:block xl:w-64">
        <div className="border-b px-4 py-3">
          <span className="font-semibold">Event Admin</span>
        </div>
        <nav className="mt-2">
          {items.map((item) => (
            <NavLink
              key={item.href}
              {...item}
              active={pathname.startsWith(item.href)}
            />
          ))}
        </nav>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80 md:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-3">
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
