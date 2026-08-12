import Link from "next/link";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function HelpHero({
  variant = "compact",
  heading,
}: {
  variant?: "home" | "compact";
  heading?: string;
}) {
  return (
    <div className="bg-gradient-to-b from-primary via-[var(--brand-magenta-violet)] to-primary/70 px-4 pb-10 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <Link
          href="/"
          className="text-lg font-extrabold tracking-tight text-primary-foreground"
        >
          Event Photo
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-primary-foreground/90">
          <Link href="/" className="transition hover:text-primary-foreground">
            Home
          </Link>
          <Link
            href="/pricing"
            className="transition hover:text-primary-foreground"
          >
            Pricing
          </Link>
        </nav>
      </div>

      {variant === "home" && heading && (
        <h1 className="mx-auto mt-10 max-w-2xl text-4xl leading-tight text-primary-foreground sm:text-5xl">
          {heading}
        </h1>
      )}

      <div
        className={cn(
          "mx-auto max-w-3xl",
          variant === "home" ? "mt-8" : "mt-6"
        )}
      >
        <div className="flex items-center gap-3 rounded-2xl bg-primary-foreground/15 px-5 py-4 text-primary-foreground/80 backdrop-blur-sm transition focus-within:bg-primary-foreground/25">
          <Search className="h-4 w-4 shrink-0" />
          <input
            type="text"
            placeholder="Search for articles…"
            className="w-full bg-transparent text-sm text-primary-foreground placeholder:text-primary-foreground/70 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
