export type GuideSection = {
  id: string;
  title: string;
  paragraphs: string[];
};

export type Guide = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  readTime: string;
  sections: GuideSection[];
};

export const guides: Guide[] = [
  {
    slug: "setting-up-moderation",
    title: "Setting up moderation for a wedding gallery",
    category: "Moderation",
    excerpt:
      "How to turn on review-before-publish so every upload gets a quick check before it appears for guests.",
    readTime: "4 min read",
    sections: [
      {
        id: "how-it-works",
        title: "How moderation works",
        paragraphs: [
          "Moderation holds every guest upload in a review queue until you approve it, instead of publishing straight to the gallery. It is available on Premium and Pro events.",
        ],
      },
      {
        id: "turning-it-on",
        title: "Turning it on",
        paragraphs: [
          "Premium and Pro include moderation automatically. Open Photos & Videos to review the pending queue. After a refund, leftover pending items stay hidden from guests until you approve or reject them.",
        ],
      },
      {
        id: "reviewing-uploads",
        title: "Reviewing uploads",
        paragraphs: [
          "Each pending item shows the guest name (if provided) and lets you approve or reject it individually. Rejected uploads never appear in the public gallery or slideshow.",
        ],
      },
      {
        id: "wedding-tips",
        title: "Tips for weddings",
        paragraphs: [
          "For a wedding, a good habit is checking the queue once in the morning and once in the evening rather than constantly — guests can keep uploading either way, they just will not see new items appear until you review them if moderation is on.",
        ],
      },
    ],
  },
  {
    slug: "choosing-a-qr-card-layout",
    title: "Choosing the right QR card layout for your venue",
    category: "QR & printing",
    excerpt:
      "A quick guide to picking between the warm and clean QR card layouts, and where to place them.",
    readTime: "3 min read",
    sections: [
      {
        id: "layout-options",
        title: "Two layout options",
        paragraphs: [
          "The QR download dialog on your event page offers two printable layouts: a warm, softly illustrated card and a clean, minimal card.",
        ],
      },
      {
        id: "warm-layout",
        title: "Warm layout",
        paragraphs: [
          "The warm layout reads well on table cards and printed signage at close range — think centerpieces or place settings.",
        ],
      },
      {
        id: "clean-layout",
        title: "Clean layout",
        paragraphs: [
          "The clean layout has higher contrast and larger text, which makes it easier to read from a distance, such as on a welcome sign or a screen near the entrance.",
        ],
      },
      {
        id: "test-before-event",
        title: "Test before the event",
        paragraphs: [
          "Whichever layout you choose, test the printed QR code by scanning it yourself before the event — lighting and paper glare can sometimes affect how well a camera reads it.",
        ],
      },
    ],
  },
  {
    slug: "getting-the-most-out-of-pov-mode",
    title: "Getting the most out of POV mode",
    category: "Features",
    excerpt:
      "POV mode limits how many shots each guest can upload, disposable-camera style. Here is how to use it well.",
    readTime: "3 min read",
    sections: [
      {
        id: "what-pov-does",
        title: "What POV mode does",
        paragraphs: [
          "POV mode caps the number of photos each guest can contribute, similar to handing everyone a disposable camera with a limited number of exposures.",
        ],
      },
      {
        id: "reveal-dates",
        title: "Reveal dates",
        paragraphs: [
          "You can also set a reveal date, so the gallery stays hidden until a specific moment — useful for surprise parties or for keeping the big reveal for after the event.",
        ],
      },
      {
        id: "shot-limits",
        title: "Choosing a shot limit",
        paragraphs: [
          "A shot limit between 5 and 10 per guest tends to work well: enough for guests to be selective without feeling restricted.",
        ],
      },
      {
        id: "set-expectations",
        title: "Set expectations early",
        paragraphs: [
          "Let guests know about the limit when they arrive so they treat it like a game rather than a surprise partway through uploading.",
        ],
      },
    ],
  },
  {
    slug: "password-protecting-a-family-gallery",
    title: "Password-protecting a private family gallery",
    category: "Privacy",
    excerpt:
      "When and how to use gallery passwords to keep an event's photos limited to the people who were there.",
    readTime: "3 min read",
    sections: [
      {
        id: "what-protection-does",
        title: "What gallery protection does",
        paragraphs: [
          "Gallery protection adds a password screen before anyone can view uploaded photos and videos, available on Premium and Pro events.",
        ],
      },
      {
        id: "guest-experience",
        title: "Guest experience",
        paragraphs: [
          "Guests can still open the event link and see the welcome screen, but the gallery itself stays hidden until the correct password is entered.",
        ],
      },
      {
        id: "sharing-password",
        title: "Sharing the password",
        paragraphs: [
          "Share the password separately from the link itself — for example, print it on the QR card or mention it at the event — rather than sending both together in the same message.",
        ],
      },
      {
        id: "changing-password",
        title: "Changing the password",
        paragraphs: [
          "You can change the password at any time from Event Settings → General on a paid Premium or Pro event, without affecting uploads that already exist.",
        ],
      },
    ],
  },
  {
    slug: "planning-your-upload-timeline",
    title: "Planning your upload timeline",
    category: "Planning",
    excerpt:
      "When to turn uploads on, and whether to close them right after the event or leave them open for stragglers.",
    readTime: "3 min read",
    sections: [
      {
        id: "when-uploads-start",
        title: "When uploads start",
        paragraphs: [
          "Uploads are enabled by default as soon as you create an event, so guests can start contributing before the event even begins if you share the link early.",
        ],
      },
      {
        id: "after-the-event",
        title: "After the event",
        paragraphs: [
          "Many organizers leave uploads open for a few days after the event to catch photos guests only get around to sending later.",
        ],
      },
      {
        id: "disabling-uploads",
        title: "Disabling uploads",
        paragraphs: [
          "You can disable uploads at any time from the event page without deleting anything already collected — the gallery, slideshow, and downloads keep working as normal.",
        ],
      },
      {
        id: "media-limits",
        title: "Media limits",
        paragraphs: [
          "If you are close to your plan's media limit, disabling uploads temporarily is a simple way to avoid rejected uploads while you decide whether to upgrade.",
        ],
      },
    ],
  },
];

export function getGuideBySlug(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}

export function getRelatedGuides(currentSlug: string, limit = 3) {
  return guides.filter((guide) => guide.slug !== currentSlug).slice(0, limit);
}
