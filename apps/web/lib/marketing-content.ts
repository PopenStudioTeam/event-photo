import {
  Download,
  Image as ImageIcon,
  Lock,
  MessageSquare,
  MonitorPlay,
  Palette,
  QrCode,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import type { AllYouNeedItem } from "@/components/marketing/all-you-need-grid";
import type { Testimonial } from "@/components/marketing/testimonials-row";
import type { Faq } from "@/components/marketing/faq-split";

export const allYouNeedFeatures: AllYouNeedItem[] = [
  { icon: ImageIcon, title: "Digital album", text: "One shared gallery for every photo and video." },
  { icon: Download, title: "One-click download", text: "Premium and Pro can grab the full gallery as a ZIP. Free can download items one at a time." },
  { icon: QrCode, title: "No app required", text: "Guests upload straight from their phone browser." },
  { icon: QrCode, title: "QR code templates", text: "Print-ready templates for cards, signs, and screens." },
  { icon: MonitorPlay, title: "Live photo wall", text: "Show uploads on a screen as they arrive." },
  { icon: Palette, title: "Customizations", text: "Match the cover and colors to your event." },
  { icon: MessageSquare, title: "Text & captions", text: "Guests can sign and caption what they share." },
  { icon: Lock, title: "Private & secured", text: "Password-protect the gallery when it matters." },
];

export const defaultTestimonials: Testimonial[] = [
  {
    quote:
      "Our photographer can't be everywhere — this gave us so many candid photos we wouldn't have gotten otherwise.",
    name: "Mary S.",
    location: "United States",
  },
  {
    quote:
      "We tested a few photo-sharing apps and eventually went with this one. Everyone liked it and we got great feedback from all participants.",
    name: "Sara M.",
    location: "Canada",
    photoLabel: "Photo: guest holding phone at the event",
  },
  {
    quote:
      "Made our event so much more memorable. The live slideshow was a hit among our guests, who loved seeing their photos pop up.",
    name: "Robin W.",
    location: "United Kingdom",
  },
];

export const defaultFaqs: Faq[] = [
  {
    question: "Do guests need to download an app to participate?",
    answer:
      "No. Guests scan the QR code or open the private link in their phone browser.",
  },
  {
    question: "Can I download all guests' photos & videos?",
    answer:
      "Premium and Pro can download the full gallery as a ZIP. On Free you can still download photos and videos one at a time.",
  },
  {
    question: "Is it better than other photo-sharing apps?",
    answer:
      "There's no guest app, no sign-up, and no monthly subscription — one payment covers the whole event.",
  },
  {
    question: "Can I print the QR code on signs?",
    answer:
      "Yes. Print-ready QR code templates are included for table cards, signage, and invitations.",
  },
  {
    question: "How do I use the live photo wall?",
    answer:
      "Open your event's slideshow link on any screen or TV — new uploads appear automatically.",
  },
  {
    question: "Are my guests' photos private?",
    answer:
      "Yes. Paid plans support password-protected galleries visible only to your guests.",
  },
];

export const organizationFeatures: AllYouNeedItem[] = [
  { icon: QrCode, title: "No app required", text: "Attendees join by scanning a code or opening a link — nothing to install." },
  { icon: MessageSquare, title: "Captions support", text: "Guests can add a caption to any photo or video they share." },
  { icon: ShieldCheck, title: "Moderation tools", text: "Review uploads before they appear, so only the right content goes public." },
  { icon: ImageIcon, title: "Digital album", text: "Everything lands in one shared gallery, ready to browse or export." },
  { icon: Palette, title: "Branding & design", text: "Add your logo, colors, and sponsors to match your event." },
  { icon: Lock, title: "Private & secured", text: "Password-protect the gallery to keep it visible to attendees only." },
];

export const highlightIconRotation: LucideIcon[] = [
  ImageIcon,
  QrCode,
  Download,
  MessageSquare,
];
