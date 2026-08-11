"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCases } from "@/lib/use-cases-data";

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
  const [useCasesOpen, setUseCasesOpen] = useState(false);
  const [mobileUseCasesOpen, setMobileUseCasesOpen] = useState(false);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const closeMobileMenu = () => {
    setMobileOpen(false);
    setMobileUseCasesOpen(false);
  };

  const openUseCases = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setUseCasesOpen(true);
  };

  const scheduleCloseUseCases = () => {
    closeTimeout.current = setTimeout(() => setUseCasesOpen(false), 150);
  };

  const useCasesActive = isActivePath(pathname, "/for");
  const [homeLink, ...otherLinks] = navigation;
  const homeActive = isActivePath(pathname, homeLink.href);

  return (
    <header className="relative z-50 border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          onClick={closeMobileMenu}
          className="group flex items-center gap-3"
          aria-label="Event Photo home"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-deep-navy text-xl text-brand-off-white shadow-sm transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
            e
          </div>

          <div className="leading-tight">
            <div className="text-base font-bold tracking-tight text-foreground">
              Event Photo
            </div>
            <div className="text-[10px] text-muted-foreground">
              Every moment, together
            </div>
          </div>
        </Link>

        {/* Desktop navigation */}
        <nav
          aria-label="Public navigation"
          className="hidden items-center gap-8 md:flex"
        >
          <Link
            href={homeLink.href}
            aria-current={homeActive ? "page" : undefined}
            className={cn(
              "relative py-2 text-sm transition-colors",
              homeActive
                ? "font-bold text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {homeLink.label}
            <span
              className={cn(
                "absolute bottom-0 left-0 h-0.5 rounded-full bg-primary transition-all duration-300",
                homeActive ? "w-full" : "w-0"
              )}
            />
          </Link>

          <div
            className="relative"
            onMouseEnter={openUseCases}
            onMouseLeave={scheduleCloseUseCases}
          >
            <button
              type="button"
              onClick={() => setUseCasesOpen((open) => !open)}
              aria-expanded={useCasesOpen}
              className={cn(
                "relative flex items-center gap-1.5 py-2 text-sm transition-colors",
                useCasesActive
                  ? "font-bold text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Use cases
              <span
                className={cn(
                  "text-[10px] transition-transform",
                  useCasesOpen && "rotate-180"
                )}
              >
                ▾
              </span>
              <span
                className={cn(
                  "absolute bottom-0 left-0 h-0.5 rounded-full bg-primary transition-all duration-300",
                  useCasesActive ? "w-full" : "w-0"
                )}
              />
            </button>

            {useCasesOpen && (
              <div className="absolute left-1/2 top-full grid w-[26rem] -translate-x-1/2 grid-cols-2 gap-1 rounded-2xl border border-border bg-popover p-3 shadow-xl">
                {useCases.map((useCase) => (
                  <Link
                    key={useCase.slug}
                    href={`/for/${useCase.slug}`}
                    onClick={() => setUseCasesOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition hover:bg-accent hover:text-foreground"
                  >
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: useCase.accent }}
                    />
                    {useCase.navLabel}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {otherLinks.map((item) => {
            const active = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative py-2 text-sm transition-colors",
                  active
                    ? "font-bold text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "absolute bottom-0 left-0 h-0.5 rounded-full bg-primary transition-all duration-300",
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
              className="rounded-full px-4 text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              Log in
            </Button>
          </Link>

          <Link href="/login">
            <Button
              size="sm"
              className="rounded-full bg-brand-deep-navy px-4 text-brand-off-white shadow-sm hover:opacity-90"
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
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/70 text-foreground transition hover:bg-accent md:hidden"
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
          <div className="border-t border-border bg-popover/95 px-4 pb-5 pt-3 shadow-lg backdrop-blur-xl sm:px-6">
            <nav
              aria-label="Mobile public navigation"
              className="flex flex-col gap-1"
            >
              <Link
                href={homeLink.href}
                aria-current={homeActive ? "page" : undefined}
                onClick={closeMobileMenu}
                className={cn(
                  "flex items-center justify-between rounded-2xl px-4 py-3 text-sm transition",
                  homeActive
                    ? "bg-primary/10 font-bold text-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <span>{homeLink.label}</span>
                <span
                  className={cn(
                    "text-lg transition-transform",
                    homeActive
                      ? "translate-x-0 text-primary"
                      : "-translate-x-1 text-muted-foreground/50"
                  )}
                >
                  →
                </span>
              </Link>

              <button
                type="button"
                onClick={() => setMobileUseCasesOpen((open) => !open)}
                aria-expanded={mobileUseCasesOpen}
                className={cn(
                  "flex items-center justify-between rounded-2xl px-4 py-3 text-sm transition",
                  useCasesActive
                    ? "bg-primary/10 font-bold text-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <span>Use cases</span>
                <span
                  className={cn(
                    "text-xs transition-transform",
                    mobileUseCasesOpen && "rotate-180"
                  )}
                >
                  ▾
                </span>
              </button>

              {mobileUseCasesOpen && (
                <div className="mb-1 grid grid-cols-2 gap-1 px-2">
                  {useCases.map((useCase) => (
                    <Link
                      key={useCase.slug}
                      href={`/for/${useCase.slug}`}
                      onClick={closeMobileMenu}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                    >
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: useCase.accent }}
                      />
                      {useCase.navLabel}
                    </Link>
                  ))}
                </div>
              )}

              {otherLinks.map((item) => {
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
                        ? "bg-primary/10 font-bold text-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    <span>{item.label}</span>
                    <span
                      className={cn(
                        "text-lg transition-transform",
                        active
                          ? "translate-x-0 text-primary"
                          : "-translate-x-1 text-muted-foreground/50"
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
                  className="w-full rounded-full border-border"
                >
                  Log in
                </Button>
              </Link>

              <Link href="/login" onClick={closeMobileMenu}>
                <Button
                  size="sm"
                  className="w-full rounded-full bg-brand-deep-navy text-brand-off-white hover:opacity-90"
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