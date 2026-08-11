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
  photos?: string[];
};

const stories: HostStory[] = [
  {
    name: "Priya",
    eventType: "Wedding",
    location: "Austin, TX",
    quote:
      "Our guests uploaded photos all night without anyone asking how it worked. We ended up with angles we never would have seen otherwise.",
    photos: [
      "Photo: guest submitted, Priya's wedding, ceremony",
      "Photo: guest submitted, Priya's wedding, reception",
    ],
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
    photos: ["Photo: guest submitted, Sofia's birthday"],
  },
  {
    name: "Daniel",
    eventType: "Family reunion",
    location: "Portland, OR",
    quote:
      "Three generations uploaded from their phones with zero help from me. That alone was worth it.",
    photos: [
      "Photo: guest submitted, Daniel's family reunion, group shot",
      "Photo: guest submitted, Daniel's family reunion, kids table",
    ],
  },
  {
    name: "Aisha",
    eventType: "Graduation",
    location: "Atlanta, GA",
    quote:
      "The slideshow mode ran on a TV at the party while uploads kept coming in live. Guests loved seeing themselves pop up.",
    photos: ["Photo: guest submitted, Aisha's graduation"],
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
    photos: ["Photo: guest submitted, Camille's conference"],
  },
  {
    name: "Wei",
    eventType: "Party",
    location: "San Francisco, CA",
    quote:
      "Everyone just scanned the code off the table card — no one asked a single question about how it worked.",
    photos: [
      "Photo: guest submitted, Wei's party, dance floor",
      "Photo: guest submitted, Wei's party, table cards",
    ],
  },
  {
    name: "Hannah",
    eventType: "Wedding",
    location: "Charleston, SC",
    quote:
      "We didn't need a second photographer. By the end of the night we had hundreds of candid shots from every table.",
    photos: ["Photo: guest submitted, Hannah's wedding"],
  },
  {
    name: "Tomás",
    eventType: "Birthday",
    location: "Phoenix, AZ",
    quote:
      "My grandparents figured it out just as fast as my nieces and nephews did. That's rare for anything tech-related.",
  },
  {
    name: "Grace",
    eventType: "Corporate event",
    location: "Boston, MA",
    quote:
      "Moderation meant we could open uploads to the whole floor and still keep the final gallery on-brand.",
    photos: [
      "Photo: guest submitted, Grace's corporate event, team photo",
      "Photo: guest submitted, Grace's corporate event, keynote",
    ],
  },
  {
    name: "Noah",
    eventType: "Graduation",
    location: "Minneapolis, MN",
    quote:
      "Friends who couldn't make it still felt like they were there once we sent out the gallery link.",
    photos: ["Photo: guest submitted, Noah's graduation"],
  },
  {
    name: "Isabelle",
    eventType: "Party",
    location: "New Orleans, LA",
    quote:
      "We ran it for a three-day event and the gallery just kept growing. Nobody had to be reminded to upload.",
  },
  {
    name: "Ravi",
    eventType: "Family reunion",
    location: "Houston, TX",
    quote:
      "One link worked for relatives who barely use their phones and the ones glued to them. Everyone contributed.",
    photos: ["Photo: guest submitted, Ravi's family reunion"],
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

                {story.photos && story.photos.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-3">
                    {story.photos.map((photoLabel) => (
                      <AssetPlaceholder
                        key={photoLabel}
                        label={photoLabel}
                        className="h-32 w-32 min-h-0 shrink-0 gap-1 p-3 text-[10px]"
                      />
                    ))}
                  </div>
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
