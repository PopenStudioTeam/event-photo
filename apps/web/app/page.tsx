"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PublicHeader } from "@/components/public-header";
import { SiteFooter } from "@/components/site-footer";
import { useCases } from "@/lib/use-cases-data";

const eventTypes = [
  "Weddings",
  "Birthdays",
  "Parties",
  "Corporate events",
  "Family reunions",
  "Graduations",
];

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

type HowItWorksVisualVariant = "create" | "share" | "contribute" | "relive";

const howItWorksSteps: {
  number: string;
  title: string;
  text: string;
  visual: HowItWorksVisualVariant;
}[] = [
    {
      number: "01",
      title: "Create a gallery",
      text: "Name your event, add a cover, and make the page feel like yours.",
      visual: "create",
    },
    {
      number: "02",
      title: "Share one QR code",
      text: "Print it on a table card, send the link, or display it on a screen.",
      visual: "share",
    },
    {
      number: "03",
      title: "Guests contribute",
      text: "Photos and videos arrive directly from their phones.",
      visual: "contribute",
    },
    {
      number: "04",
      title: "Relive everything",
      text: "Moderate, like, browse, and download the complete collection.",
      visual: "relive",
    },
  ];

const features = [
  {
    number: "01",
    title: "One code for the whole day",
    text: "Put one QR code on your table cards, invitations, screens, or signs. Guests open the experience with their phone camera.",
    accent: "bg-card",
  },
  {
    number: "02",
    title: "The gallery builds itself",
    text: "Photos and videos arrive directly from your guests. No chasing files in group chats and no complicated upload instructions.",
    accent: "bg-card",
  },
  {
    number: "03",
    title: "Keep every perspective",
    text: "Review uploads, let guests like their favorite moments, and download the complete collection in original quality.",
    accent: "bg-secondary",
  },
];

const allYouNeedFeatures = [
  { icon: "🖼️", title: "Digital album", text: "One shared gallery for every photo and video." },
  { icon: "⬇️", title: "One-click download", text: "Grab the full collection in original quality." },
  { icon: "📵", title: "No app required", text: "Guests upload straight from their phone browser." },
  { icon: "🔗", title: "QR code & link", text: "Print it, text it, or display it on a screen." },
  { icon: "📺", title: "Live photo wall", text: "Show uploads on a screen as they arrive." },
  { icon: "🎨", title: "Custom theme", text: "Match the cover and colors to your event." },
  { icon: "💬", title: "Captions & names", text: "Guests can sign and caption what they share." },
  { icon: "🔒", title: "Private & secured", text: "Password-protect the gallery when it matters." },
];

const faqs = [
  {
    question: "Do guests need an app?",
    answer:
      "No. Guests scan the QR code or open the private link in their phone browser.",
  },
  {
    question: "Do guests need an account?",
    answer:
      "No. They enter their name and can upload photos and videos immediately.",
  },
  {
    question: "Can I moderate uploads?",
    answer:
      "Yes. Premium and Pro events can review uploads before they appear in the gallery.",
  },
  {
    question: "Can I protect the event gallery?",
    answer:
      "Yes. Paid plans support password-protected galleries.",
  },
  {
    question: "Is pricing monthly?",
    answer:
      "No. Premium and Pro are one-time payments per event.",
  },
];

function GalleryPreview() {
  return (
    <div className="landing-float relative mx-auto w-full max-w-[590px]">
      <div className="absolute -inset-8 rounded-[4rem] bg-primary/10 blur-3xl" />

      <div className="relative rotate-1 rounded-[2.5rem] border border-border bg-card/75 p-3 shadow-[0_35px_100px_-35px_rgba(15,23,42,0.5)] backdrop-blur-xl sm:p-5">
        <div className="overflow-hidden rounded-[2rem] bg-brand-deep-navy text-brand-off-white">
          <div className="flex items-center justify-between border-b border-brand-off-white/10 px-5 py-4 text-[11px] text-brand-off-white/55">
            <span>eventphoto</span>
            <span className="rounded-full bg-brand-off-white/10 px-3 py-1">
              Private gallery
            </span>
          </div>

          <div className="relative p-4 sm:p-6">
            <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primary/25 blur-3xl" />
            <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />

            <div className="relative overflow-hidden rounded-[1.75rem] bg-primary p-6 text-primary-foreground sm:p-8">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-55">
                The shared album
              </div>

              <div className="mt-12 text-3xl leading-none sm:text-4xl">
                John & Rachel
              </div>

              <div className="mt-2 text-sm opacity-65">
                Wedding memories
              </div>

              <div className="mt-12 flex items-end justify-between">
                <span className="rounded-full bg-black/10 px-3 py-1 text-[10px]">
                  42 uploads
                </span>

                <div className="flex -space-x-2">
                  <span className="h-9 w-9 rounded-full border-2 border-primary bg-brand-deep-navy" />
                  <span className="h-9 w-9 rounded-full border-2 border-primary bg-brand-slate-navy" />
                  <span className="h-9 w-9 rounded-full border-2 border-primary bg-brand-off-white" />
                </div>
              </div>
            </div>

            <div className="relative mt-4 grid grid-cols-3 gap-2">
              {[1, 2, 3].map((item) => (
                <div key={item} className="aspect-[0.85] rounded-2xl bg-brand-slate-navy p-2">
                  <div className="flex h-full items-end rounded-xl bg-black/20 p-2 text-[9px] text-brand-off-white">
                    Guest upload
                  </div>
                </div>
              ))}
            </div>

            <div className="relative mt-4 flex items-center justify-between rounded-2xl border border-brand-off-white/10 bg-brand-off-white/10 px-4 py-3 backdrop-blur">
              <div>
                <div className="text-xs font-medium">Share your memories</div>
                <div className="mt-1 text-[10px] text-brand-off-white/50">
                  No app. No account.
                </div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-lg text-primary-foreground">
                ↗
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-6 -left-2 rounded-2xl border border-border bg-card px-4 py-3 shadow-xl sm:-left-8">
        <div className="text-xs font-bold text-foreground">No app required</div>
        <div className="mt-1 text-[10px] text-muted-foreground">
          Guests upload from their browser
        </div>
      </div>

      <div className="absolute -right-2 top-10 hidden rounded-2xl border border-border bg-card px-4 py-3 shadow-xl sm:block sm:-right-8">
        <div className="text-xs font-bold text-foreground">Original quality</div>
        <div className="mt-1 text-[10px] text-muted-foreground">
          Keep what they captured
        </div>
      </div>
    </div>
  );
}

function HowItWorksVisual({ variant }: { variant: HowItWorksVisualVariant }) {
  if (variant === "create") {
    return (
      <div className="mx-auto max-w-sm rounded-[2rem] border border-border bg-card p-5 shadow-xl">
        <div className="h-24 rounded-2xl bg-primary" />
        <div className="mt-4 h-3 w-2/3 rounded-full bg-foreground" />
        <div className="mt-2 h-2 w-1/3 rounded-full bg-muted" />
        <div className="mt-4 flex gap-2">
          <span className="h-6 w-6 rounded-full bg-primary" />
          <span className="h-6 w-6 rounded-full bg-brand-deep-navy" />
          <span className="h-6 w-6 rounded-full bg-muted-foreground" />
          <span className="h-6 w-6 rounded-full bg-accent" />
        </div>
      </div>
    );
  }

  if (variant === "share") {
    return (
      <div className="mx-auto flex max-w-sm items-center gap-4 rounded-[2rem] border border-border bg-card p-6 shadow-xl">
        <div className="grid h-24 w-24 shrink-0 grid-cols-5 gap-1 rounded-xl bg-brand-deep-navy p-2">
          {Array.from({ length: 25 }).map((_, index) => (
            <span
              key={index}
              className={
                (index * 7) % 3 === 0 ? "bg-brand-off-white" : "bg-transparent"
              }
            />
          ))}
        </div>
        <div>
          <div className="text-sm font-bold text-foreground">Scan to contribute</div>
          <div className="mt-1 text-xs text-muted-foreground">
            One code. Every perspective.
          </div>
          <div className="mt-3 inline-flex rounded-full bg-muted px-3 py-1 text-[10px] text-muted-foreground">
            eventphoto.app/e/rachel-john
          </div>
        </div>
      </div>
    );
  }

  if (variant === "contribute") {
    return (
      <div className="mx-auto grid max-w-sm grid-cols-2 gap-2">
        {[0, 1, 2, 3].map((item) => (
          <div
            key={item}
            className="aspect-square rounded-2xl bg-brand-slate-navy p-2 shadow-lg"
          >
            <div className="flex h-full items-end rounded-xl bg-black/20 p-2 text-[9px] text-brand-off-white">
              Guest upload
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm rounded-[2rem] border border-border bg-card p-5 shadow-xl">
      <div className="grid grid-cols-4 gap-1.5">
        {Array.from({ length: 8 }).map((_, index) => (
          <span
            key={index}
            className={`aspect-square rounded-lg ${index % 2 === 0 ? "bg-primary/40" : "bg-muted"}`}
          />
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between rounded-xl bg-brand-deep-navy px-4 py-3 text-brand-off-white">
        <span className="text-xs font-medium">Download all (128)</span>
        <span className="text-sm">⬇</span>
      </div>
    </div>
  );
}

function formatCount(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  // Dummy data for now — swap for a live /public/stats fetch later.
  const stats = { totalMedia: 12480, totalEvents: 640 };

  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="landing-drift absolute -left-48 -top-48 h-[34rem] w-[34rem] rounded-full bg-primary/20 blur-3xl" />
        <div className="landing-drift absolute -right-48 top-32 h-[34rem] w-[34rem] rounded-full bg-card/60 blur-3xl [animation-delay:2s]" />
        <div className="absolute bottom-0 left-[35%] h-[26rem] w-[26rem] rounded-full bg-accent/60 blur-3xl" />
      </div>

      <PublicHeader />

      <main>
        <section className="mx-auto grid max-w-7xl gap-14 px-4 pb-24 pt-16 sm:px-6 sm:pt-24 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:px-8 lg:pb-32">
          <div className="landing-rise">

            <h1 className="max-w-2xl text-5xl leading-[0.98] sm:text-6xl lg:text-[5.8rem]">
              Let everyone
              <span className="block text-muted-foreground">bring a memory.</span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              One QR code or link for every photo and video your guests
              capture. No app, no account, and no chasing people for files
              afterward.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full rounded-full bg-brand-deep-navy px-7 text-brand-off-white shadow-xl shadow-black/10 hover:opacity-90 sm:w-auto"
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
                  See how it works
                </Button>
              </a>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span>✓ No guest app</span>
              <span>✓ Original-quality files</span>
              <span>✓ One-time event pricing</span>
            </div>
          </div>

          <div className="landing-rise landing-rise-delay-2">
            <GalleryPreview />
          </div>
        </section>

        <section className="border-y border-border bg-card/60">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 sm:py-12 md:grid-cols-3 lg:px-8">
            {processSteps.map((step, index) => (
              <div key={step.number} className="relative flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-deep-navy text-sm font-bold text-brand-off-white">
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

        <section className="overflow-hidden border-b border-border bg-background/70 py-5">
          <div className="landing-marquee flex min-w-max gap-10 text-sm font-medium text-muted-foreground">
            {[...eventTypes, ...eventTypes].map((eventType, index) => (
              <span key={`${eventType}-${index}`} className="flex items-center gap-10">
                {eventType}
                <span className="text-primary">✦</span>
              </span>
            ))}
          </div>
        </section>

        <section
          id="how-it-works"
          className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32"
        >
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
              How it works
            </div>
            <h2 className="mt-5 text-4xl leading-tight sm:text-5xl">
              The gallery your guests build for you.
            </h2>
            <p className="mt-5 text-sm leading-7 text-muted-foreground sm:text-base">
              Your guests already have the best camera in their pocket. Give
              them one easy place to put what they captured.
            </p>
          </div>

          <div className="mt-16 flex flex-col gap-20">
            {howItWorksSteps.map((step, index) => (
              <div
                key={step.number}
                className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                  }`}
              >
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/15 text-xs font-bold text-foreground">
                    {step.number}
                  </div>
                  <h3 className="mt-5 text-2xl sm:text-3xl">{step.title}</h3>
                  <p className="mt-3 max-w-md text-sm leading-7 text-muted-foreground sm:text-base">
                    {step.text}
                  </p>
                </div>

                <HowItWorksVisual variant={step.visual} />
              </div>
            ))}
          </div>
        </section>

        <section
          id="features"
          className="bg-brand-deep-navy px-4 py-24 text-brand-off-white sm:px-6 lg:px-8 lg:py-32"
        >
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-brand-off-white/40">
                  Explore the experience
                </div>
                <h2 className="mt-5 max-w-lg text-4xl leading-tight sm:text-5xl">
                  More than a folder full of photos.
                </h2>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {features.map((feature) => (
                  <div
                    key={feature.number}
                    className={`rounded-[2rem] p-6 text-foreground transition duration-300 hover:-translate-y-1 ${feature.accent}`}
                  >
                    <div className="text-xs font-bold opacity-45">
                      {feature.number}
                    </div>
                    <h3 className="mt-12 text-2xl leading-tight">
                      {feature.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 opacity-70">
                      {feature.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
              All in one place
            </div>
            <h2 className="mt-5 text-4xl leading-tight sm:text-5xl">
              Everything you need for a perfect event.
            </h2>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {allYouNeedFeatures.map((feature) => (
              <div
                key={feature.title}
                className="rounded-[1.75rem] border border-border bg-card/75 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 text-lg">
                  {feature.icon}
                </div>
                <h3 className="mt-5 text-sm font-bold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
              For any occasion
            </div>
            <h2 className="mt-5 text-4xl leading-tight sm:text-5xl">
              Event photo sharing for every celebration.
            </h2>
          </div>


          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {useCases.map((useCase) => (
              <div
                key={useCase.slug}
                className="group relative min-h-[280px] overflow-hidden rounded-[2rem] border border-border bg-card p-6 transition duration-500 hover:-translate-y-2"
              >
                <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-primary/20 blur-2xl transition group-hover:scale-150" />
                <div className="relative flex h-full flex-col justify-between">
                  <div className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
                    {useCase.navLabel}
                  </div>
                  <div>
                    <div className="text-3xl leading-tight text-foreground">{useCase.headline}</div>
                    <Link
                      href={`/for/${useCase.slug}`}
                      className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary opacity-70 transition group-hover:opacity-100"
                    >
                      Learn more
                      <span className="transition group-hover:translate-x-1">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="border-y border-border bg-background/70 px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Simple event pricing
              </div>
              <h2 className="mt-5 max-w-lg text-4xl leading-tight sm:text-5xl">
                Pay once for your event.
              </h2>
              <p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground sm:text-base">
                Start free, then unlock moderation, customization, POV mode,
                and scheduled reveals when you need them.
              </p>
              <Link href="/pricing" className="mt-8 inline-block">
                <Button className="rounded-full px-6">
                  Compare plans →
                </Button>
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["Free", "$0", "Try the basics"],
                ["Premium", "$30", "More control"],
                ["Pro", "$50", "The complete experience"],
              ].map(([name, price, description], index) => (
                <div
                  key={name}
                  className={`rounded-[1.75rem] border p-5 ${index === 1
                    ? "border-brand-deep-navy bg-brand-deep-navy text-brand-off-white"
                    : "border-border bg-card text-foreground"
                    }`}
                >
                  <div className="text-sm font-bold">{name}</div>
                  <div className="mt-7 text-3xl">{price}</div>
                  <div
                    className={`mt-2 text-xs ${index === 1 ? "text-brand-off-white/55" : "text-muted-foreground"
                      }`}
                  >
                    {description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-5xl rounded-[2.75rem] bg-brand-deep-navy px-6 py-16 text-center text-brand-off-white sm:px-10 sm:py-20">
            <h2 className="text-3xl leading-tight sm:text-4xl">
              {formatCount(stats.totalMedia)} moments captured across{" "}
              {formatCount(stats.totalEvents)} events.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-brand-off-white/55">
              From intimate birthdays to weddings with hundreds of guests —
              built for whatever you&apos;re celebrating.
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

        <section className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="text-center">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Good to know
            </div>
            <h2 className="mt-5 text-4xl sm:text-5xl">Questions, answered.</h2>
          </div>

          <div className="mt-10 divide-y divide-border border-y border-border">
            {faqs.map((faq, index) => {
              const open = openFaq === index;

              return (
                <div key={faq.question}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : index)}
                    className="flex w-full items-center justify-between gap-5 py-5 text-left"
                  >
                    <span className="text-sm font-bold text-foreground sm:text-base">
                      {faq.question}
                    </span>
                    <span className="text-xl text-muted-foreground">
                      {open ? "−" : "+"}
                    </span>
                  </button>

                  {open && (
                    <div className="pb-5 pr-8 text-sm leading-6 text-muted-foreground">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section className="px-4 pb-24 sm:px-6 lg:px-8 lg:pb-32">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.75rem] bg-brand-deep-navy px-6 py-16 text-center text-brand-off-white sm:px-10 sm:py-24">
            <div className="landing-rise mx-auto max-w-2xl">
              <h2 className="text-4xl leading-tight sm:text-6xl">
                Your event only happens once.
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-brand-off-white/55 sm:text-base">
                Make it easy for everyone to add their part of the story.
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
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
