"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PublicHeader } from "@/components/public-header";
import { SiteFooter } from "@/components/site-footer";

type Plan = {
  name: string;
  price: string;
  description: string;
  featured?: boolean;
  features: string[];
};

const plans: Plan[] = [
  {
    name: "Free",
    price: "$0",
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
    description: "More control for weddings, parties, and important events.",
    featured: true,
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
    description: "The complete experience for larger and more interactive events.",
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

const comparisonRows = [
  ["Media items", "100", "1,000", "5,000"],
  ["Guest uploads", "Yes", "Yes", "Yes"],
  ["QR code and private link", "Yes", "Yes", "Yes"],
  ["Guest likes", "Yes", "Yes", "Yes"],
  ["Moderation", "—", "Yes", "Yes"],
  ["Password protection", "—", "Yes", "Yes"],
  ["Custom cover and theme", "Basic", "Yes", "Yes"],
  ["ZIP download", "Limited", "Yes", "Yes"],
  ["POV mode", "—", "—", "Yes"],
  ["Per-guest upload limits", "—", "—", "Yes"],
  ["Scheduled gallery reveal", "—", "—", "Yes"],
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
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen overflow-hidden bg-[#fafafa] text-[#171717]">
      <style jsx global>{`
        @keyframes pricing-fade-up {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .pricing-fade-up {
          animation: pricing-fade-up 0.65s cubic-bezier(0.22, 1, 0.36, 1)
            both;
        }

        .pricing-delay-1 {
          animation-delay: 100ms;
        }

        .pricing-delay-2 {
          animation-delay: 180ms;
        }

        .pricing-delay-3 {
          animation-delay: 260ms;
        }

        @media (prefers-reduced-motion: reduce) {
          .pricing-fade-up {
            animation: none;
          }
        }
      `}</style>

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-48 -top-48 h-[36rem] w-[36rem] rounded-full bg-rose-200/35 blur-3xl" />
        <div className="absolute -right-48 top-24 h-[34rem] w-[34rem] rounded-full bg-cyan-200/35 blur-3xl" />
      </div>

      <PublicHeader />

      <main>
        <section className="px-4 pb-14 pt-16 text-center sm:px-6 sm:pt-24 lg:px-8">
          <div className="pricing-fade-up mx-auto max-w-3xl">
            <div className="inline-flex rounded-full border border-black/10 bg-white/70 px-4 py-2 text-xs text-neutral-500 shadow-sm">
              One event. One payment. No subscription.
            </div>

            <h1 className="mt-7 text-5xl font-semibold tracking-[-0.06em] sm:text-7xl">
              Choose how you want to
              <span className="block text-neutral-400">remember it.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-neutral-600 sm:text-lg">
              Start free or unlock more control with a one-time Premium or Pro
              event plan.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="grid gap-4 lg:grid-cols-3">
            {plans.map((plan, index) => (
              <div
                key={plan.name}
                className={`pricing-fade-up pricing-delay-${Math.min(
                  index + 1,
                  3
                )} relative rounded-[2rem] border p-7 sm:p-8 ${
                  plan.featured
                    ? "border-neutral-900 bg-neutral-900 text-white shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]"
                    : "border-black/5 bg-white/75 shadow-sm"
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-7 rounded-full bg-rose-500 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-white">
                    Most popular
                  </div>
                )}

                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-xl font-semibold">{plan.name}</h2>
                  <span
                    className={`text-xs ${
                      plan.featured ? "text-white/50" : "text-neutral-400"
                    }`}
                  >
                    per event
                  </span>
                </div>

                <div className="mt-8 text-5xl font-semibold tracking-tight">
                  {plan.price}
                </div>

                <p
                  className={`mt-4 min-h-12 text-sm leading-6 ${
                    plan.featured ? "text-white/60" : "text-neutral-500"
                  }`}
                >
                  {plan.description}
                </p>

                <Link href="/dashboard" className="mt-8 block">
                  <Button
                    className={`w-full rounded-full ${
                      plan.featured
                        ? "bg-white text-neutral-900 hover:bg-white/90"
                        : ""
                    }`}
                    variant={plan.featured ? "secondary" : "default"}
                  >
                    {plan.name === "Free"
                      ? "Start free"
                      : `Choose ${plan.name}`}
                  </Button>
                </Link>

                <div
                  className={`mt-8 border-t pt-7 ${
                    plan.featured ? "border-white/10" : "border-black/10"
                  }`}
                >
                  <div
                    className={`mb-4 text-xs font-semibold uppercase tracking-[0.15em] ${
                      plan.featured ? "text-white/40" : "text-neutral-400"
                    }`}
                  >
                    Includes
                  </div>

                  <ul
                    className={`space-y-3 text-sm ${
                      plan.featured ? "text-white/75" : "text-neutral-600"
                    }`}
                  >
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex gap-2">
                        <span
                          className={
                            plan.featured
                              ? "text-rose-300"
                              : "text-emerald-600"
                          }
                        >
                          ✓
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="border-y border-black/5 bg-white/60 px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                Compare plans
              </div>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                Pick the right level of control.
              </h2>
            </div>

            <div className="mt-10 overflow-x-auto rounded-[1.75rem] border border-black/5 bg-white shadow-sm">
              <table className="w-full min-w-[700px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b bg-neutral-50">
                    <th className="px-5 py-4 font-medium">Feature</th>
                    <th className="px-5 py-4 font-medium">Free</th>
                    <th className="px-5 py-4 font-medium">Premium</th>
                    <th className="px-5 py-4 font-medium">Pro</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row) => (
                    <tr key={row[0]} className="border-b last:border-0">
                      <td className="px-5 py-4 font-medium text-neutral-800">
                        {row[0]}
                      </td>
                      <td className="px-5 py-4 text-neutral-500">{row[1]}</td>
                      <td className="px-5 py-4 text-neutral-500">{row[2]}</td>
                      <td className="px-5 py-4 text-neutral-500">{row[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="text-center">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
              Frequently asked
            </div>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
              Before you choose.
            </h2>
          </div>

          <div className="mt-10 divide-y divide-black/10 border-y border-black/10">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <div key={faq.question}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-5 py-5 text-left"
                  >
                    <span className="text-sm font-medium sm:text-base">
                      {faq.question}
                    </span>
                    <span className="text-xl text-neutral-400">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="pb-5 pr-8 text-sm leading-6 text-neutral-500">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section className="px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
          <div className="mx-auto max-w-7xl rounded-[2.5rem] bg-[#171717] px-6 py-14 text-center text-white sm:px-10 sm:py-20">
            <h2 className="text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
              Your next event deserves every perspective.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/55 sm:text-base">
              Create your gallery, share the QR code, and let the memories come
              to you.
            </p>
            <Link href="/dashboard" className="mt-8 inline-block">
              <Button
                size="lg"
                className="rounded-full bg-white px-7 text-neutral-900 hover:bg-white/90"
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