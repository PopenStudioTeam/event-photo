import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PublicHeader } from "@/components/public-header";
import { SiteFooter } from "@/components/site-footer";
import { SwitchHero } from "@/components/switch-hero";
import { AllYouNeedGrid } from "@/components/marketing/all-you-need-grid";
import { HowItWorksFlow } from "@/components/marketing/how-it-works-flow";
import { TestimonialsRow } from "@/components/marketing/testimonials-row";
import { FaqSplit } from "@/components/marketing/faq-split";
import { defaultTestimonials, organizationFeatures } from "@/lib/marketing-content";

export const metadata: Metadata = {
  title: "Switch to Event Photo — Event Photo",
  description:
    "Moving from another guest photo-sharing app? See how easy it is to switch to Event Photo.",
};

const switchSteps = [
  {
    title: "Create your event",
    description:
      "Set up your gallery in a couple of minutes — no need to wait for your old app's plan to run out first.",
    imageLabel: "Screenshot: event creation form (name, date, cover)",
  },
  {
    title: "Share your digital album",
    description:
      "Guests join by scanning a QR code or opening a link — no app, no sign-up, and no waiting at the door.",
    bullets: [
      "QR code on cards, signage, or slides",
      "Direct link shared over email or chat",
      "No app downloads, no registrations needed",
    ],
    imageLabel: "Photo: QR code signage + phone mockup",
  },
  {
    title: "Display it on a live photo wall",
    optionalLabel: "Optional",
    description:
      "Show the gallery on a screen at your event — new uploads appear automatically as guests add them.",
    note: { label: "See real examples from other hosts", href: "/stories" },
    imageType: "video" as const,
    imageLabel: "Photo/video: TV screen showing a live photo wall at an event",
    cta: { label: "Create your event", href: "/dashboard" },
  },
];

const switchFaqs = [
  {
    question: "Why switch to Event Photo?",
    answer:
      "If your current app is shutting down, raising its prices, or just feels more complicated than it needs to be, Event Photo covers the same core idea — QR code, guest uploads, live slideshow — with one-time pricing instead of a subscription.",
  },
  {
    question: "Does Event Photo offer the same functionality?",
    answer:
      "Yes — guest uploads with no app required, a shared digital album, a live slideshow, captions, and moderation are all included, matching what most guest photo-sharing apps offer.",
  },
  {
    question: "Is Event Photo free?",
    answer:
      "Yes, there's a free plan with a smaller media limit. Premium and Pro unlock more storage and features for a one-time fee per event.",
  },
  {
    question: "Do I or my guests need to download an app?",
    answer:
      "No. Guests open a link or scan a QR code in their phone's browser — nothing to install on either side.",
  },
  {
    question: "Can I bring over photos I already collected elsewhere?",
    answer:
      "There's no automatic import today, but you can upload existing photos into your new gallery yourself the same way a guest would.",
  },
  {
    question: "What if my old app shuts down before I finish my event?",
    answer:
      "Create your Event Photo gallery ahead of time and start sharing the new QR code or link with guests — the switch takes a couple of minutes.",
  },
];

export default function SwitchPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground">
      <PublicHeader />

      <main>
        <SwitchHero />

        <AllYouNeedGrid
          heading="Switching has never been easier"
          subtext="Everything you'd expect from a guest photo-sharing app — nothing you don't."
          items={organizationFeatures}
        />

        <HowItWorksFlow
          heading="How Event Photo works"
          subtext="From setup to the final download, here's the whole flow."
          steps={switchSteps}
        />

        <TestimonialsRow
          heading="People who've made the switch"
          subtext="Rated by hosts who moved from another app."
          readMore={{ label: "Read reviews", href: "/stories" }}
          testimonials={defaultTestimonials}
        />

        <FaqSplit
          heading="Frequently asked questions"
          note="Still deciding whether to switch? Reach out through the chat bubble in the corner."
          faqs={switchFaqs}
        />

        <section className="px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
          <div className="mx-auto max-w-7xl rounded-[2.5rem] bg-brand-deep-navy px-6 py-14 text-center text-brand-off-white sm:px-10 sm:py-20">
            <h2 className="text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
              Make the switch in about 2 minutes.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-brand-off-white/55 sm:text-base">
              Create your gallery, share the new QR code, and let the
              memories come to you.
            </p>
            <Link href="/dashboard" className="mt-8 inline-block">
              <Button
                size="lg"
                className="rounded-full bg-primary px-7 text-primary-foreground hover:bg-[var(--primary-hover)]"
              >
                Create your event
                <span className="ml-2">↗</span>
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
