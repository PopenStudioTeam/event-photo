import { PublicHeader } from "@/components/public-header";
import { SiteFooter } from "@/components/site-footer";
import { AssetPlaceholder } from "@/components/marketing/asset-placeholder";
import { renderLegalText } from "./legal-inline-text";

export type PolicyBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "badge"; label: string };

export function PolicyStatementPage({
  title,
  subtext,
  content,
  signatureName,
  signatureEmail,
}: {
  title: string;
  subtext?: string;
  content: PolicyBlock[];
  signatureName: string;
  signatureEmail: string;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PublicHeader />

      <main className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="animate-in fade-in slide-in-from-bottom-2 text-4xl leading-tight duration-500 sm:text-5xl">
          {title}
        </h1>
        {subtext && (
          <p className="mt-4 text-sm text-muted-foreground sm:text-base">
            {subtext}
          </p>
        )}

        <div className="mt-10 space-y-6 text-sm leading-7 text-foreground/85 sm:text-base">
          {content.map((block, index) => {
            if (block.type === "list") {
              return (
                <ol key={index} className="space-y-4 text-left">
                  {block.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex gap-2">
                      <span className="font-semibold text-primary">
                        {itemIndex + 1}.
                      </span>
                      <span>{renderLegalText(item)}</span>
                    </li>
                  ))}
                </ol>
              );
            }

            if (block.type === "badge") {
              return (
                <AssetPlaceholder
                  key={index}
                  label={block.label}
                  className="mx-auto h-32 w-32 min-h-0 shrink-0 rounded-full"
                />
              );
            }

            return <p key={index}>{renderLegalText(block.text)}</p>;
          })}
        </div>

        <div className="mt-10 flex items-center justify-center gap-3">
          <div className="flex -space-x-3" aria-hidden="true">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-9 w-9 rounded-full border-2 border-dashed border-border bg-muted/60 transition-transform duration-300 hover:scale-110"
              />
            ))}
          </div>
          <div className="text-sm text-muted-foreground">
            {signatureName} - {signatureEmail}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
