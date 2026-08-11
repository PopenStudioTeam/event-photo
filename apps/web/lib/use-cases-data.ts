import {
  Briefcase,
  Building2,
  Cake,
  Camera,
  Download,
  GraduationCap,
  Heart,
  PartyPopper,
  Presentation,
  QrCode,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";

export type HowItWorksStep = {
  icon: LucideIcon;
  title: string;
  text: string;
};

export type UseCase = {
  slug: string;
  navLabel: string;
  heroLabel: string;
  icon: LucideIcon;
  headline: string;
  subheadline: string;
  description: string;
  accent: string;
  features: { title: string; text: string }[];
  howItWorks: HowItWorksStep[];
};

export const useCases: UseCase[] = [
  {
    slug: "weddings",
    navLabel: "Weddings",
    heroLabel: "For weddings",
    icon: Heart,
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
    howItWorks: [
      {
        icon: Heart,
        title: "Set up your wedding gallery",
        text: "Add your names, the date, and a cover photo that matches your day.",
      },
      {
        icon: QrCode,
        title: "Print the code on your table cards",
        text: "Or add it to your invitations and welcome sign — no app required.",
      },
      {
        icon: Camera,
        title: "Guests capture what you'll miss",
        text: "The ceremony, the reception, the in-between moments — uploaded live.",
      },
      {
        icon: Download,
        title: "Keep the whole day afterward",
        text: "Download every photo and video in original quality, whenever you're ready.",
      },
    ],
  },
  {
    slug: "parties",
    navLabel: "Parties",
    heroLabel: "For parties",
    icon: PartyPopper,
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
    howItWorks: [
      {
        icon: PartyPopper,
        title: "Spin up a gallery in minutes",
        text: "Pick a cover, name the night, and you're ready to share it.",
      },
      {
        icon: QrCode,
        title: "Put the code where people will see it",
        text: "On a screen, a printed card, or just send the link in the group chat.",
      },
      {
        icon: Camera,
        title: "Guests upload all night long",
        text: "No app, no sign-up — just scan and add photos as they happen.",
      },
      {
        icon: Download,
        title: "Wake up to the whole night",
        text: "Every angle, ready to browse and download the next day.",
      },
    ],
  },
  {
    slug: "birthdays",
    navLabel: "Birthdays",
    heroLabel: "For birthdays",
    icon: Cake,
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
    howItWorks: [
      {
        icon: Cake,
        title: "Create a birthday gallery",
        text: "Pick a fun cover and set a guest limit that fits the party.",
      },
      {
        icon: QrCode,
        title: "Share the code on invites or table cards",
        text: "Grandparents to cousins — if they can scan a code, they can join in.",
      },
      {
        icon: Camera,
        title: "Everyone snaps candid shots",
        text: "Guests upload straight from their phones throughout the party.",
      },
      {
        icon: Download,
        title: "Relive it whenever you want",
        text: "Download the full shared album as a keepsake of the day.",
      },
    ],
  },
  {
    slug: "corporate",
    navLabel: "Corporate",
    heroLabel: "For corporate events",
    icon: Briefcase,
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
    howItWorks: [
      {
        icon: Briefcase,
        title: "Create a branded gallery",
        text: "Match the cover and colors to your company or event theme.",
      },
      {
        icon: QrCode,
        title: "Share the code on badges or screens",
        text: "Put it on invites, name badges, or venue signage.",
      },
      {
        icon: ShieldCheck,
        title: "Review uploads before they're public",
        text: "Turn on moderation so nothing appears without your approval.",
      },
      {
        icon: Download,
        title: "Hand the team one complete download",
        text: "Every approved photo and video, ready to share internally.",
      },
    ],
  },
  {
    slug: "conferences",
    navLabel: "Conferences",
    heroLabel: "For conferences",
    icon: Presentation,
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
    howItWorks: [
      {
        icon: Presentation,
        title: "Set up one gallery for the whole event",
        text: "Keep it open across every day, track, and session.",
      },
      {
        icon: QrCode,
        title: "Put the code on badges and slides",
        text: "Show it between sessions so attendees always know where to upload.",
      },
      {
        icon: Users,
        title: "Attendees contribute all event long",
        text: "Keynotes, breakouts, and the hallway conversations in between.",
      },
      {
        icon: ShieldCheck,
        title: "Keep it private to attendees",
        text: "Add password protection, then download the full archive afterward.",
      },
    ],
  },
  {
    slug: "business",
    navLabel: "Business",
    heroLabel: "For businesses",
    icon: Building2,
    headline: "Every event you run, one platform.",
    subheadline:
      "Built for venues, planners, and agencies running events for other people.",
    description:
      "Set up a branded gallery for each client event, hand guests a single QR code, and deliver a finished, downloadable album back to your client when it's over.",
    accent: "#c9e8ff",
    features: [
      {
        title: "A gallery per client event",
        text: "Keep every event separate, branded, and easy to manage.",
      },
      {
        title: "No extra work on the day",
        text: "Guests upload themselves — your team can focus on running the event.",
      },
      {
        title: "A deliverable for your client",
        text: "Hand off a complete, downloadable gallery once the event wraps.",
      },
    ],
    howItWorks: [
      {
        icon: Building2,
        title: "Create a gallery for each event",
        text: "Set one up per client, venue, or occasion you're running.",
      },
      {
        icon: QrCode,
        title: "Brand it and share the code",
        text: "Match the client's colors, then hand out the QR code on the day.",
      },
      {
        icon: Users,
        title: "Guests contribute without any friction",
        text: "No app, no sign-up — your team doesn't have to manage a thing.",
      },
      {
        icon: Download,
        title: "Deliver a finished gallery back",
        text: "Download the complete collection to hand off to your client.",
      },
    ],
  },
  {
    slug: "family-reunions",
    navLabel: "Family reunions",
    heroLabel: "For family reunions",
    icon: Users,
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
    howItWorks: [
      {
        icon: Users,
        title: "Create one gallery for the family",
        text: "Set it up once, before everyone arrives.",
      },
      {
        icon: QrCode,
        title: "Share a single link with everyone",
        text: "Text it, email it, or print it — no app to install.",
      },
      {
        icon: Camera,
        title: "Every generation adds their photos",
        text: "From grandparents to grandkids, uploading is just opening a link.",
      },
      {
        icon: Download,
        title: "Keep it open, then keep it forever",
        text: "Leave uploads on for days, then download the whole memory book.",
      },
    ],
  },
  {
    slug: "graduations",
    navLabel: "Graduations",
    heroLabel: "For graduations",
    icon: GraduationCap,
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
    howItWorks: [
      {
        icon: GraduationCap,
        title: "Set up the gallery before the ceremony",
        text: "Have it ready to share the moment guests arrive.",
      },
      {
        icon: QrCode,
        title: "Share the code with friends and family",
        text: "Send it ahead of time so everyone's ready to upload.",
      },
      {
        icon: Camera,
        title: "Capture every hug and hat toss",
        text: "Guests upload live, from the processional to the after-party.",
      },
      {
        icon: Download,
        title: "Save the whole day",
        text: "Download every photo and video in original quality afterward.",
      },
    ],
  },
];
