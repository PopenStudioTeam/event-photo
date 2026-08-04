"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"; // shadcn utility
import { Home, CalendarDays, Settings } from "lucide-react"; // optional icons

export function Sidebar() {
  const pathname = usePathname();

  const items = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/events", label: "Events", icon: CalendarDays },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="w-64 border-r bg-background">
      <div className="px-4 py-3 border-b">
        <span className="font-semibold">Event Admin</span>
      </div>
      <nav className="mt-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-sm",
                active ? "bg-muted font-medium" : "text-muted-foreground hover:bg-muted"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}