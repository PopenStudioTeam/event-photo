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
      { label: "How it works", href: "/how-it-works" },
      { label: "Pricing", href: "/pricing" },
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
    title: "Account",
    links: [
      { label: "Log in", href: "/login" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-black/5 bg-white/70 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#262125] text-xl text-white">
                e
              </div>
              <div className="text-base font-bold tracking-tight text-[#262125]">
                Event Photo
              </div>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-neutral-500">
              Every moment, together. Collect photos and videos from your
              guests with one link.
            </p>
          </div>

          {footerGroups.map((group) => (
            <div key={group.title}>
              <div className="text-xs font-bold uppercase tracking-[0.15em] text-neutral-400">
                {group.title}
              </div>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-600 hover:text-[#262125]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-black/5 pt-6 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Event Photo</span>
          <span>Made for the moments you don&apos;t want to miss.</span>
        </div>
      </div>
    </footer>
  );
}