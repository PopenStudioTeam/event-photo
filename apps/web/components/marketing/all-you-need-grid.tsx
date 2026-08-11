import type { LucideIcon } from "lucide-react";

export type AllYouNeedItem = {
  icon: LucideIcon;
  title: string;
  text: string;
};

export function AllYouNeedGrid({
  heading,
  subtext,
  items,
}: {
  heading: string;
  subtext: string;
  items: AllYouNeedItem[];
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl leading-tight sm:text-4xl">{heading}</h2>
        <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
          {subtext}
        </p>
      </div>

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-[1.75rem] border border-border bg-card p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <h3 className="mt-5 text-sm font-bold text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                {item.text}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
