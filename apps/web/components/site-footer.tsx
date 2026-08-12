import Link from "next/link";

type FooterLink = {
  label: string;
  href: string;
};

type FooterGroup = {
  title: string;
  links: FooterLink[];
};

const footerGroups: FooterGroup[] = [
  {
    title: "Product",
    links: [
      { label: "Home", href: "/" },
      { label: "Pricing", href: "/pricing" },
      { label: "Help Center", href: "/help" },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "Host stories", href: "/stories" },
      { label: "Guides", href: "/guides" },
      { label: "Use cases", href: "/for" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Switch to Event Photo", href: "/switch" },
      { label: "Digital wedding guestbook", href: "/digital-wedding-guestbook" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Log in", href: "/login" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background/70 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-deep-navy text-xl text-brand-off-white">
                e
              </div>
              <div className="text-base font-bold tracking-tight text-foreground">
                Event Photo
              </div>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">
              Every moment, together. Collect photos and videos from your
              guests with one link.
            </p>
          </div>

          {footerGroups.map((group) => (
            <div key={group.title}>
              <div className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground/80">
                {group.title}
              </div>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Event Photo</span>
          <span>Made for the moments you don&apos;t want to miss.</span>
        </div>
      </div>
    </footer>
  );
}