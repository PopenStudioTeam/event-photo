import { BookOpen, Folder, Lock, ShoppingCart, type LucideIcon } from "lucide-react";

export type HelpArticle = {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  body: string[];
};

export type HelpArticleGroup = {
  title?: string;
  articles: HelpArticle[];
};

export type HelpCategory = {
  slug: string;
  title: string;
  description: string;
  icon: LucideIcon;
  groups: HelpArticleGroup[];
};

export const helpCategories: HelpCategory[] = [
  {
    slug: "general",
    title: "General",
    description: "Common questions about Event Photo",
    icon: Folder,
    groups: [
      {
        articles: [
          {
            slug: "what-is-event-photo",
            title: "What is Event Photo?",
            subtitle: "A quick overview of what the product does.",
            date: "2026-05-05",
            body: [
              "Event Photo is a shared digital album for your event. You create a gallery, share a QR code or link with your guests, and every photo or video they take lands in one place automatically.",
              "There's nothing for guests to download — they open a link in their phone's browser, upload, and that's it. You can browse, download, or display the gallery on a screen at any point during or after the event.",
            ],
          },
          {
            slug: "what-events-are-suitable",
            title: "What events are suitable for Event Photo?",
            subtitle: "Learn how you can use Event Photo for your events.",
            date: "2026-05-19",
            body: [
              "Event Photo works for any event where guests are taking photos and you want to collect them all in one place. It's commonly used for weddings, birthday parties, corporate events, family reunions, graduations, and conferences.",
              "Whether it's a single-day event or something that runs for a whole weekend, Event Photo helps you gather everyone's photos into one shared gallery. If people are taking pictures, it makes it easy to bring those moments together.",
            ],
          },
          {
            slug: "how-does-it-compare",
            title: "How does Event Photo compare to other apps?",
            subtitle: "What makes it different from a shared folder or another app.",
            date: "2026-05-21",
            body: [
              "Unlike a shared cloud folder, Event Photo is built specifically for events: guests don't need an account, uploads are organized automatically by event, and you get a live slideshow mode built in.",
              "Compared to other dedicated event apps, the main differences usually come down to pricing model (one-time per event, not a subscription) and how simple the guest upload flow is.",
            ],
          },
          {
            slug: "already-have-a-photographer",
            title: "We already have a photographer. Should we still use it?",
            subtitle: "Why a professional photographer and Event Photo work well together.",
            date: "2026-05-22",
            body: [
              "Yes — most hosts use both. Your photographer captures the posed, high-quality shots, while Event Photo collects the casual, candid moments from everyone else's phone that a single photographer could never be in two places to catch.",
            ],
          },
          {
            slug: "inappropriate-photo",
            title: "What if an inappropriate photo is shared?",
            subtitle: "How moderation works if you need it.",
            date: "2026-05-24",
            body: [
              "Premium and Pro plans include moderation: every upload is held for your approval before it appears in the shared gallery, so you can decline anything that shouldn't be there.",
              "On the Free plan, you can remove any individual photo or video from the gallery at any time after it's uploaded.",
            ],
          },
          {
            slug: "collaborators",
            title: "What are collaborators and how do I add one?",
            subtitle: "Letting a partner or planner help manage your event.",
            date: "2026-05-27",
            body: [
              "Collaborators are other organizers who can help manage your event — approving uploads, downloading photos, or updating settings — without needing to share your login.",
              "You can invite a collaborator by email from your event's settings page.",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "guides",
    title: "Guides & Common Questions",
    description: "Walkthrough guides for using Event Photo at your event.",
    icon: BookOpen,
    groups: [
      {
        articles: [
          {
            slug: "do-guests-need-an-app",
            title: "Do guests need to download an app to participate?",
            subtitle: "No installs, no accounts — just a link.",
            date: "2026-04-02",
            body: [
              "No. Guests scan the QR code or open the shared link in their phone's browser. There's nothing to install and no account to create.",
            ],
          },
          {
            slug: "download-all-guest-media",
            title: "Can I download all guests' photos & videos?",
            subtitle: "Getting the full collection off the platform.",
            date: "2026-04-03",
            body: [
              "Yes. From your event dashboard you can download the entire gallery as a ZIP file in original quality, at any time.",
            ],
          },
          {
            slug: "does-the-qr-code-change",
            title: "Does the QR code change?",
            subtitle: "Whether you need to reprint anything mid-event.",
            date: "2026-04-05",
            body: [
              "No. Each event gets one QR code for its full lifetime, so anything you print ahead of time will keep working for the whole event.",
            ],
          },
          {
            slug: "print-the-qr-code",
            title: "Can I print the QR code?",
            subtitle: "Putting the code on table cards or signage.",
            date: "2026-04-06",
            body: [
              "Yes. You can download a print-ready version of your event's QR code directly from the dashboard to use on table cards, signage, or invitations.",
            ],
          },
          {
            slug: "multi-day-events",
            title: "My event runs for more than one day. Can I still use it?",
            subtitle: "Keeping one gallery open across a whole weekend.",
            date: "2026-04-08",
            body: [
              "Yes. There's no limit on how many days a gallery stays open — leave uploads on for as long as your event runs, then close them whenever you're ready.",
            ],
          },
          {
            slug: "upload-window",
            title: "How long do guests have to upload new photos or videos?",
            subtitle: "Setting or extending the upload window.",
            date: "2026-04-10",
            body: [
              "By default, uploads stay open indefinitely unless you set a deadline. You can adjust or remove the upload deadline from your event's settings at any time.",
            ],
          },
        ],
      },
      {
        title: "Digital Album",
        articles: [
          {
            slug: "change-album-background",
            title: "How can I change the album's cover and colors?",
            subtitle: "Customizing the look of your gallery.",
            date: "2026-04-14",
            body: [
              "Open your event's settings and update the cover image, accent color, and background style. Changes apply immediately for anyone viewing the gallery.",
            ],
          },
          {
            slug: "delete-a-photo",
            title: "How can I delete a photo or video?",
            subtitle: "Removing an upload from the gallery.",
            date: "2026-04-15",
            body: [
              "Open the item in your event's media manager and choose delete. This removes it from the gallery for everyone.",
            ],
          },
          {
            slug: "restrict-media-types",
            title: "Can I restrict guests to only uploading photos, not videos?",
            subtitle: "Limiting the type of media guests can share.",
            date: "2026-04-17",
            body: [
              "Not yet — guests can currently upload both photos and videos. If this is important for your event, let us know through the chat bubble.",
            ],
          },
          {
            slug: "approve-uploads",
            title: "How do I approve guest uploads before they appear in the album?",
            subtitle: "Turning on moderation.",
            date: "2026-04-18",
            body: [
              "Enable moderation from your event's settings (available on Premium and Pro). Every upload will wait in a review queue until you approve or decline it.",
            ],
          },
        ],
      },
      {
        title: "Slideshow (Live Photo Wall)",
        articles: [
          {
            slug: "connect-slideshow-to-tv",
            title: "How can I connect the slideshow to a TV?",
            subtitle: "Displaying the live gallery on a screen.",
            date: "2026-04-20",
            body: [
              "Open your event's slideshow link on any smart TV's browser, or connect a laptop or streaming device to the TV and open the link there. New uploads appear automatically.",
            ],
          },
          {
            slug: "connect-slideshow-to-projector",
            title: "How can I connect the slideshow to a projector?",
            subtitle: "Using the live wall for a bigger display.",
            date: "2026-04-21",
            body: [
              "Any device that can run a web browser and connect to a projector will work — open your event's slideshow link there the same way you would on a TV.",
            ],
          },
          {
            slug: "hide-qr-in-slideshow",
            title: "Can I hide the QR code from the slideshow?",
            subtitle: "Adjusting what appears on the display.",
            date: "2026-04-22",
            body: [
              "Yes. You can toggle the QR code overlay on or off for the slideshow from your event's display settings.",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "billing",
    title: "Billing & Purchases",
    description: "Information about payments & billing.",
    icon: ShoppingCart,
    groups: [
      {
        articles: [
          {
            slug: "is-it-a-subscription",
            title: "Is this a monthly subscription?",
            subtitle: "How pricing works per event.",
            date: "2026-03-10",
            body: [
              "No. Premium and Pro are one-time payments tied to a single event — there's no recurring subscription charge.",
            ],
          },
          {
            slug: "when-do-paid-features-activate",
            title: "When do paid features become active?",
            subtitle: "Timing after checkout.",
            date: "2026-03-12",
            body: [
              "Paid features activate as soon as your payment is confirmed, which is typically instant.",
            ],
          },
          {
            slug: "refund-policy",
            title: "What is your refund policy?",
            subtitle: "What happens if an event doesn't go as planned.",
            date: "2026-03-14",
            body: [
              "If you end up not using your event for any reason, reach out through the chat bubble and we'll issue a refund according to our fair refund policy.",
            ],
          },
          {
            slug: "upgrade-existing-event",
            title: "Can I upgrade an event I already created?",
            subtitle: "Moving from Free to a paid plan later.",
            date: "2026-03-16",
            body: [
              "Yes. You can upgrade an existing event to Premium or Pro at any time from its settings page — your gallery and existing uploads carry over.",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "security",
    title: "Security & Privacy",
    description: "Questions about data protection, photo privacy, and account safety.",
    icon: Lock,
    groups: [
      {
        articles: [
          {
            slug: "are-photos-private",
            title: "Are my guests' photos private?",
            subtitle: "Who can see your event gallery.",
            date: "2026-03-20",
            body: [
              "Only people with your event's link or QR code can view the gallery. Paid plans add an optional password so you can restrict access further to just your invited guests.",
            ],
          },
          {
            slug: "do-you-sell-data",
            title: "Do you sell or share guest data?",
            subtitle: "How uploaded content is used.",
            date: "2026-03-21",
            body: [
              "No. Photos, videos, and any information guests provide are used only to run your event's gallery — never sold or shared with third parties.",
            ],
          },
          {
            slug: "delete-my-event",
            title: "Can I permanently delete an event and its data?",
            subtitle: "Removing an event once you're done with it.",
            date: "2026-03-23",
            body: [
              "Yes, from your dashboard. Deleting an event permanently removes its gallery and all associated media from our systems.",
            ],
          },
        ],
      },
    ],
  },
];

export function findHelpCategory(slug: string) {
  return helpCategories.find((category) => category.slug === slug);
}

export function countArticles(category: HelpCategory) {
  return category.groups.reduce((total, group) => total + group.articles.length, 0);
}

export function allArticlesInCategory(category: HelpCategory): HelpArticle[] {
  return category.groups.flatMap((group) => group.articles);
}

export function findHelpArticle(categorySlug: string, articleSlug: string) {
  const category = findHelpCategory(categorySlug);
  if (!category) return null;

  const article = allArticlesInCategory(category).find(
    (item) => item.slug === articleSlug
  );
  if (!article) return null;

  return { category, article };
}

export function relatedArticles(
  category: HelpCategory,
  currentSlug: string,
  count = 5
): HelpArticle[] {
  return allArticlesInCategory(category)
    .filter((article) => article.slug !== currentSlug)
    .slice(0, count);
}
