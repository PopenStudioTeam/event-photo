import type { Metadata } from "next";
import {
  Briefcase,
  Building2,
  Cake,
  Camera,
  Heart,
  Home,
  MapPin,
  MessageSquare,
  MessageSquareOff,
  MonitorPlay,
  PartyPopper,
  PiggyBank,
  QrCode,
} from "lucide-react";
import { QrCodeLandingPage } from "@/components/qr-code-landing-page";
import { allYouNeedFeatures, defaultTestimonials } from "@/lib/marketing-content";

export const metadata: Metadata = {
  title: "QR Code for Photo Sharing — Event Photo",
  description:
    "Gather every photo and video your guests capture into a stunning digital album using a QR code.",
};

export default function QrCodeForPhotoSharingPage() {
  return (
    <QrCodeLandingPage
      headline="QR Code for Photo Sharing Made Simple."
      subheadline="Gather every photo and video your guests capture into a stunning digital album using a QR code — no apps needed, so simple anyone can use it."
      heroImageLabel="Photo/video: printed party sign with QR code, next to a phone mockup showing the upload screen"
      processSteps={[
        {
          number: "1",
          title: "Sign up & create your event",
          text: "Set up your gallery in under two minutes.",
        },
        {
          number: "2",
          title: "Share your QR code",
          text: "Print it, send it, or display it on a screen.",
        },
        {
          number: "3",
          title: "Watch memories arrive",
          text: "Every guest upload lands in your gallery instantly.",
        },
      ]}
      featuresHeading="Turn Every Guest into a Photographer"
      featuresSubtext="Say goodbye to photo chasing. Effortlessly gather every guest-captured snap into a digital album, easily accessible through a QR code or link."
      featuresMockupLabel="Screenshot: shared event gallery on a phone, plus a QR code overlay"
      features={[
        {
          icon: Camera,
          title: "Guests Photos & Videos",
          text: "Experience your event through every angle — guests add candid photos and videos as it happens.",
        },
        {
          icon: QrCode,
          title: "Easy QR Code Access",
          text: "Guests join by scanning a code straight from their phone. No app downloads or registrations — the link is all they need.",
        },
        {
          icon: MessageSquare,
          title: "Text Posts & Captions",
          text: "Guests can leave a note or caption alongside anything they share.",
        },
        {
          icon: MonitorPlay,
          title: "Live Slideshow",
          text: "Show every upload updated live on a screen at your event.",
        },
      ]}
      howItWorksHeading="How does it work?"
      howItWorksSubtext="Hassle-free photo sharing — for you and your guests."
      howItWorksSteps={[
        {
          title: "Create your event album",
          description:
            "Set up a shared digital album for guests to add photos, videos, and messages to. Customize the cover, style, and colors to make it your own.",
          imageLabel: "Screenshot: event album creation form (name, date, cover)",
          cta: { label: "Create Your Event Album", href: "/dashboard" },
        },
        {
          title: "Share it with your guests",
          description:
            "Guests can easily add their photos and videos to your digital album by scanning the unique QR code, or using the shared link — before, during, and after your event.",
          bullets: [
            "Share a link through email, SMS, or chat apps",
            "Share a QR code on printed cards or signs",
            "No app downloads, no registrations needed",
          ],
          imageLabel: "Photo: printed sign + QR code card",
        },
        {
          title: "Display it all on a live slideshow",
          optionalLabel: "Optional",
          description:
            "Bring the gallery to life on a screen at your event — new uploads appear automatically as guests add them.",
          note: { label: "See live example", href: "/stories" },
          imageType: "video",
          imageLabel: "Photo/video: screen showing a live event photo wall",
        },
        {
          title: "Enjoy all captured moments",
          description:
            "Every guest moment is captured in one shared album, organized and ready to relive.",
          bullets: [
            "Every moment is captured in one shared gallery",
            "Download everything in a single click, in original quality",
          ],
          cta: { label: "Create Your Event Album", href: "/dashboard" },
          imageLabel: "Screenshot: finished event gallery with guest uploads",
        },
      ]}
      allYouNeedHeading="More Than Just a QR Code For Photo Sharing"
      allYouNeedSubtext="Digital album, live slideshow, QR code templates, and more — it's all done for you."
      allYouNeedItems={allYouNeedFeatures}
      whyChooseHeading="Why Choose QR Code For Photo Sharing?"
      whyChooseSubtext="QR code for photo sharing captures every special moment, giving you a simple and effective way for guests to share memories from every angle."
      whyChooseReasons={[
        {
          icon: Camera,
          title: "Every Attendee Is a Photographer",
          text: "One photographer can't be everywhere — a QR code turns every guest into a second photographer capturing their own angle.",
        },
        {
          icon: MessageSquareOff,
          title: "Say Goodbye To Photo Chasing",
          text: "No more asking around for photos after the event — everything lands in one shared album automatically.",
        },
        {
          icon: PiggyBank,
          title: "Maximize Memories, Minimize Costs",
          text: "Get more coverage of your event without paying for extra photographers — guests capture what one person can't.",
        },
      ]}
      whyChooseImageLabel="Photo collage: QR code table card, phone mockup, and guest reactions"
      whyChooseCta={{ label: "Get Your Event Photos Now", href: "/dashboard" }}
      comparisonHeading="We take event photo sharing"
      comparisonEmphasis="seriously"
      comparisonSubtext="Don't settle for average. Pick a solution that's easy and seamless to use, so you get more photos of your event."
      comparisonCollageLabel="Photo collage: guest-submitted event photos"
      comparisonOursPoints={[
        "Effortless and smooth experience",
        "Beautifully designed digital albums",
        "Fast, live uploads",
        "Unlimited guests & participants",
        "Extensive customization options",
        "Set up and go — pay only for what you use",
      ]}
      comparisonOthersPoints={[
        "Complex and tedious user interface",
        "Dated design with a generic look",
        "No live slideshow",
        "Limited guests & participants",
        "Limited or no customization",
        "Locked into a monthly plan",
      ]}
      comparisonCta={{ label: "Collect Your Event Photos", href: "/dashboard" }}
      testimonialsHeading="Don't just take our word for it"
      testimonialsSubtext="Trusted by thousands of hosts worldwide."
      testimonials={defaultTestimonials}
      occasionPillsHeading="QR code for photo sharing for any occasion"
      occasionPills={[
        { icon: Heart, label: "Weddings" },
        { icon: Cake, label: "Birthday Party" },
        { icon: Briefcase, label: "Corporate Event" },
        { icon: PartyPopper, label: "Anniversary" },
        { icon: Home, label: "Home Party" },
        { icon: Building2, label: "Company Party" },
        { icon: MapPin, label: "Off-site Event" },
      ]}
      faqHeading="Questions?"
      faqNote="Still have a question? Chat with us via the chat bubble in the corner."
      faqs={[
        {
          question: "How do I create a QR code for photo sharing?",
          answer:
            "Create your event, and a unique QR code is generated automatically — download and print it whenever you're ready.",
        },
        {
          question: "Do guests need to download an app to participate?",
          answer:
            "No. Guests scan the QR code or open the shared link right in their phone's browser.",
        },
        {
          question: "Can I download all guests' photos & videos?",
          answer:
            "Yes, at any time, in original quality, as a single download.",
        },
        {
          question: "Is it better than other photo sharing apps?",
          answer:
            "There's no guest app, no sign-up, and no monthly subscription — one payment covers the whole event.",
        },
        {
          question: "Can I print the QR code on signs?",
          answer:
            "Yes. Print-ready QR code templates are included for table cards, signage, and invitations.",
        },
        {
          question: "My event is more than one day — can I still use it?",
          answer:
            "Yes. There's no limit on how long a gallery stays open for guest uploads.",
        },
        {
          question: "Are my photos private?",
          answer:
            "Yes. Paid plans support a password-protected gallery visible only to your guests.",
        },
        {
          question: "What if an inappropriate photo is shared?",
          answer:
            "Premium and Pro plans include moderation, so uploads wait for your approval before appearing in the gallery.",
        },
      ]}
    />
  );
}
