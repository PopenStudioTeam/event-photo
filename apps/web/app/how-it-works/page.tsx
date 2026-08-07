"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PublicHeader } from "@/components/public-header";

const steps = [
  {
    number: "01",
    eyebrow: "Start with an event",
    title: "Create a private gallery in minutes.",
    description:
      "Give your event a name, choose the date, upload a cover image, and create a gallery that feels like part of the occasion.",
    details: [
      "Create a unique event link",
      "Generate a QR code automatically",
      "Choose a cover image and layout",
      "Add password protection when needed",
    ],
    tone: "from-rose-300 via-pink-200 to-orange-100",
    visual: "create",
  },
  {
    number: "02",
    eyebrow: "Make it yours",
    title: "Set the mood before guests arrive.",
    description:
      "Customize the guest-facing experience with your event cover, colors, layout, and optional gallery protection.",
    details: [
      "Choose light or dark presentation",
      "Set your primary event color",
      "Use banner or card cover layouts",
      "Add a gradient overlay for readability",
    ],
    tone: "from-amber-200 via-orange-100 to-rose-200",
    visual: "customize",
  },
  {
    number: "03",
    eyebrow: "Share one simple code",
    title: "Put the gallery where guests can see it.",
    description:
      "Share the event link digitally or display the QR code at the venue. Guests can join directly from their phone browser.",
    details: [
      "No guest app required",
      "No guest account required",
      "Works from a private link",
      "Works from printed QR cards",
    ],
    tone: "from-sky-200 via-cyan-100 to-blue-100",
    visual: "share",
  },
  {
    number: "04",
    eyebrow: "Collect every perspective",
    title: "Let guests add what you missed.",
    description:
      "Guests enter their name, select photos or videos, add an optional caption, and upload directly to your event gallery.",
    details: [
      "Upload photos and videos",
      "Add captions to uploads",
      "See upload progress",
      "Use POV mode for limited shots",
    ],
    tone: "from-violet-200 via-fuchsia-100 to-pink-100",
    visual: "upload",
  },
  {
    number: "05",
    eyebrow: "Stay in control",
    title: "Review the gallery before it goes live.",
    description:
      "For events with moderation enabled, uploads wait in a review queue until you approve them.",
    details: [
      "Approve suitable uploads",
      "Reject unwanted uploads",
      "Keep the public gallery clean",
      "Use password protection for private events",
    ],
    tone: "from-emerald-200 via-lime-100 to-yellow-100",
    visual: "moderate",
  },
  {
    number: "06",
    eyebrow: "Keep the memories",
    title: "Download the whole story afterward.",
    description:
      "Browse the event gallery, open individual photos or videos, and download everything in original quality.",
    details: [
      "Download individual media",
      "Download the complete event as a ZIP",
      "Keep guest names and captions",
      "Return to the gallery whenever you need",
    ],
    tone: "from-slate-200 via-blue-100 to-indigo-100",
    visual: "download",
  },
];

const faqs = [
  {
    question: "Do guests need to install anything?",
    answer:
      "No. Guests open the event link or scan the QR code using their phone browser.",
  },
  {
    question: "Can guests see each other’s uploads?",
    answer:
      "Yes, approved uploads appear in the shared gallery. If moderation is enabled, uploads appear after organizer approval.",
  },
  {
    question: "Can I keep the gallery private?",
    answer:
      "Yes. You can use a private event link and password protection on supported plans.",
  },
  {
    question: "Can guests upload videos?",
    answer:
      "Yes. The guest upload flow supports both photos and supported video formats.",
  },
];

function StepVisual({
  type,
  tone,
}: {
  type: string;
  tone: string;
}) {
  if (type === "create") {
    return (
      <div className={`relative h-full min-h-[300px] overflow-hidden bg-gradient-to-br ${tone} p-5`}>
        <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/35 blur-2xl" />
        <div className="relative mx-auto mt-8 max-w-[280px] rotate-[-3deg] rounded-[1.75rem] border border-white/70 bg-white/85 p-4 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              New event
            </span>
            <span className="rounded-full bg-rose-100 px-2 py-1 text-[9px] text-rose-600">
              Draft
            </span>
          </div>

          <div className="mt-7 space-y-3">
            <div>
              <div className="text-[10px] text-neutral-400">Event name</div>
              <div className="mt-1 rounded-xl bg-neutral-100 px-3 py-2 text-sm font-semibold">
                John & Rachel Wedding
              </div>
            </div>
            <div>
              <div className="text-[10px] text-neutral-400">Event date</div>
              <div className="mt-1 rounded-xl bg-neutral-100 px-3 py-2 text-sm">
                August 24, 2026
              </div>
            </div>
            <div className="rounded-xl bg-neutral-900 px-3 py-2.5 text-center text-xs font-semibold text-white">
              Create event
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "customize") {
    return (
      <div className={`relative h-full min-h-[300px] overflow-hidden bg-gradient-to-br ${tone} p-5`}>
        <div className="absolute bottom-[-3rem] left-[-2rem] h-40 w-40 rounded-full bg-white/30 blur-2xl" />
        <div className="relative mx-auto max-w-[290px] overflow-hidden rounded-[1.75rem] border border-white/80 bg-[#19171b] text-white shadow-xl">
          <div className="relative h-44 overflow-hidden bg-gradient-to-br from-rose-400 via-orange-300 to-amber-100 p-4 text-neutral-900">
            <div className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-60">
              Preview
            </div>
            <div className="absolute bottom-4 left-4 text-2xl">
              John & Rachel
            </div>
            <div className="absolute bottom-4 right-4 h-10 w-10 rounded-full border-4 border-orange-100 bg-rose-500" />
          </div>
          <div className="space-y-3 p-4">
            <div className="flex items-center justify-between text-[10px] text-white/60">
              <span>Theme</span>
              <span>Warm celebration</span>
            </div>
            <div className="flex gap-2">
              <span className="h-8 flex-1 rounded-xl bg-rose-400" />
              <span className="h-8 flex-1 rounded-xl bg-amber-300" />
              <span className="h-8 flex-1 rounded-xl bg-cyan-300" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "share") {
    return (
      <div className={`relative flex min-h-[300px] items-center justify-center overflow-hidden bg-gradient-to-br ${tone} p-5`}>
        <div className="absolute -left-12 top-[-3rem] h-40 w-40 rounded-full bg-white/35 blur-2xl" />
        <div className="relative rotate-[4deg] rounded-[1.75rem] border border-white bg-white p-5 shadow-xl">
          <div className="mx-auto grid h-40 w-40 grid-cols-7 gap-1 rounded-2xl bg-neutral-100 p-3">
            {Array.from({ length: 49 }).map((_, index) => {
              const dark =
                index % 3 === 0 ||
                index % 7 === 1 ||
                index === 10 ||
                index === 20 ||
                index === 31 ||
                index === 42;

              return (
                <span
                  key={index}
                  className={dark ? "rounded-sm bg-neutral-900" : "rounded-sm bg-white"}
                />
              );
            })}
          </div>
          <div className="mt-4 text-center text-sm font-bold">
            Scan to join
          </div>
          <div className="mt-1 text-center text-[10px] text-neutral-400">
            John & Rachel Wedding
          </div>
        </div>
      </div>
    );
  }

  if (type === "upload") {
    return (
      <div className={`relative min-h-[300px] overflow-hidden bg-gradient-to-br ${tone} p-5`}>
        <div className="absolute -bottom-10 -right-10 h-44 w-44 rounded-full bg-white/30 blur-2xl" />
        <div className="relative mx-auto max-w-[280px] rounded-[1.75rem] border border-white/80 bg-white/90 p-4 shadow-xl">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-neutral-900 text-2xl text-white">
              +
            </div>
            <div className="mt-4 text-base font-bold">
              Pick photos & videos
            </div>
            <div className="mt-1 text-xs text-neutral-400">
              Tap to select files
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-2">
            <div className="aspect-square rounded-xl bg-gradient-to-br from-rose-400 to-orange-300" />
            <div className="aspect-square rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500" />
            <div className="aspect-square rounded-xl bg-gradient-to-br from-violet-400 to-fuchsia-500" />
          </div>

          <div className="mt-4 rounded-xl bg-neutral-900 px-3 py-2 text-center text-xs font-semibold text-white">
            Upload memories
          </div>
        </div>
      </div>
    );
  }

  if (type === "moderate") {
    return (
      <div className={`relative min-h-[300px] overflow-hidden bg-gradient-to-br ${tone} p-5`}>
        <div className="relative mx-auto max-w-[300px] rounded-[1.75rem] border border-white/80 bg-white/90 p-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="text-sm font-bold">Review uploads</div>
            <div className="rounded-full bg-amber-100 px-2 py-1 text-[9px] text-amber-700">
              4 pending
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {[
              ["bg-rose-300", "Maya"],
              ["bg-cyan-300", "Daniel"],
              ["bg-violet-300", "Sarah"],
            ].map(([color, name]) => (
              <div
                key={name}
                className="flex items-center gap-2 rounded-xl border p-2"
              >
                <div className={`h-10 w-10 rounded-lg ${color}`} />
                <div className="flex-1">
                  <div className="text-[10px] font-semibold">{name}</div>
                  <div className="text-[9px] text-neutral-400">
                    New upload
                  </div>
                </div>
                <div className="text-[10px] text-emerald-600">Approve</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative min-h-[300px] overflow-hidden bg-gradient-to-br ${tone} p-5`}>
      <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/40 blur-2xl" />
      <div className="relative mx-auto max-w-[300px] rounded-[1.75rem] border border-white/80 bg-white/90 p-5 shadow-xl">
        <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
          Event archive
        </div>
        <div className="mt-3 text-3xl font-bold">248</div>
        <div className="text-xs text-neutral-500">photos & videos ready</div>

        <div className="mt-8 space-y-2">
          <div className="flex items-center justify-between rounded-xl bg-neutral-100 px-3 py-3 text-xs">
            <span>Download photo</span>
            <span>↓</span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-neutral-900 px-3 py-3 text-xs text-white">
            <span>Download all as ZIP</span>
            <span>↓</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HowItWorksPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen overflow-hidden bg-[#fffdfb] text-[#262125]">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="landing-drift absolute -left-48 -top-48 h-[34rem] w-[34rem] rounded-full bg-rose-200/40 blur-3xl" />
        <div className="landing-drift absolute -right-48 top-40 h-[34rem] w-[34rem] rounded-full bg-sky-200/40 blur-3xl [animation-delay:2s]" />
      </div>

      <PublicHeader />

      <main>
        <section className="mx-auto max-w-5xl px-4 pb-20 pt-20 text-center sm:px-6 sm:pt-28 lg:px-8 lg:pb-28">
          <div className="landing-rise">
            <div className="inline-flex rounded-full border border-black/10 bg-white/75 px-4 py-2 text-xs text-neutral-500 shadow-sm">
              From the first upload to the final download
            </div>

            <h1 className="mx-auto mt-7 max-w-4xl text-5xl leading-[0.98] sm:text-6xl lg:text-8xl">
              The easiest way to collect
              <span className="block text-[#b2a8ad]">
                every event memory.
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-neutral-600 sm:text-lg">
              Create a gallery, share one QR code, and let guests contribute
              photos and videos without downloading an app.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="w-full rounded-full bg-[#262125] px-7 text-white sm:w-auto"
                >
                  Create your event ↗
                </Button>
              </Link>
              <Link href="/pricing">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full rounded-full border-black/10 bg-white/70 px-7 sm:w-auto"
                >
                  View pricing
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="border-y border-black/5 bg-white/65">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:grid-cols-3 sm:px-6 lg:px-8">
            {[
              ["No app", "Guests upload directly from their browser."],
              ["One QR code", "Share the same event link everywhere."],
              ["Your gallery", "Keep all memories together in one place."],
            ].map(([title, text]) => (
              <div key={title} className="flex gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-rose-400" />
                <div>
                  <div className="text-sm font-bold">{title}</div>
                  <div className="mt-1 text-xs leading-5 text-neutral-500">
                    {text}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="steps" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400">
              The complete flow
            </div>
            <h2 className="mt-5 text-4xl sm:text-5xl">
              Six small steps to a fuller story.
            </h2>
          </div>

          <div className="mt-16 space-y-20 lg:space-y-28">
            {steps.map((step, index) => {
              const reversed = index % 2 === 1;

              return (
                <div
                  key={step.number}
                  className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-20 ${
                    reversed ? "lg:[&>div:first-child]:order-2" : ""
                  }`}
                >
                  <div className="landing-rise">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#fff0bd] text-xs font-bold">
                        {step.number}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-400">
                        {step.eyebrow}
                      </span>
                    </div>

                    <h3 className="mt-6 max-w-lg text-4xl leading-tight sm:text-5xl">
                      {step.title}
                    </h3>

                    <p className="mt-5 max-w-lg text-sm leading-7 text-neutral-600 sm:text-base">
                      {step.description}
                    </p>

                    <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                      {step.details.map((detail) => (
                        <li
                          key={detail}
                          className="flex items-start gap-2 text-sm text-neutral-600"
                        >
                          <span className="text-emerald-600">✓</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div
                    className={`landing-rise landing-rise-delay-2 overflow-hidden rounded-[2.5rem] border border-black/5 shadow-xl ${
                      reversed ? "lg:order-1" : ""
                    }`}
                  >
                    <StepVisual type={step.visual} tone={step.tone} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="bg-[#262125] px-4 py-24 text-white sm:px-6 lg:px-8 lg:py-32">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">
                Built around real events
              </div>
              <h2 className="mt-5 max-w-lg text-4xl leading-tight sm:text-5xl">
                Simple for guests. Powerful for organizers.
              </h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["For the organizer", "Customize, moderate, manage, and download."],
                ["For the guest", "Scan, upload, and get back to celebrating."],
                ["For the gallery", "Private, organized, and easy to revisit."],
                ["For the memories", "Keep the perspectives you would otherwise miss."],
              ].map(([title, text]) => (
                <div
                  key={title}
                  className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6"
                >
                  <h3 className="text-xl">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/55">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="text-center">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400">
              Good to know
            </div>
            <h2 className="mt-5 text-4xl sm:text-5xl">Questions, answered.</h2>
          </div>

          <div className="mt-10 divide-y divide-black/10 border-y border-black/10">
            {faqs.map((faq, index) => {
              const open = openFaq === index;

              return (
                <div key={faq.question}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : index)}
                    className="flex w-full items-center justify-between gap-5 py-5 text-left"
                  >
                    <span className="text-sm font-bold sm:text-base">
                      {faq.question}
                    </span>
                    <span className="text-xl text-neutral-400">
                      {open ? "−" : "+"}
                    </span>
                  </button>

                  {open && (
                    <div className="pb-5 pr-8 text-sm leading-6 text-neutral-500">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section className="px-4 pb-24 sm:px-6 lg:px-8 lg:pb-32">
          <div className="mx-auto max-w-7xl rounded-[2.75rem] bg-[#262125] px-6 py-16 text-center text-white sm:px-10 sm:py-24">
            <h2 className="text-4xl sm:text-6xl">
              Ready to gather every perspective?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/55 sm:text-base">
              Create an event and give your guests one easy place to share.
            </p>
            <Link href="/dashboard" className="mt-8 inline-block">
              <Button
                size="lg"
                className="rounded-full bg-white px-7 text-[#262125] hover:bg-white/90"
              >
                Create your event ↗
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-black/5 bg-white/70 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Event Photo</span>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-black">
              Home
            </Link>
            <Link href="/pricing" className="hover:text-black">
              Pricing
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}