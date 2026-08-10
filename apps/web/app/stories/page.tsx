import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PublicHeader } from "@/components/public-header";
import { SiteFooter } from "@/components/site-footer";

// Placeholder host stories — replace with real quotes and numbers before launch.

export const metadata: Metadata = {
  title: "Host Stories — Event Photo",
  description:
    "Real feedback from organizers who used Event Photo to collect guest photos and videos.",
};

type HostStory = {
  name: string;
  eventType: string;
  location: string;
  quote: string;
  stat: string;
  accent: string;
};

const stories: HostStory[] = [
  {
    name: "Priya",
    eventType: "Wedding",
    location: "Austin, TX",
    quote:
      "Our guests uploaded photos all night without anyone asking how it worked. We ended up with angles we never would have seen otherwise.",
    stat: "210 guest uploads",
    accent: "bg-[#ffd7df]",
  },
  {
    name: "Marcus",
    eventType: "Corporate event",
    location: "Chicago, IL",
    quote:
      "We put the QR code on the welcome screen and people started uploading before the keynote even ended.",
    stat: "80 contributors",
    accent: "bg-[#d8efff]",
  },
  {
    name: "Sofia",
    eventType: "Birthday",
    location: "Miami, FL",
    quote:
      "Password protection made it easy to keep the gallery just for close friends and family.",
    stat: "150 photos & videos",
    accent: "bg-[#fff0bd]",
  },
  {
    name: "Daniel",
    eventType: "Family reunion",
    location: "Portland, OR",
    quote:
      "Three generations uploaded from their phones with zero help from me. That alone was worth it.",
    stat: "64 contributors",
    accent: "bg-[#e3d9ff]",
  },
  {
    name: "Aisha",
    eventType: "Graduation",
    location: "Atlanta, GA",
    quote:
      "The slideshow mode ran on a TV at the party while uploads kept coming in live. Guests loved seeing themselves pop up.",
    stat: "95 guest uploads",
    accent: "bg-[#ffd7df]",
  },
  {
    name: "Ben",
    eventType: "Anniversary",
    location: "Denver, CO",
    quote:
      "POV mode turned it into a little game — everyone wanted to use their shots wisely.",
    stat: "40 contributors",
    accent: "bg-[#d8efff]",
  },
];

const stats = [
  { label: "Guest uploads collected", value: "12,000+" },
  { label: "Events hosted", value: "300+" },
  { label: "Average host rating", value: "4.9 / 5" },
];

export default function StoriesPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#fffdfb] text-[#262125]">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-48 -top-48 h-[34rem] w-[34rem] rounded-full bg-rose-200/40 blur-3xl" />
        <div className="absolute -right-48 top-40 h-[34rem] w-[34rem] rounded-full bg-sky-200/40 blur-3xl" />
      </div>

      <PublicHeader />

      <main>
        <section className="mx-auto max-w-4xl px-4 pb-14 pt-20 text-center sm:px-6 sm:pt-28 lg:px-8">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400">
            Host stories
          </div>
          <h1 className="mx-auto mt-5 max-w-3xl text-5xl leading-[0.98] sm:text-6xl">
            Real events,
            <span className="block text-[#b2a8ad]">real memories.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-neutral-600 sm:text-lg">
            A few notes from organizers who used Event Photo to collect
            photos and videos from their guests.
          </p>
        </section>

        <section className="border-y border-black/5 bg-white/65">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:grid-cols-3 sm:px-6 lg:px-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold sm:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs text-neutral-500">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {stories.map((story) => (
              <div
                key={`${story.name}-${story.eventType}`}
                className="flex h-full flex-col justify-between rounded-[2rem] border border-black/5 bg-white/75 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] ${story.accent}`}
                  >
                    {story.eventType}
                  </span>
                  <p className="mt-5 text-sm leading-6 text-neutral-700">
                    &ldquo;{story.quote}&rdquo;
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-black/5 pt-4 text-xs text-neutral-500">
                  <span className="font-semibold text-[#262125]">
                    {story.name} · {story.location}
                  </span>
                  <span>{story.stat}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="px-4 pb-24 sm:px-6 lg:px-8 lg:pb-32">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.75rem] bg-[#262125] px-6 py-16 text-center text-white sm:px-10 sm:py-24">
            <h2 className="text-4xl leading-tight sm:text-6xl">
              Your event could be next.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/55 sm:text-base">
              Create a gallery and give your guests one easy place to share.
            </p>
            <Link href="/dashboard" className="mt-8 inline-block">
              <Button
                size="lg"
                className="rounded-full bg-white px-7 text-[#262125] hover:bg-white/90"
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