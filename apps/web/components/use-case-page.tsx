import Link from "next/link";
import { Play, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicHeader } from "@/components/public-header";
import { SiteFooter } from "@/components/site-footer";
import { AssetPlaceholder } from "@/components/marketing/asset-placeholder";
import { FeatureHighlight } from "@/components/marketing/feature-highlight";
import { HowItWorksFlow } from "@/components/marketing/how-it-works-flow";
import { AllYouNeedGrid } from "@/components/marketing/all-you-need-grid";
import { HighlightBanner } from "@/components/marketing/highlight-banner";
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

  const howItWorksSteps = [
    {
      title: `Create your ${labelLower} gallery`,
      description: useCase.howItWorks[0]?.text ?? useCase.description,
      imageLabel: `Screenshot: ${labelLower} gallery creation form (name, date, cover)`,
    },
    {
      title: "Share it with your guests",
      description:
        useCase.howItWorks[1]?.text ??
        "Guests join by scanning a QR code or opening a link — no app, no sign-up.",
      bullets: [
        "Share a link through email, SMS, or chat apps",
        "Share a QR code on printed cards or signs",
        "No app downloads, no registrations needed",
      ],
      imageLabel: `Photo: printed ${labelLower} card + QR code`,
    },
    {
      title: "Display it on a live slideshow",
      optionalLabel: "Optional",
      description: `Show the gallery on a screen at your ${labelLower} — new uploads appear automatically as guests add them.`,
      note: { label: "See real examples from other hosts", href: "/stories" },
      imageType: "video" as const,
      imageLabel: `Photo/video: TV screen showing a live photo wall at a ${labelLower}`,
    },
    {
      title: "Enjoy all captured moments",
      description:
        useCase.howItWorks[3]?.text ??
        "Every guest moment is captured in one shared album, organized and ready to relive.",
      bullets: [
        "Every moment is captured in one shared gallery",
        "Download everything in a single click, in original quality",
      ],
      cta: { label: `Create your ${labelLower} event`, href: "/dashboard" },
      imageLabel: `Screenshot: finished ${labelLower} gallery with guest uploads`,
    },
  ];

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

            <div className="mt-8 flex items-center gap-3">
              <div className="flex -space-x-3" aria-hidden="true">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-8 w-8 rounded-full border-2 border-dashed border-border bg-muted/60"
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="flex text-primary">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </span>
                Loved by hosts everywhere
              </div>
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

        <HighlightBanner
          heading={`${useCase.navLabel} You'll Never Forget`}
          bullets={[
            "Live slideshow that updates in real time",
            "Every moment captured in a beautiful digital album",
            "No app required for guests",
          ]}
          cta={{ label: `Create your ${labelLower} event`, href: "/dashboard" }}
          secondaryCta={{ label: "See it in action", href: "/stories" }}
          mediaLabel={`Photo/video: guests using the live slideshow at a real ${labelLower}`}
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
          heading={`Hear it from ${labelLower} hosts like you`}
          subtext={`Rated 4.9/5 by hosts who've used it for their ${labelLower}.`}
          readMore={{ label: "Read reviews", href: "/stories" }}
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
