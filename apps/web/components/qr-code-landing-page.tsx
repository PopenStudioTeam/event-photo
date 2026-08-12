import Link from "next/link";
import { Play, Star, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicHeader } from "@/components/public-header";
import { SiteFooter } from "@/components/site-footer";
import { AssetPlaceholder } from "@/components/marketing/asset-placeholder";
import { ProcessStepsStrip, type ProcessStep } from "@/components/marketing/process-steps-strip";
import { FeatureHighlight, type HighlightFeature } from "@/components/marketing/feature-highlight";
import { HowItWorksFlow, type HowItWorksStep } from "@/components/marketing/how-it-works-flow";
import { AllYouNeedGrid, type AllYouNeedItem } from "@/components/marketing/all-you-need-grid";
import { ReasonsList, type Reason } from "@/components/marketing/reasons-list";
import { ComparisonList } from "@/components/marketing/comparison-list";
import { TestimonialsRow, type Testimonial } from "@/components/marketing/testimonials-row";
import { FaqSplit, type Faq } from "@/components/marketing/faq-split";
import { StatTestimonialBanner } from "@/components/marketing/stat-testimonial-banner";

export type QrCodeLandingPageProps = {
  headline: string;
  subheadline: string;
  heroImageLabel: string;
  processSteps: ProcessStep[];
  featuresHeading: string;
  featuresSubtext: string;
  features: HighlightFeature[];
  featuresMockupLabel: string;
  howItWorksHeading: string;
  howItWorksSubtext: string;
  howItWorksSteps: HowItWorksStep[];
  allYouNeedHeading: string;
  allYouNeedSubtext: string;
  allYouNeedItems: AllYouNeedItem[];
  whyChooseHeading: string;
  whyChooseSubtext: string;
  whyChooseReasons: Reason[];
  whyChooseImageLabel: string;
  whyChooseCta: { label: string; href: string };
  comparisonHeading: string;
  comparisonEmphasis: string;
  comparisonSubtext: string;
  comparisonCollageLabel: string;
  comparisonOursPoints: string[];
  comparisonOthersPoints: string[];
  comparisonCta: { label: string; href: string };
  testimonialsHeading: string;
  testimonialsSubtext: string;
  testimonials: Testimonial[];
  occasionPillsHeading?: string;
  occasionPills?: { icon: LucideIcon; label: string }[];
  faqHeading: string;
  faqNote: string;
  faqs: Faq[];
  statCallout?: {
    quote: string;
    description: string;
    quoteName: string;
    quoteRole: string;
    cta: { label: string; href: string };
    mediaLabels: [string, string];
  };
};

export function QrCodeLandingPage(props: QrCodeLandingPageProps) {
  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground">
      <PublicHeader />

      <main>
        <section className="mx-auto grid max-w-7xl gap-14 px-4 pb-16 pt-16 sm:px-6 sm:pt-24 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8 lg:pb-24">
          <div>
            <h1 className="max-w-xl text-5xl leading-[0.98] sm:text-6xl">
              {props.headline}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              {props.subheadline}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full rounded-full bg-primary px-7 text-primary-foreground hover:bg-[var(--primary-hover)] sm:w-auto"
                >
                  Create your event
                  <span className="ml-2">↗</span>
                </Button>
              </Link>
              <a href="#how-it-works" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full rounded-full border-border bg-card/65 px-7 sm:w-auto"
                >
                  <Play className="mr-2 h-4 w-4 fill-current" />
                  Watch video
                </Button>
              </a>
            </div>

            <div className="mt-8 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex text-primary">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="h-3.5 w-3.5 fill-current" />
                ))}
              </span>
              Loved by hosts everywhere
            </div>
          </div>

          <AssetPlaceholder
            label={props.heroImageLabel}
            className="min-h-[420px]"
          />
        </section>

        <ProcessStepsStrip steps={props.processSteps} />

        <FeatureHighlight
          heading={props.featuresHeading}
          subtext={props.featuresSubtext}
          features={props.features}
          mockupLabel={props.featuresMockupLabel}
        />

        <HowItWorksFlow
          heading={props.howItWorksHeading}
          subtext={props.howItWorksSubtext}
          steps={props.howItWorksSteps}
        />

        <AllYouNeedGrid
          heading={props.allYouNeedHeading}
          subtext={props.allYouNeedSubtext}
          items={props.allYouNeedItems}
        />

        <ReasonsList
          heading={props.whyChooseHeading}
          subtext={props.whyChooseSubtext}
          reasons={props.whyChooseReasons}
          imageLabel={props.whyChooseImageLabel}
          cta={props.whyChooseCta}
        />

        <ComparisonList
          heading={props.comparisonHeading}
          emphasis={props.comparisonEmphasis}
          subtext={props.comparisonSubtext}
          collageLabel={props.comparisonCollageLabel}
          oursPoints={props.comparisonOursPoints}
          othersPoints={props.comparisonOthersPoints}
          cta={props.comparisonCta}
        />

        <TestimonialsRow
          heading={props.testimonialsHeading}
          subtext={props.testimonialsSubtext}
          readMore={{ label: "Read reviews", href: "/stories" }}
          testimonials={props.testimonials}
        />

        {props.occasionPills && props.occasionPills.length > 0 && (
          <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
            <h2 className="text-2xl leading-tight sm:text-3xl">
              {props.occasionPillsHeading}
            </h2>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {props.occasionPills.map((pill) => {
                const Icon = pill.icon;

                return (
                  <span
                    key={pill.label}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-foreground transition duration-300 hover:-translate-y-0.5 hover:border-primary/40"
                  >
                    <Icon className="h-3.5 w-3.5 text-primary" strokeWidth={1.75} />
                    {pill.label}
                  </span>
                );
              })}
            </div>
          </section>
        )}

        <FaqSplit
          heading={props.faqHeading}
          note={props.faqNote}
          faqs={props.faqs}
        />

        {props.statCallout && (
          <StatTestimonialBanner
            quote={props.statCallout.quote}
            description={props.statCallout.description}
            quoteName={props.statCallout.quoteName}
            quoteRole={props.statCallout.quoteRole}
            cta={props.statCallout.cta}
            mediaLabels={props.statCallout.mediaLabels}
          />
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
