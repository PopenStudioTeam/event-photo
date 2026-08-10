export type UseCase = {
  slug: string;
  navLabel: string;
  heroLabel: string;
  headline: string;
  subheadline: string;
  description: string;
  accent: string;
  features: { title: string; text: string }[];
};

export const useCases: UseCase[] = [
  {
    slug: "weddings",
    navLabel: "Weddings",
    heroLabel: "For weddings",
    headline: "Every angle of your wedding day.",
    subheadline:
      "From the ceremony to the last dance, guests capture what you can't.",
    description:
      "Put one QR code on your table cards or invitations, and every guest becomes a second photographer. No app to install, no photos stuck on someone else's phone.",
    accent: "#ffd7df",
    features: [
      {
        title: "One code for the whole day",
        text: "Print it on table cards, signage, or your program.",
      },
      {
        title: "Every table, every moment",
        text: "Guests upload straight from their seats, all night.",
      },
      {
        title: "One album to keep",
        text: "Download every photo and video in original quality.",
      },
    ],
  },
  {
    slug: "parties",
    navLabel: "Parties",
    heroLabel: "For parties",
    headline: "The night from everyone's perspective.",
    subheadline: "Let every guest add their view of the party as it happens.",
    description:
      "Share a link or QR code and watch the gallery fill up in real time, from the first drink to the last song.",
    accent: "#d8efff",
    features: [
      {
        title: "Real-time uploads",
        text: "Photos appear in the gallery as guests take them.",
      },
      {
        title: "No accounts needed",
        text: "Guests just enter a name and start uploading.",
      },
      {
        title: "Relive it the next day",
        text: "Browse and download everything in one place.",
      },
    ],
  },
  {
    slug: "birthdays",
    navLabel: "Birthdays",
    heroLabel: "For birthdays",
    headline: "More than one perspective on the big day.",
    subheadline:
      "From kids' parties to milestone birthdays, capture it from every seat.",
    description:
      "Guests scan a code on the invitation or table and upload directly — no app, no chasing people for photos afterward.",
    accent: "#fff0bd",
    features: [
      {
        title: "Easy for every age",
        text: "Works from any phone browser, no download required.",
      },
      {
        title: "One shared album",
        text: "Family and friends add photos to the same gallery.",
      },
      {
        title: "A gift you keep",
        text: "Download the full collection when the party's over.",
      },
    ],
  },
  {
    slug: "corporate",
    navLabel: "Corporate",
    heroLabel: "For corporate events",
    headline: "Bring the whole room together.",
    subheadline:
      "Company parties, launches, and offsites — captured by everyone who's there.",
    description:
      "Display the QR code on screens or badges and let attendees contribute throughout the event, with optional moderation before anything goes public.",
    accent: "#e3d9ff",
    features: [
      {
        title: "Moderation built in",
        text: "Review uploads before they appear in the shared gallery.",
      },
      {
        title: "Branded gallery",
        text: "Match the cover and colors to your event or company.",
      },
      {
        title: "One download for the team",
        text: "Get every photo in one place after the event.",
      },
    ],
  },
  {
    slug: "conferences",
    navLabel: "Conferences",
    heroLabel: "For conferences",
    headline: "Every session, covered.",
    subheadline:
      "Multi-day events, multiple tracks — one gallery for all of it.",
    description:
      "Attendees upload from keynotes, breakout sessions, and networking breaks, building a complete record of the event without a dedicated photo team.",
    accent: "#d7f5e3",
    features: [
      {
        title: "Works across days",
        text: "Keep the same gallery open for the length of the event.",
      },
      {
        title: "Live photo wall",
        text: "Show uploads on screen between sessions.",
      },
      {
        title: "Password protection",
        text: "Keep the gallery private to attendees if needed.",
      },
    ],
  },
  {
    slug: "family-reunions",
    navLabel: "Family reunions",
    heroLabel: "For family reunions",
    headline: "Every generation, one album.",
    subheadline: "From grandparents to grandkids, everyone adds their own photos.",
    description:
      "One link works for relatives near and far — no one needs to learn a new app to take part.",
    accent: "#ffe2c9",
    features: [
      {
        title: "Works for every generation",
        text: "If they can open a link, they can contribute.",
      },
      {
        title: "One shared memory book",
        text: "Every branch of the family in the same gallery.",
      },
      {
        title: "Keep it going",
        text: "Leave uploads open for days after everyone heads home.",
      },
    ],
  },
  {
    slug: "graduations",
    navLabel: "Graduations",
    heroLabel: "For graduations",
    headline: "Every hug, every hat toss.",
    subheadline:
      "Capture the day from the people who were actually there with you.",
    description:
      "Share the link before the ceremony so friends and family can start uploading the moment it begins.",
    accent: "#ffe9f5",
    features: [
      {
        title: "Ready before the ceremony",
        text: "Share the QR code or link ahead of time.",
      },
      {
        title: "Every friend, every family member",
        text: "One gallery for everyone who came to celebrate.",
      },
      {
        title: "A keepsake you download",
        text: "Save the whole day in original quality.",
      },
    ],
  },
];