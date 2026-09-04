import type { Metadata } from "next";
import { Camera, MessageSquare, MessageSquareOff, MonitorPlay, PiggyBank, QrCode } from "lucide-react";
import { QrCodeLandingPage } from "@/components/qr-code-landing-page";
import { allYouNeedFeatures, defaultTestimonials } from "@/lib/marketing-content";

export const metadata: Metadata = {
  title: "QR Code for Wedding Pictures — Event Photo",
  description:
    "Collect every wedding photo and video from your guests with a simple QR code — no apps needed.",
};

export default function QrCodeForWeddingPicturesPage() {
  return (
    <QrCodeLandingPage
      headline="QR Code for Wedding Pictures Made Simple."
      subheadline="Effortlessly collect every guest photo and video from your wedding into a digital album guests can add to using a QR code — no apps needed, no photos left behind."
      heroImageLabel="Photo/video: printed welcome sign with names + QR code, next to a phone mockup showing the upload screen"
      processSteps={[
        {
          number: "1",
          title: "Create your wedding album",
          text: "Set up your gallery in under two minutes.",
        },
        {
          number: "2",
          title: "Share your QR code",
          text: "Print it on cards, or display it at your reception.",
        },
        {
          number: "3",
          title: "Watch memories arrive",
          text: "Every guest upload lands in your gallery instantly.",
        },
      ]}
      featuresHeading="QR Code for Wedding Pictures That Capture Every Moment"
      featuresSubtext="Stop chasing after your wedding photos. Collect photos, videos, and wishes from guests in a digital album accessible via a QR code or link."
      featuresMockupLabel="Screenshot: shared wedding gallery on a phone, plus a QR code overlay"
      features={[
        {
          icon: Camera,
          title: "Guests Photos & Videos",
          text: "Experience your wedding through every angle — guests add candid photos and videos as the day unfolds.",
        },
        {
          icon: QrCode,
          title: "Easy QR Code Access",
          text: "Guests join by scanning a code straight from their phone. No app downloads or registrations — the link is all they need.",
        },
        {
          icon: MessageSquare,
          title: "Text Posts & Captions",
          text: "Guests can leave a note or well-wish alongside anything they share.",
        },
        {
          icon: MonitorPlay,
          title: "Live Slideshow",
          text: "Show every upload updated live on a screen at the reception.",
        },
      ]}
      howItWorksHeading="How does it work?"
      howItWorksSubtext="Hassle-free wedding photo sharing — for you and your guests."
      howItWorksSteps={[
        {
          title: "Create your wedding album",
          description:
            "Set up a shared digital album for guests to add photos, videos, and messages to. Customize the cover, style, and colors to make it your own.",
          imageLabel: "Screenshot: wedding album creation form (names, date, cover)",
          cta: { label: "Create Your Wedding Album", href: "/dashboard" },
        },
        {
          title: "Share it with your guests",
          description:
            "Guests can easily add their photos and videos to your digital album by scanning the unique QR code, or using the shared link — before, during, and after your wedding.",
          bullets: [
            "Share a link through email, SMS, or chat apps",
            "Share a QR code on printed cards or signs",
            "No app downloads, no registrations needed",
          ],
          imageLabel: "Photo: welcome sign + QR code card",
        },
        {
          title: "Display it all on a live slideshow",
          optionalLabel: "Optional",
          description:
            "Bring the gallery to life on a screen at your wedding — new uploads appear automatically as guests add them.",
          note: { label: "See live example", href: "/stories" },
          imageType: "video",
          imageLabel: "Photo/video: reception screen showing a live wedding photo wall",
        },
        {
          title: "Enjoy all captured moments",
          description:
            "Every guest moment is captured in one shared album, organized and ready to relive.",
          bullets: [
            "Every moment is captured in one shared gallery",
            "Download everything in a single click, in original quality",
          ],
          cta: { label: "Create Your Wedding Album", href: "/dashboard" },
          imageLabel: "Screenshot: finished wedding gallery with guest uploads",
        },
      ]}
      allYouNeedHeading="More Than Just a QR Code For Wedding Pictures"
      allYouNeedSubtext="Wedding guest photo sharing with a digital album, live slideshow, QR code templates, and more — it's all done for you."
      allYouNeedItems={allYouNeedFeatures}
      whyChooseHeading="Why Choose QR Code For Wedding Pictures?"
      whyChooseSubtext="QR code for wedding pictures captures every special moment, giving you a simple and effective way for guests to share memories from every angle."
      whyChooseReasons={[
        {
          icon: Camera,
          title: "Every Guest Is a Photographer",
          text: "Your photographer can't be everywhere — a QR code turns every guest into a second photographer capturing their own angle.",
        },
        {
          icon: MessageSquareOff,
          title: "Say Goodbye To Photo Chasing",
          text: "No more asking around for photos after the big day — everything lands in one shared album automatically.",
        },
        {
          icon: PiggyBank,
          title: "Maximize Memories, Minimize Costs",
          text: "Get more coverage of your day without paying for extra photographers — guests capture what one person can't.",
        },
      ]}
      whyChooseImageLabel="Photo collage: QR code table card, phone mockup, and guest reactions"
      whyChooseCta={{ label: "Get Your Wedding Photos Now", href: "/dashboard" }}
      comparisonHeading="We take wedding pictures"
      comparisonEmphasis="seriously"
      comparisonSubtext="Don't settle for average on your big day. Pick a solution that's easy and seamless to use, so you get more photos of your wedding."
      comparisonCollageLabel="Photo collage: guest-submitted wedding photos"
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
      comparisonCta={{ label: "Collect Your Wedding Photos", href: "/dashboard" }}
      testimonialsHeading="Don't just take our word for it"
      testimonialsSubtext="We're honored to help thousands of couples make their big day more memorable."
      testimonials={defaultTestimonials}
      faqHeading="Frequently asked questions"
      faqNote="Still have questions? Chat with us via the chat bubble in the corner."
      faqs={[
        {
          question: "How do I create a QR code for my wedding pictures?",
          answer:
            "Create your wedding album, and a unique QR code is generated automatically — download and print it whenever you're ready.",
        },
        {
          question: "Can I print the QR code for wedding pictures?",
          answer:
            "Yes. Download a print-ready version of your code for table cards, signage, or invitations.",
        },
        {
          question: "Do guests need to download an app to participate?",
          answer:
            "No. Guests scan the QR code or open the shared link right in their phone's browser.",
        },
        {
          question: "Can I download all guests' photos & videos?",
          answer:
            "Premium and Pro can download the full gallery as a ZIP. Free can still download items one at a time.",
        },
        {
          question: "My wedding is more than one day — can I still use it?",
          answer:
            "Yes. There's no limit on how long a gallery stays open for guest uploads.",
        },
        {
          question: "Are my wedding photos private?",
          answer:
            "Yes. Paid plans support a password-protected gallery visible only to your guests.",
        },
        {
          question: "We already have a photographer — should we still use this?",
          answer:
            "Most couples use both — your photographer captures the posed shots, while guests capture the candid ones a single photographer can't be everywhere for.",
        },
      ]}
      statCallout={{
        quote:
          "Only about 3% of the photos and videos taken at weddings actually make their way to the couple. Strange, right?",
        description:
          "That's why Event Photo exists — to help couples collect every candid shot, not just the ones a guest happens to remember to send later. Guests get the link, and your favorite memories from the day actually reach you.",
        quoteName: "A host who's been there",
        quoteRole: "Event Photo user",
        cta: { label: "Get Your Wedding Album", href: "/dashboard" },
        mediaLabels: [
          "Photo: guest reviewing photos on their phone",
          "Photo: finished wedding album shown on a tablet",
        ],
      }}
    />
  );
}
