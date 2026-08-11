import Link from "next/link";
import { Play, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicHeader } from "@/components/public-header";
import { SiteFooter } from "@/components/site-footer";
import { AssetPlaceholder } from "@/components/marketing/asset-placeholder";
import { FeatureHighlight } from "@/components/marketing/feature-highlight";
import { HowItWorksFlow } from "@/components/marketing/how-it-works-flow";
import { AllYouNeedGrid } from "@/components/marketing/all-you-need-grid";
import { ComparisonList } from "@/components/marketing/comparison-list";
import { TestimonialsRow } from "@/components/marketing/testimonials-row";
import { FaqSplit } from "@/components/marketing/faq-split";
import {
  allYouNeedFeatures,
  defaultFaqs,
  defaultTestimonials,
  highlightIconRotation,
} from "@/lib/marketing-content";
import type { UseCase } from "@/lib/use-cases-data";

export function UseCasePage({ useCase }: { useCase: UseCase }) {
  const Icon = useCase.icon;
  const labelLower = useCase.navLabel.toLowerCase();

  const highlightFeatures = useCase.features.map((feature, index) => ({
    icon: highlightIconRotation[index % highlightIconRotation.length],
    title: feature.title,
    text: feature.text,
  }));

  const howItWorksSteps = useCase.howItWorks.map((step, index) => ({
    title: step.title,
    description: step.text,
    imageLabel: `Screenshot/photo for "${step.title}"`,
    ...(index === useCase.howItWorks.length - 1
      ? { cta: { label: "Create your event", href: "/dashboard" } }
      : {}),
  }));

  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground">
      <PublicHeader />

      <main>
        <section className="mx-auto grid max-w-7xl gap-14 px-4 pb-16 pt-16 sm:px-6 sm:pt-24 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8 lg:pb-24">
          <div>
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
              <Icon className="h-6 w-6" strokeWidth={1.75} />
            </div>

            <h1 className="mt-6 max-w-xl text-5xl leading-[0.98] sm:text-6xl">
              {useCase.headline}
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              {useCase.subheadline}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full rounded-full bg-primary px-7 text-primary-foreground hover:bg-[var(--primary-hover)] sm:w-auto"
                >
                  Get started for free
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
            label={`Photo/video: real ${labelLower} photos in a phone mockup, plus a QR code card`}
            className="min-h-[420px]"
          />
        </section>

        <FeatureHighlight
          heading={`All your ${labelLower} photos. None of the work.`}
          subtext={useCase.description}
          features={highlightFeatures}
          mockupLabel={`Screenshot: shared gallery for a ${labelLower} event`}
        />

        <HowItWorksFlow
          heading={`Hassle-free ${labelLower} photo sharing — for you and your guests.`}
          subtext="From setup to the final download, here's the whole flow."
          steps={howItWorksSteps}
        />

        <AllYouNeedGrid
          heading={`Everything you need for a perfect ${labelLower}`}
          subtext={`${useCase.navLabel} photo sharing with a digital album, live slideshow, QR code templates, and more — it's all here.`}
          items={allYouNeedFeatures}
        />

        <ComparisonList
          heading={`We take ${labelLower} photo sharing`}
          emphasis="seriously"
          subtext="Don't settle for less — ensure a seamless and easy photo experience for you and your guests."
          collageLabel={`Photo collage: guest-uploaded photos from real ${labelLower} events`}
          oursPoints={[
            "Effortless and smooth experience",
            "Beautifully designed digital albums",
            "Fast, live uploads",
            "Unlimited guests & participants",
            "Extensive customization options",
            "Set up and go — pay only for what you use",
          ]}
          othersPoints={[
            "Complex and tedious user interface",
            "Dated design with a generic look",
            "No live slideshow",
            "Limited guests & participants",
            "Limited or no customization",
            "Locked into a monthly plan",
          ]}
          cta={{ label: `Collect your ${labelLower} photos`, href: "/dashboard" }}
        />

        <TestimonialsRow
          heading="Don't just take our word for it"
          subtext={`Hosts who've used it for their ${labelLower}`}
          testimonials={defaultTestimonials}
        />

        <FaqSplit
          heading="Frequently asked questions"
          note={`Still have questions about ${labelLower} photo sharing? Reach out through the chat bubble in the corner.`}
          faqs={defaultFaqs}
        />
      </main>

      <SiteFooter />
    </div>
  );
}
