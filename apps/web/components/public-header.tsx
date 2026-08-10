"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "How it works",
    href: "/how-it-works",
  },
  {
    label: "Stories",
    href: "/stories",
  },
  {
    label: "Pricing",
    href: "/pricing",
  },
  {
    label: "Guides",
    href: "/guides",
  },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function PublicHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  return (
    <header className="relative z-50 border-b border-black/5 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          onClick={closeMobileMenu}
          className="group flex items-center gap-3"
          aria-label="Event Photo home"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#262125] text-xl text-white shadow-sm transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
            e
          </div>

          <div className="leading-tight">
            <div className="text-base font-bold tracking-tight text-[#262125]">
              Event Photo
            </div>
            <div className="text-[10px] text-neutral-500">
              Every moment, together
            </div>
          </div>
        </Link>

        {/* Desktop navigation */}
        <nav
          aria-label="Public navigation"
          className="hidden items-center gap-8 md:flex"
        >
          {navigation.map((item) => {
            const active = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative py-2 text-sm transition-colors",
                  active
                    ? "font-bold text-[#262125]"
                    : "text-neutral-500 hover:text-[#262125]"
                )}
              >
                {item.label}

                <span
                  className={cn(
                    "absolute bottom-0 left-0 h-0.5 rounded-full bg-rose-400 transition-all duration-300",
                    active ? "w-full" : "w-0"
                  )}
                />
              </Link>
            );
          })}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 md:flex">
          <Link href="/login">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full px-4 text-neutral-600 hover:bg-black/5 hover:text-[#262125]"
            >
              Log in
            </Button>
          </Link>

          <Link href="/login">
            <Button
              size="sm"
              className="rounded-full bg-[#262125] px-4 text-white shadow-sm hover:bg-black"
            >
              Create event
              <span className="ml-1.5">↗</span>
            </Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((open) => !open)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/70 text-[#262125] transition hover:bg-white md:hidden"
        >
          <span className="relative flex h-4 w-5 flex-col justify-between">
            <span
              className={cn(
                "h-0.5 w-full rounded-full bg-current transition-transform duration-300",
                mobileOpen && "translate-y-[7px] rotate-45"
              )}
            />
            <span
              className={cn(
                "h-0.5 w-full rounded-full bg-current transition-opacity duration-300",
                mobileOpen && "opacity-0"
              )}
            />
            <span
              className={cn(
                "h-0.5 w-full rounded-full bg-current transition-transform duration-300",
                mobileOpen && "-translate-y-[7px] -rotate-45"
              )}
            />
          </span>
        </button>
      </div>

      {/* Mobile navigation */}
      <div
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-300 md:hidden",
          mobileOpen
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="border-t border-black/5 bg-white/90 px-4 pb-5 pt-3 shadow-lg backdrop-blur-xl sm:px-6">
            <nav
              aria-label="Mobile public navigation"
              className="flex flex-col gap-1"
            >
              {navigation.map((item) => {
                const active = isActivePath(pathname, item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={closeMobileMenu}
                    className={cn(
                      "flex items-center justify-between rounded-2xl px-4 py-3 text-sm transition",
                      active
                        ? "bg-rose-50 font-bold text-[#262125]"
                        : "text-neutral-600 hover:bg-neutral-50 hover:text-[#262125]"
                    )}
                  >
                    <span>{item.label}</span>
                    <span
                      className={cn(
                        "text-lg transition-transform",
                        active ? "translate-x-0 text-rose-400" : "-translate-x-1 text-neutral-300"
                      )}
                    >
                      →
                    </span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link href="/login" onClick={closeMobileMenu}>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full rounded-full border-black/10"
                >
                  Log in
                </Button>
              </Link>

              <Link href="/login" onClick={closeMobileMenu}>
                <Button
                  size="sm"
                  className="w-full rounded-full bg-[#262125] text-white hover:bg-black"
                >
                  Create event
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}