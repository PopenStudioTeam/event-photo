import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PublicHeader } from "@/components/public-header";
import { SiteFooter } from "@/components/site-footer";
import { AssetPlaceholder } from "@/components/marketing/asset-placeholder";
import { TrustLogos } from "@/components/marketing/trust-logos";
import { FaqSplit } from "@/components/marketing/faq-split";
import { BusinessTabs, type BusinessTab } from "@/components/business-tabs";

const businessTabs: BusinessTab[] = [
  {
    label: "Photography",
    heading: "For photographers",
    description:
      "Give clients a modern way to receive their photos. Deliver a branded, shareable digital album instead of a plain download link, and let guests add their own shots alongside your professional work.",
    quote:
      "Our clients love getting a link they can share with their whole guest list, not just a folder of files.",
    quoteName: "Photography studio owner",
    quoteRole: "United States",
  },
  {
    label: "Event Production",
    heading: "For event production teams",
    description:
      "Run a live photo wall as part of the show. Uploads from the crowd appear on screen in real time, giving every event you produce an extra layer of audience interaction.",
    quote:
      "The live wall became part of our standard package — clients ask for it by name now.",
    quoteName: "Event producer",
    quoteRole: "United Kingdom",
  },
  {
    label: "Corporate",
    heading: "For corporate teams",
    description:
      "Set up a branded gallery for every offsite, launch, or company party. Turn on moderation so nothing goes live without approval, then hand the finished album to your internal comms team.",
    quote:
      "We use it for every company event now — it's the easiest way to collect photos from a room of 300 people.",
    quoteName: "Internal events lead",
    quoteRole: "Canada",
  },
  {
    label: "Business Venue",
    heading: "For venues",
    description:
      "Offer galleries as a value-add for every event you host. Each client gets their own branded space, and you get a reusable feature that sets your venue apart.",
    quote:
      "Being able to offer this to every couple and client booking the venue has become a real differentiator.",
    quoteName: "Venue manager",
    quoteRole: "Australia",
  },
  {
    label: "Education",
    heading: "For schools & education",
    description:
      "Collect photos from graduations, school trips, and campus events in one shared album that parents and students can access without downloading anything.",
    quote:
      "Parents finally have one place to find every photo from the whole ceremony.",
    quoteName: "School events coordinator",
    quoteRole: "United States",
  },
  {
    label: "Other",
    heading: "For any recurring event business",
    description:
      "If you run events on a regular basis, a gallery-per-event workflow with your own branding and pricing built in can slot straight into how you already work.",
    quote:
      "It took five minutes to set up our first event, and now it's just part of how we run every one.",
    quoteName: "Business owner",
    quoteRole: "Germany",
  },
];

const professionalFeatures = [
  {
    title: "Custom branding & watermarks",
    text: "Automatically add a text or logo watermark to every upload, so your brand travels with every photo guests share on social.",
    imageLabel: "Screenshot: watermark settings with a logo applied to a sample photo",
  },
  {
    title: "Guest intake forms",
    text: "Collect custom details from guests when they join — names, emails, or consent — and export it whenever you need it.",
    imageLabel: "Screenshot: custom welcome form on the guest upload screen",
  },
  {
    title: "White-label galleries",
    text: "Offer a fully branded experience under your own name, colors, and domain for clients and their guests.",
    imageLabel: "Screenshot: white-labeled gallery dashboard",
  },
];

type BusinessPlan = {
  name: string;
  price: string;
  billingNote: string;
  description: string;
  featured?: boolean;
  cta: { label: string; href: string };
  features: string[];
};

const businessPlans: BusinessPlan[] = [
  {
    name: "Starter",
    price: "$99",
    billingNote: "/month, no hidden fees",
    description: "A simple solution for professionals just getting started.",
    cta: { label: "Get started", href: "/dashboard" },
    features: [
      "Run up to 3 active events per month",
      "Access to all Pro features",
      "Original upload quality & metadata",
    ],
  },
  {
    name: "Growth",
    price: "$149",
    billingNote: "/month, no hidden fees",
    description: "For professionals and businesses running events regularly.",
    cta: { label: "Get started", href: "/dashboard" },
    features: [
      "Everything in Starter, plus:",
      "Run up to 8 active events per month",
      "Automatic photo watermark & branding",
    ],
  },
  {
    name: "Scale",
    price: "$249",
    billingNote: "/month, no hidden fees",
    description: "A fully featured solution for professional agencies.",
    featured: true,
    cta: { label: "Get started", href: "/dashboard" },
    features: [
      "Everything in Growth, plus:",
      "Run up to 20 active events per month",
      "Custom guest intake forms",
      "Lead export",
      "Live photo wall embeds",
    ],
  },
  {
    name: "Custom",
    price: "Let's talk",
    billingNote: "Tailor-made for your scale",
    description: "For agencies and enterprise running events at volume.",
    cta: { label: "Talk to us", href: "/dashboard" },
    features: [
      "Everything in Scale, plus:",
      "Full white-label branding",
      "Custom domain",
      "Dedicated support",
    ],
  },
];

const businessFaqs = [
  {
    question: "Who is the Business plan for?",
    answer:
      "Photographers, event production teams, venues, and any business that runs events for clients on a regular basis.",
  },
  {
    question: "Is it suitable for a yearly ongoing event calendar?",
    answer:
      "Yes. Business plans are billed monthly and sized around how many events you run per month, not a single one-time event.",
  },
  {
    question: "Can I change my plan later?",
    answer:
      "The Business monthly plans on this page are not sold in the app yet. Per-event Premium and Pro cannot be switched in-app after payment; request a Whop refund, then choose again.",
  },
  {
    question: "What counts as an active event?",
    answer:
      "Any gallery you've created that's currently open for guest uploads counts toward your monthly active event limit.",
  },
  {
    question: "What is your cancellation policy?",
    answer: "You can cancel anytime; your plan stays active until the end of the billing period.",
  },
  {
    question: "Do you offer custom solutions?",
    answer:
      "Yes — the Custom plan covers white-labeling, a custom domain, and dedicated support for larger teams.",
  },
  {
    question: "Do you have a white-label solution for businesses?",
    answer: "Yes, available on the Custom plan for agencies and enterprise clients.",
  },
  {
    question: "How does billing work?",
    answer: "Business plans are billed monthly to a card on file, with no long-term contract.",
  },
];

export function BusinessPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground">
      <PublicHeader />

      <main>
        <section className="mx-auto max-w-3xl px-4 pb-14 pt-16 text-center sm:px-6 sm:pt-24 lg:px-8">
          <h1 className="text-5xl leading-tight sm:text-6xl">
            Event Photo for Businesses
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            For professionals and businesses who run events on a regular
            basis. Deliver unforgettable experiences to your clients and
            participants.
          </p>
          <a href="#pricing" className="mt-8 inline-block">
            <Button size="lg" variant="outline" className="rounded-full border-border px-7">
              View pricing plans
            </Button>
          </a>
        </section>

        <TrustLogos label="Trusted by professionals and event teams" />

        <BusinessTabs tabs={businessTabs} />

        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Features
            </div>
            <h2 className="mt-4 text-3xl leading-tight sm:text-4xl">
              Designed for professionals
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
              Powerful features to help you get more out of every event you
              run.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-3">
            {professionalFeatures.map((feature) => (
              <div
                key={feature.title}
                className="rounded-[1.75rem] border border-border bg-card p-6"
              >
                <AssetPlaceholder label={feature.imageLabel} className="min-h-[140px]" />
                <h3 className="mt-5 text-sm font-bold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="pricing" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Pricing
            </div>
            <h2 className="mt-4 text-3xl leading-tight sm:text-4xl">
              Plans that fit your scale
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
              Simple, transparent pricing that grows with you.
            </p>
          </div>

          <div className="mt-14 grid gap-5 lg:grid-cols-4">
            {businessPlans.map((plan) => (
              <div
                key={plan.name}
                className="relative flex flex-col rounded-[2rem] border border-border bg-card p-6"
              >
                {plan.featured && (
                  <div className="absolute -top-3 right-6 rounded-full bg-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-primary-foreground">
                    🔥 Most popular
                  </div>
                )}

                <h3 className="text-base font-semibold text-foreground">
                  {plan.name}
                </h3>
                <p className="mt-2 min-h-10 text-xs leading-5 text-muted-foreground">
                  {plan.description}
                </p>

                <div className="mt-5 text-3xl font-semibold tracking-tight text-foreground">
                  {plan.price}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {plan.billingNote}
                </div>

                <ul className="mt-5 flex-1 space-y-2 text-xs text-foreground/85">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-2">
                      <span className="text-emerald-600">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href={plan.cta.href} className="mt-6 block">
                  <Button
                    className={`w-full rounded-full ${
                      plan.featured
                        ? "bg-primary text-primary-foreground hover:bg-[var(--primary-hover)]"
                        : ""
                    }`}
                    variant={plan.featured ? "default" : "outline"}
                  >
                    {plan.cta.label}
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Prices are in US dollars and do not include taxes.
          </p>
        </section>

        <FaqSplit
          heading="Frequently asked questions"
          note="Everything you need to know about the product and billing."
          faqs={businessFaqs}
        />

        <section className="px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 rounded-[2rem] border border-border bg-card p-8 text-center">
            <div className="flex -space-x-3" aria-hidden="true">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-10 w-10 rounded-full border-2 border-dashed border-border bg-muted/60"
                />
              ))}
            </div>
            <h3 className="text-lg font-bold text-foreground">
              We&apos;re here for you
            </h3>
            <p className="max-w-sm text-sm text-muted-foreground">
              Can&apos;t find the answer you&apos;re looking for? Chat with
              our team using the chat bubble in the corner of the screen.
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
