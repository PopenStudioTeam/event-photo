import Link from "next/link";
import { Camera, MessageSquare, MonitorPlay, Play, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicHeader } from "@/components/public-header";
import { SiteFooter } from "@/components/site-footer";
import { AssetPlaceholder } from "@/components/marketing/asset-placeholder";
import { CountUp } from "@/components/marketing/count-up";
import { FeatureHighlight } from "@/components/marketing/feature-highlight";
import { HowItWorksFlow } from "@/components/marketing/how-it-works-flow";
import { AllYouNeedGrid } from "@/components/marketing/all-you-need-grid";
import { ComparisonList } from "@/components/marketing/comparison-list";
import { TestimonialsRow } from "@/components/marketing/testimonials-row";
import { FaqSplit } from "@/components/marketing/faq-split";
import { useCases } from "@/lib/use-cases-data";
import {
  allYouNeedFeatures,
  defaultFaqs,
  defaultTestimonials,
} from "@/lib/marketing-content";

const processSteps = [
  {
    number: "1",
    title: "Create your event",
    text: "Set up your gallery in under two minutes.",
  },
  {
    number: "2",
    title: "Share your QR code",
    text: "Print it, send it, or display it on a screen.",
  },
  {
    number: "3",
    title: "Watch memories arrive",
    text: "Every guest upload lands in your gallery instantly.",
  },
];

const highlightFeatures = [
  {
    icon: Camera,
    title: "Guest photos & videos",
    text: "Every guest can upload straight from their gallery or camera roll.",
  },
  {
    icon: Sparkles,
    title: "Extremely easy to use",
    text: "No sign-up, no download — just scan a code and start uploading.",
  },
  {
    icon: MessageSquare,
    title: "Text posts & captions",
    text: "Guests can leave a note or caption alongside what they share.",
  },
  {
    icon: MonitorPlay,
    title: "Live slideshow",
    text: "Show uploads on a screen in real time as your event happens.",
  },
];

const howItWorksSteps = [
  {
    title: "Create your event",
    description:
      "Name your event, add a cover, and make the page feel like yours.",
    imageLabel: "Screenshot: event creation form (name, date, cover)",
  },
  {
    title: "Share it with your guests",
    description:
      "Guests can easily join or send photos and videos to your digital gallery by scanning the unique QR code, or using the shared URL — before, during, and after your event.",
    bullets: [
      "Share a link through email, SMS, chat apps",
      "Share a QR code on printed cards or signs",
      "No app downloads, no registrations needed",
    ],
    imageLabel: "Photo: printed table card + QR code",
  },
  {
    title: "Display it all on a live slideshow",
    description:
      "Bring the gallery to life on a screen at your event — new uploads appear automatically as guests add them.",
    note: { label: "See real examples from other hosts", href: "/stories" },
    imageLabel: "Photo/video: TV screen showing live photo wall at an event",
  },
  {
    title: "Enjoy all captured moments",
    description:
      "Every guest moment is captured in one shared album, organized and ready to relive.",
    bullets: [
      "Every moment is captured in one shared gallery",
      "Download everything in a single click, in original quality",
    ],
    cta: { label: "Create your event", href: "/dashboard" },
    imageLabel: "Screenshot: finished gallery with guest uploads",
  },
];


const homeUseCases = useCases.filter((useCase) =>
  ["weddings", "parties", "birthdays", "conferences", "corporate", "business"].includes(
    useCase.slug
  )
);

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground">
      <PublicHeader />

      <main>
        <section className="mx-auto grid max-w-7xl gap-14 px-4 pb-24 pt-16 sm:px-6 sm:pt-24 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8 lg:pb-32">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs text-muted-foreground">
              <span className="flex text-primary">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="h-3.5 w-3.5 fill-current" />
                ))}
              </span>
              Loved by hosts everywhere
            </div>

            <h1 className="mt-6 max-w-2xl text-5xl leading-[0.98] sm:text-6xl lg:text-[5.2rem]">
              Easily collect photos from every guest at your event.
            </h1>

            <p className="mt-7 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              Gather every photo and video from your guests into a stunning
              digital album, ready to share in a live slideshow — no apps,
              no hassle, so simple even grandma will use it.
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
                  Watch how it works
                </Button>
              </a>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span>✓ No guest app</span>
              <span>✓ Original-quality files</span>
              <span>✓ One-time event pricing</span>
            </div>
          </div>

          <AssetPlaceholder
            label="Photo/video: phone mockup showing the guest upload screen with real event photos, plus a QR code card"
            className="min-h-[480px]"
          />
        </section>

        <section className="border-y border-border bg-card/60">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 sm:py-12 md:grid-cols-3 lg:px-8">
            {processSteps.map((step, index) => (
              <div key={step.number} className="relative flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {step.number}
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground">{step.title}</div>
                  <div className="mt-1 text-xs leading-5 text-muted-foreground">
                    {step.text}
                  </div>
                </div>
                {index < processSteps.length - 1 && (
                  <span className="absolute -right-4 top-5 hidden text-muted-foreground/50 md:block">
                    ···
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        <FeatureHighlight
          heading="Event photo sharing made easy"
          subtext="Collect & share photos and videos with your guests in a breeze — setup is a breeze, and sharing is even easier."
          features={highlightFeatures}
          mockupLabel="Screenshot: shared gallery view with a grid of guest uploads"
        />

        <HowItWorksFlow
          heading="Hassle-free for you and your guests."
          subtext="From setup to the final download, here's the whole flow."
          steps={howItWorksSteps}
        />

        <AllYouNeedGrid
          heading="All you need for a perfect event"
          subtext="From digital albums to QR code templates — we've got it all covered."
          items={allYouNeedFeatures}
        />

        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
              For any occasion
            </div>
            <h2 className="mt-4 text-3xl leading-tight sm:text-4xl">
              Event photo sharing for any occasion
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
              From intimate weddings to grand conferences, we&apos;ve got
              every moment covered.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {homeUseCases.map((useCase) => {
              const Icon = useCase.icon;

              return (
                <div
                  key={useCase.slug}
                  className="group relative min-h-[220px] overflow-hidden rounded-[2rem] border border-border bg-card p-6 transition duration-500 hover:-translate-y-2"
                >
                  <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-primary/20 blur-2xl transition group-hover:scale-150" />
                  <div className="relative flex h-full flex-col justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                      <Icon className="h-5 w-5" strokeWidth={1.75} />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-foreground">
                        {useCase.navLabel}
                      </div>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        {useCase.subheadline}
                      </p>
                      <Link
                        href={`/for/${useCase.slug}`}
                        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary opacity-80 transition group-hover:opacity-100"
                      >
                        Learn more
                        <span className="transition group-hover:translate-x-1">→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-5xl rounded-[2.75rem] bg-brand-deep-navy px-6 py-16 text-center text-brand-off-white sm:px-10 sm:py-20">
            <h2 className="text-3xl leading-tight sm:text-4xl">
              <CountUp value={42006007} /> moments snapped &amp; shared by{" "}
              <CountUp value={1444522} /> unforgettable events
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-brand-off-white/55">
              From tiny backyard parties to intimate weddings — every moment,
              captured.
            </p>

            <AssetPlaceholder
              type="image"
              label="Logos: recognizable brands/venues that have used the product (optional, for social proof)"
              className="mx-auto mt-8 max-w-2xl border-brand-off-white/20 bg-brand-off-white/5"
            />

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="rounded-full bg-primary px-7 text-primary-foreground hover:bg-[var(--primary-hover)]"
                >
                  Create your event
                  <span className="ml-2">↗</span>
                </Button>
              </Link>
              <Link
                href="/pricing"
                className="text-sm font-medium text-brand-off-white/70 hover:text-brand-off-white"
              >
                More photos &amp; pricing →
              </Link>
            </div>
          </div>
        </section>

        <TestimonialsRow
          heading="Don't just take our word for it"
          subtext="Trusted by thousands of hosts worldwide"
          testimonials={defaultTestimonials}
        />

        <ComparisonList
          heading="We take event photo sharing"
          emphasis="seriously"
          subtext="Don't settle for less — ensure a seamless and easy photo experience for you and your guests."
          collageLabel="Photo collage: mix of guest-uploaded event photos"
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
          cta={{ label: "Create your event", href: "/dashboard" }}
        />

        <FaqSplit
          heading="Questions?"
          note="Everything you need to know about the product. Can't find the answer you're looking for? Reach out through the chat bubble in the corner."
          faqs={defaultFaqs}
        />
      </main>

      <SiteFooter />
    </div>
  );
}
