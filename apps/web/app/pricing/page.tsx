import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PublicHeader } from "@/components/public-header";
import { SiteFooter } from "@/components/site-footer";
import { FaqSplit } from "@/components/marketing/faq-split";

type Plan = {
  name: string;
  price: string;
  billingNote: string;
  description: string;
  featured?: boolean;
  features: string[];
};

const plans: Plan[] = [
  {
    name: "Free",
    price: "$0",
    billingNote: "No card required",
    description: "A simple way to try shared event galleries.",
    features: [
      "Up to 100 media items",
      "Guest photo and video uploads",
      "Basic event gallery",
      "QR code and private link",
      "Individual downloads",
    ],
  },
  {
    name: "Premium",
    price: "$30",
    billingNote: "One-time fee",
    description: "More control for weddings, parties, and important events.",
    features: [
      "Up to 1,000 media items",
      "Everything in Free",
      "Content moderation",
      "Password-protected gallery",
      "Custom cover and theme",
      "ZIP download",
      "Guest likes",
    ],
  },
  {
    name: "Pro",
    price: "$50",
    billingNote: "One-time fee",
    description: "The complete experience for larger and more interactive events.",
    featured: true,
    features: [
      "Up to 5,000 media items",
      "Everything in Premium",
      "POV disposable-camera mode",
      "Per-guest upload limits",
      "Scheduled gallery reveal",
      "Advanced event customization",
      "Priority access to new features",
    ],
  },
];

const faqs = [
  {
    question: "Is this a monthly subscription?",
    answer:
      "No. Premium and Pro are one-time payments for a single event. There are no monthly subscription charges.",
  },
  {
    question: "Can I use the Free plan for a real event?",
    answer:
      "Yes. The Free plan includes the core gallery and guest upload experience with a smaller media limit.",
  },
  {
    question: "What is the difference between Premium and Pro?",
    answer:
      "Premium adds moderation, password protection, customization, likes, and a larger media limit. Pro adds POV mode, per-guest limits, and scheduled gallery reveals.",
  },
  {
    question: "Do guests have to pay?",
    answer:
      "No. Guests can access the shared event page and upload without creating an account or paying.",
  },
  {
    question: "When do paid features become active?",
    answer:
      "Paid features become active after Stripe confirms the payment through the secure payment webhook.",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground">
      <PublicHeader />

      <main>
        <section className="px-4 pb-10 pt-16 text-center sm:px-6 sm:pt-24 lg:px-8">
          <h1 className="text-5xl leading-tight sm:text-6xl">Pricing</h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            Choose the plan that fits best for your event.
          </p>

          <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4 text-sm text-foreground">
            <span className="font-semibold">✅ Money-back guarantee.</span>{" "}
            If you end up not using it for your event, for whatever reason,
            you&apos;ll get your money back according to our fair refund
            policy.
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8 lg:pb-32">
          <div className="grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className="relative rounded-[2rem] border border-border bg-card p-7 shadow-sm sm:p-8"
              >
                {plan.featured && (
                  <div className="absolute -top-3 right-7 rounded-full bg-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-primary-foreground">
                    🔥 Most popular
                  </div>
                )}

                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-xl font-semibold text-foreground">
                    {plan.name}
                  </h2>
                </div>

                <div className="mt-6 text-5xl font-semibold tracking-tight text-foreground">
                  {plan.price}
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  {plan.billingNote}
                </div>

                <p className="mt-4 min-h-12 text-sm leading-6 text-muted-foreground">
                  {plan.description}
                </p>

                <ul className="mt-6 space-y-3 text-sm text-foreground/85">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-2">
                      <span className="text-emerald-600">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/dashboard" className="mt-8 block">
                  <Button
                    className={`w-full rounded-full ${
                      plan.featured
                        ? "bg-primary text-primary-foreground hover:bg-[var(--primary-hover)]"
                        : ""
                    }`}
                    variant={plan.featured ? "default" : "outline"}
                  >
                    {plan.name === "Free"
                      ? "Start free"
                      : `Choose ${plan.name}`}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </section>

        <FaqSplit
          heading="Frequently asked questions"
          note="Still have a question about pricing? Reach out through the chat bubble in the corner."
          faqs={faqs}
        />

        <section className="px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
          <div className="mx-auto max-w-7xl rounded-[2.5rem] bg-brand-deep-navy px-6 py-14 text-center text-brand-off-white sm:px-10 sm:py-20">
            <h2 className="text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
              Your next event deserves every perspective.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-brand-off-white/55 sm:text-base">
              Create your gallery, share the QR code, and let the memories come
              to you.
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
