import { PublicHeader } from "@/components/public-header";
import { SiteFooter } from "@/components/site-footer";

export type LegalSubsection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type LegalSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  subsections?: LegalSubsection[];
};

export function LegalPageLayout({
  title,
  effectiveDate,
  intro,
  keyPoints,
  sections,
}: {
  title: string;
  effectiveDate: string;
  intro: string[];
  keyPoints?: string[];
  sections: LegalSection[];
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PublicHeader />

      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="animate-in fade-in slide-in-from-bottom-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-5 py-4 text-sm leading-6 text-foreground duration-500">
          <span className="font-semibold">Template notice:</span> this page is
          a structural starting point, not legal advice. Replace every
          bracketed placeholder with your actual company details and data
          practices, and have it reviewed by a lawyer before publishing.
        </div>

        <h1 className="animate-in fade-in slide-in-from-bottom-2 mt-10 text-4xl leading-tight duration-500 sm:text-5xl">
          {title}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This policy is effective as of {effectiveDate}.
        </p>

        <div className="mt-8 space-y-4 text-sm leading-7 text-foreground/85">
          {intro.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {keyPoints && keyPoints.length > 0 && (
          <div className="mt-8 rounded-xl bg-muted/60 p-6">
            <div className="text-sm font-bold text-foreground">
              Key points of this policy
            </div>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
              {keyPoints.map((point, index) => (
                <li key={index} className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-12 space-y-12">
          {sections.map((section, index) => (
            <div key={section.heading}>
              <h2 className="text-xl font-bold text-foreground">
                {index + 1}. {section.heading}
              </h2>

              {section.paragraphs && (
                <div className="mt-3 space-y-3 text-sm leading-7 text-foreground/85">
                  {section.paragraphs.map((paragraph, pIndex) => (
                    <p key={pIndex}>{paragraph}</p>
                  ))}
                </div>
              )}

              {section.bullets && (
                <ul className="mt-3 space-y-2 text-sm leading-6 text-foreground/85">
                  {section.bullets.map((bullet, bIndex) => (
                    <li key={bIndex} className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}

              {section.subsections && (
                <div className="mt-6 space-y-6">
                  {section.subsections.map((sub) => (
                    <div key={sub.heading}>
                      <h3 className="text-sm font-bold text-foreground">
                        {sub.heading}
                      </h3>
                      {sub.paragraphs && (
                        <div className="mt-2 space-y-2 text-sm leading-6 text-foreground/85">
                          {sub.paragraphs.map((paragraph, pIndex) => (
                            <p key={pIndex}>{paragraph}</p>
                          ))}
                        </div>
                      )}
                      {sub.bullets && (
                        <ul className="mt-2 space-y-1.5 text-sm leading-6 text-foreground/85">
                          {sub.bullets.map((bullet, bIndex) => (
                            <li key={bIndex} className="flex gap-2">
                              <span className="text-primary">•</span>
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
