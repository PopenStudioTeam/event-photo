import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export function HelpCategoryCard({
  slug,
  title,
  description,
  count,
  icon: Icon,
}: {
  slug: string;
  title: string;
  description: string;
  count: number;
  icon: LucideIcon;
}) {
  return (
    <Link
      href={`/help/${slug}`}
      className="group flex items-center gap-5 rounded-xl border border-border bg-card p-6 transition duration-300 hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </div>
      <div className="flex-1">
        <div className="text-base font-bold text-foreground">{title}</div>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        <div className="mt-2 text-xs text-muted-foreground/70">
          {count} article{count === 1 ? "" : "s"}
        </div>
      </div>
      <span className="text-muted-foreground/50 transition group-hover:translate-x-1 group-hover:text-foreground">
        →
      </span>
    </Link>
  );
}
