import { AssetPlaceholder } from "./asset-placeholder";

export function TrustLogos({
  label = "Trusted by event teams everywhere",
  count = 6,
}: {
  label?: string;
  count?: number;
}) {
  return (
    <section className="border-y border-border bg-card/40 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl text-center">
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </div>
        <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {Array.from({ length: count }).map((_, index) => (
            <AssetPlaceholder
              key={index}
              label="Logo: client, venue, or partner brand mark (optional)"
              className="min-h-[64px] px-2 py-3 text-[10px]"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
