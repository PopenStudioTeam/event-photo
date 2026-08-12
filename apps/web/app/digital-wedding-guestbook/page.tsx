import type { Metadata } from "next";
import { BookHeart, Camera, Download, QrCode } from "lucide-react";
import { UseCasePage } from "@/components/use-case-page";
import type { UseCase } from "@/lib/use-cases-data";

export const metadata: Metadata = {
  title: "Digital Wedding Guestbook — Event Photo",
  description:
    "Collect photos, videos, and wishes from your wedding guests in one shared digital guestbook.",
};

const guestbookUseCase: UseCase = {
  slug: "digital-wedding-guestbook",
  navLabel: "Weddings",
  heroLabel: "For wedding guestbooks",
  icon: BookHeart,
  headline: "A digital guestbook for modern couples.",
  subheadline:
    "Collect photos, videos, and wishes from your wedding guests in one shared keepsake album.",
  description:
    "Instead of a paper guestbook that sits in a drawer, give guests a QR code that turns every phone into a camera and every message into part of your keepsake album.",
  accent: "#ffe6ef",
  features: [
    {
      title: "Photos, videos, and notes",
      text: "Guests can leave a written wish alongside any photo or video they share.",
    },
    {
      title: "One code, no pen required",
      text: "Skip the paper guestbook — everyone contributes from their own phone.",
    },
    {
      title: "A keepsake you keep",
      text: "Download every photo, video, and message in one place after the big day.",
    },
  ],
  howItWorks: [
    {
      icon: BookHeart,
      title: "Create your digital guestbook",
      text: "Set it up with your names, wedding date, and a cover that matches your day.",
    },
    {
      icon: QrCode,
      title: "Print the code on a guestbook table sign",
      text: "Guests scan it in place of signing a paper book — no app required.",
    },
    {
      icon: Camera,
      title: "Guests leave photos, videos, and wishes",
      text: "Every message and moment lands in the same shared album, all night long.",
    },
    {
      icon: Download,
      title: "Keep the whole guestbook afterward",
      text: "Download every photo, video, and note in one place, whenever you're ready.",
    },
  ],
};

export default function DigitalWeddingGuestbookPage() {
  return <UseCasePage useCase={guestbookUseCase} />;
}
