import { AssetPlaceholder } from "./asset-placeholder";

export type FeatureImageItem = {
  title: string;
  text: string;
  imageLabel: string;
};

export function FeatureImageGrid({
  heading,
  emphasis,
  subtext,
  items,
}: {
  heading: string;
  emphasis?: string;
  subtext: string;
  items: FeatureImageItem[];
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl leading-tight sm:text-4xl">
          {heading} {emphasis && <span className="text-primary">{emphasis}</span>}
        </h2>
        <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
          {subtext}
        </p>
      </div>

      <div className="mt-14 grid gap-5 sm:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.title}
            className="rounded-[1.75rem] border border-border bg-card p-6"
          >
            <h3 className="text-base font-bold text-foreground">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {item.text}
            </p>
            <AssetPlaceholder label={item.imageLabel} className="mt-5 min-h-[140px]" />
          </div>
        ))}
      </div>
    </section>
  );
}
