import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PublicHeader } from "@/components/public-header";
import { SiteFooter } from "@/components/site-footer";
import { AssetPlaceholder } from "@/components/marketing/asset-placeholder";
import { TrustLogos } from "@/components/marketing/trust-logos";
import { FeatureImageGrid } from "@/components/marketing/feature-image-grid";
import { HowItWorksFlow } from "@/components/marketing/how-it-works-flow";
import { AllYouNeedGrid } from "@/components/marketing/all-you-need-grid";
import { TestimonialsRow } from "@/components/marketing/testimonials-row";
import { FaqSplit } from "@/components/marketing/faq-split";
import {
  defaultFaqs,
  defaultTestimonials,
  organizationFeatures,
} from "@/lib/marketing-content";
import type { UseCase } from "@/lib/use-cases-data";

export function OrganizationUseCasePage({ useCase }: { useCase: UseCase }) {
  const Icon = useCase.icon;
  const labelLower = useCase.navLabel.toLowerCase();

  const whyFeatures = [
    {
      title: "Increase your brand visibility",
      text: `Display your gallery on screens or a live photo wall, with your logo, colors, and sponsors built right into the ${labelLower}.`,
      imageLabel: `Photo: branded live photo wall at a ${labelLower}`,
    },
    {
      title: "Engage your attendees",
      text: "Let people take part in the moment instead of just watching it — every upload keeps the room engaged.",
      imageLabel: "Photo: attendees uploading photos on their phones",
    },
    {
      title: "Go viral on social",
      text: "Guests can share any photo or video straight to social media, extending your event's reach for free.",
      imageLabel: "Photo/graphic: social share icons over an event photo",
    },
    {
      title: "Get real event content",
      text: "Every angle captured by the people who were actually there, ready to reuse in your own marketing.",
      imageLabel: "Photo collage: guest-uploaded content from a past event",
    },
  ];

  const howItWorksSteps = [
    {
      title: `Create your ${labelLower} gallery`,
      description: useCase.howItWorks[0]?.text ?? useCase.description,
      imageLabel: `Screenshot: ${labelLower} gallery creation form (name, date, cover, branding)`,
    },
    {
      title: "Share your digital album",
      description:
        "Attendees join by scanning a QR code or opening a link — no app, no sign-up, no waiting at the door.",
      bullets: [
        "QR code on badges, signage, or slides",
        "Direct link shared over email or chat",
        "No app downloads, no registrations needed",
      ],
      imageLabel: `Photo: QR code signage + phone mockup for a ${labelLower}`,
    },
    {
      title: "Display it on a live photo wall",
      optionalLabel: "Optional",
      description:
        "Show the gallery on a screen at your event — new uploads appear automatically as attendees add them.",
      note: { label: "See real examples from other hosts", href: "/stories" },
      imageType: "video" as const,
      imageLabel: `Photo/video: TV screen showing a live photo wall at a ${labelLower}`,
      cta: { label: "Create your event", href: "/dashboard" },
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

            <div className="mt-8">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="rounded-full bg-primary px-7 text-primary-foreground hover:bg-[var(--primary-hover)]"
                >
                  Create your event
                  <span className="ml-2">↗</span>
                </Button>
              </Link>
              <div className="mt-3 text-xs text-muted-foreground">
                It&apos;s free and takes about 2 minutes.
              </div>
            </div>
          </div>

          <AssetPlaceholder
            label={`Photo/video: phone, tablet, and TV mockup showing the live gallery for a ${labelLower}`}
            className="min-h-[420px]"
          />
        </section>

        <TrustLogos label="Trusted by event teams everywhere" />

        <FeatureImageGrid
          heading={`Why run your ${labelLower} on`}
          emphasis="Event Photo?"
          subtext="That's your chance to create a unique experience for your attendees and get more value out of every session."
          items={whyFeatures}
        />

        <HowItWorksFlow
          heading={`Hassle-free for you and your ${labelLower} attendees.`}
          subtext="From setup to the final download, here's the whole flow."
          steps={howItWorksSteps}
        />

        <AllYouNeedGrid
          heading={`What makes it great for ${labelLower}?`}
          subtext="Everything you need to run an engaging, well-branded event gallery."
          items={organizationFeatures}
        />

        <TestimonialsRow
          heading="Helping event organizers everywhere"
          subtext={`Teams that run ${labelLower} trust it to capture every moment.`}
          readMore={{ label: "Read reviews", href: "/stories" }}
          testimonials={defaultTestimonials}
        />

        <div className="mx-auto max-w-7xl px-4 pb-8 text-center sm:px-6 lg:px-8">
          <Link href="/dashboard">
            <Button
              size="lg"
              className="rounded-full bg-primary px-7 text-primary-foreground hover:bg-[var(--primary-hover)]"
            >
              Create your event too
              <span className="ml-2">↗</span>
            </Button>
          </Link>
        </div>

        <FaqSplit
          heading="Frequently asked questions"
          note={`Still have questions about running a ${labelLower} gallery? Reach out through the chat bubble in the corner.`}
          faqs={defaultFaqs}
        />
      </main>

      <SiteFooter />
    </div>
  );
}
