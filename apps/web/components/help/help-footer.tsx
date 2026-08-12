import Link from "next/link";

export function HelpFooter() {
  return (
    <footer className="border-t border-border bg-muted/30 px-4 py-14 text-center sm:px-6 lg:px-8">
      <div className="text-sm font-medium text-muted-foreground">
        Event Photo Help Center
      </div>
      <div className="mt-4 flex justify-center gap-6 text-sm text-muted-foreground">
        <Link href="/" className="transition hover:text-foreground">
          Home
        </Link>
        <Link href="/dashboard" className="transition hover:text-foreground">
          Dashboard
        </Link>
      </div>
    </footer>
  );
}
