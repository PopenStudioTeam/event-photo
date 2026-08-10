export type Guide = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  readTime: string;
  body: string[];
};

export const guides: Guide[] = [
  {
    slug: "setting-up-moderation",
    title: "Setting up moderation for a wedding gallery",
    category: "Moderation",
    excerpt:
      "How to turn on review-before-publish so every upload gets a quick check before it appears for guests.",
    readTime: "4 min read",
    body: [
      "Moderation holds every guest upload in a review queue until you approve it, instead of publishing straight to the gallery. It is available on Premium and Pro events.",
      "Turn it on from the event's edit dialog, then open the Moderation panel from the event page whenever you want to review pending uploads.",
      "Each pending item shows the guest name (if provided) and lets you approve or reject it individually. Rejected uploads never appear in the public gallery or slideshow.",
      "For a wedding, a good habit is checking the queue once in the morning and once in the evening rather than constantly — guests can keep uploading either way, they just will not see new items appear until you review them if moderation is on.",
    ],
  },
  {
    slug: "choosing-a-qr-card-layout",
    title: "Choosing the right QR card layout for your venue",
    category: "QR & printing",
    excerpt:
      "A quick guide to picking between the warm and clean QR card layouts, and where to place them.",
    readTime: "3 min read",
    body: [
      "The QR download dialog on your event page offers two printable layouts: a warm, softly illustrated card and a clean, minimal card.",
      "The warm layout reads well on table cards and printed signage at close range — think centerpieces or place settings.",
      "The clean layout has higher contrast and larger text, which makes it easier to read from a distance, such as on a welcome sign or a screen near the entrance.",
      "Whichever layout you choose, test the printed QR code by scanning it yourself before the event — lighting and paper glare can sometimes affect how well a camera reads it.",
    ],
  },
  {
    slug: "getting-the-most-out-of-pov-mode",
    title: "Getting the most out of POV mode",
    category: "Features",
    excerpt:
      "POV mode limits how many shots each guest can upload, disposable-camera style. Here is how to use it well.",
    readTime: "3 min read",
    body: [
      "POV mode caps the number of photos each guest can contribute, similar to handing everyone a disposable camera with a limited number of exposures.",
      "You can also set a reveal date, so the gallery stays hidden until a specific moment — useful for surprise parties or for keeping the big reveal for after the event.",
      "A shot limit between 5 and 10 per guest tends to work well: enough for guests to be selective without feeling restricted.",
      "Let guests know about the limit when they arrive so they treat it like a game rather than a surprise partway through uploading.",
    ],
  },
  {
    slug: "password-protecting-a-family-gallery",
    title: "Password-protecting a private family gallery",
    category: "Privacy",
    excerpt:
      "When and how to use gallery passwords to keep an event's photos limited to the people who were there.",
    readTime: "3 min read",
    body: [
      "Gallery protection adds a password screen before anyone can view uploaded photos and videos, available on Premium and Pro events.",
      "Guests can still open the event link and see the welcome screen, but the gallery itself stays hidden until the correct password is entered.",
      "Share the password separately from the link itself — for example, print it on the QR card or mention it at the event — rather than sending both together in the same message.",
      "You can change the password at any time from the event's edit dialog without affecting uploads that already exist.",
    ],
  },
  {
    slug: "planning-your-upload-timeline",
    title: "Planning your upload timeline",
    category: "Planning",
    excerpt:
      "When to turn uploads on, and whether to close them right after the event or leave them open for stragglers.",
    readTime: "3 min read",
    body: [
      "Uploads are enabled by default as soon as you create an event, so guests can start contributing before the event even begins if you share the link early.",
      "Many organizers leave uploads open for a few days after the event to catch photos guests only get around to sending later.",
      "You can disable uploads at any time from the event page without deleting anything already collected — the gallery, slideshow, and downloads keep working as normal.",
      "If you are close to your plan's media limit, disabling uploads temporarily is a simple way to avoid rejected uploads while you decide whether to upgrade.",
    ],
  },
];

export function getGuideBySlug(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}