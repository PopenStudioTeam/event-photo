import type { Metadata } from "next";
import Link from "next/link";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicHeader } from "@/components/public-header";
import { SiteFooter } from "@/components/site-footer";
import { AssetPlaceholder } from "@/components/marketing/asset-placeholder";

// Placeholder host stories — replace with real quotes before launch.

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
  photoLabel?: string;
};

const stories: HostStory[] = [
  {
    name: "Priya",
    eventType: "Wedding",
    location: "Austin, TX",
    quote:
      "Our guests uploaded photos all night without anyone asking how it worked. We ended up with angles we never would have seen otherwise.",
    photoLabel: "Photo: guest submitted, Priya's wedding",
  },
  {
    name: "Marcus",
    eventType: "Corporate event",
    location: "Chicago, IL",
    quote:
      "We put the QR code on the welcome screen and people started uploading before the keynote even ended.",
  },
  {
    name: "Sofia",
    eventType: "Birthday",
    location: "Miami, FL",
    quote:
      "Password protection made it easy to keep the gallery just for close friends and family.",
    photoLabel: "Photo: guest submitted, Sofia's birthday",
  },
  {
    name: "Daniel",
    eventType: "Family reunion",
    location: "Portland, OR",
    quote:
      "Three generations uploaded from their phones with zero help from me. That alone was worth it.",
  },
  {
    name: "Aisha",
    eventType: "Graduation",
    location: "Atlanta, GA",
    quote:
      "The slideshow mode ran on a TV at the party while uploads kept coming in live. Guests loved seeing themselves pop up.",
    photoLabel: "Photo: guest submitted, Aisha's graduation",
  },
  {
    name: "Ben",
    eventType: "Anniversary",
    location: "Denver, CO",
    quote:
      "POV mode turned it into a little game — everyone wanted to use their shots wisely.",
  },
  {
    name: "Camille",
    eventType: "Conference",
    location: "Seattle, WA",
    quote:
      "Attendees kept the gallery going across all three days of the conference without any extra prompting from us.",
  },
  {
    name: "Wei",
    eventType: "Party",
    location: "San Francisco, CA",
    quote:
      "Everyone just scanned the code off the table card — no one asked a single question about how it worked.",
    photoLabel: "Photo: guest submitted, Wei's party",
  },
];

export default function StoriesPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground">
      <PublicHeader />

      <main>
        <section className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 pb-14 pt-16 text-center sm:px-6 sm:pt-24 lg:px-8">
          <h1 className="text-4xl leading-tight sm:text-5xl">
            Our Wall of Love
          </h1>
          <Link href="/dashboard">
            <Button
              size="lg"
              className="rounded-full bg-primary px-7 text-primary-foreground hover:bg-[var(--primary-hover)]"
            >
              Create your event
              <span className="ml-2">↗</span>
            </Button>
          </Link>
        </section>

        <section className="mx-auto max-w-2xl px-4 pb-24 sm:px-6 lg:px-8 lg:pb-32">
          <div className="divide-y divide-border">
            {stories.map((story) => (
              <article
                key={`${story.name}-${story.eventType}`}
                className="py-8 first:pt-0"
              >
                <div className="text-base font-bold text-foreground">
                  {story.name}
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex text-primary">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} className="h-3 w-3 fill-current" />
                    ))}
                  </span>
                  {story.eventType} · {story.location}
                </div>

                <p className="mt-4 text-sm leading-7 text-foreground/85">
                  {story.quote}
                </p>

                {story.photoLabel && (
                  <AssetPlaceholder
                    label={story.photoLabel}
                    className="mt-4 min-h-[160px] max-w-xs"
                  />
                )}
              </article>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
