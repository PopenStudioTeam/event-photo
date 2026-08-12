import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/legal-page-layout";

export const metadata: Metadata = {
  title: "Privacy Policy — Event Photo",
  description: "How Event Photo collects, uses, and protects your data.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      effectiveDate="[Effective Date]"
      intro={[
        "[Your Company Name] (“we,” “us,” or “our”) operates Event Photo. We are committed to protecting your privacy and explaining, in plain terms, how we collect, use, store, and share data when you use our services.",
        "Please read this Privacy Policy alongside our Terms of Use. If you have any questions or concerns, contact us at [support email]. If you do not agree with this Policy, please do not use our services.",
      ]}
      keyPoints={[
        "We keep your data safe and secure.",
        "We do not sell your personal data.",
        "You are responsible for making sure any media you upload is safe, appropriate, and lawful to share.",
      ]}
      sections={[
        {
          heading: "Definitions",
          bullets: [
            "“Services” means Event Photo's platform features, including event galleries, guest uploads, live slideshows, and related tools.",
            "“Personal Data” means data that identifies you as a person (e.g. name, email, uploaded content).",
            "“Guest” means someone who uploads photos or videos to an event gallery without creating an account.",
            "“Organizer” means someone who creates and manages an event on Event Photo.",
            "“Processor” means a third party that processes data on our behalf.",
          ],
        },
        {
          heading: "What Data We Collect",
          subsections: [
            {
              heading: "Personal data you provide",
              bullets: [
                "Name and email address (organizers on sign-up; guests optionally, when uploading)",
                "Uploaded content (photos, videos, captions, and messages)",
                "Payment details, processed directly by our payment processor — we do not store full card numbers",
              ],
            },
            {
              heading: "Data collected automatically",
              bullets: [
                "IP address and approximate location",
                "Browser and device information",
                "Pages visited and actions taken within the product",
              ],
            },
          ],
          paragraphs: [
            "We use cookies and similar technologies to keep you signed in and to understand how our product is used. You can disable cookies in your browser, though this may affect some functionality.",
          ],
        },
        {
          heading: "Subprocessors We Use",
          paragraphs: [
            "We rely on a small number of trusted third parties to operate Event Photo. Each is bound by its own data protection terms.",
          ],
          bullets: [
            "Cloudflare R2 — used for storing uploaded photos and videos.",
            "Stripe — used for processing payments for paid plans.",
            "Google — used to offer sign-in with a Google account.",
            "[Your Database Host] — used for storing event and account records.",
            "[Any additional vendor, e.g. email delivery, analytics, or support chat provider]",
          ],
        },
        {
          heading: "Children's Privacy",
          paragraphs: [
            "Event Photo is intended for organizers who have reached the age of majority in their jurisdiction. We do not knowingly collect personal data directly from children. Guest uploads at family events may incidentally include photos of children shared by an adult organizer or guest, who is responsible for having appropriate permission to share them.",
          ],
        },
        {
          heading: "How We Protect and Store Your Data",
          paragraphs: [
            "Your data is stored on [hosting provider/region] and encrypted in transit. We use industry-standard access controls to limit who can view stored data.",
            "Please refer to our Data Processing Agreement for more detail on how data is handled on behalf of organizers.",
          ],
        },
        {
          heading: "Your Rights",
          paragraphs: [
            "Depending on where you live, you may have rights over your personal data, including the right to access, correct, delete, or export it, and to object to or restrict certain processing.",
            "To exercise any of these rights, contact us at [support email]. We will respond within the timeframe required by applicable law.",
          ],
          subsections: [
            {
              heading: "GDPR (EU/UK users)",
              bullets: [
                "Right to restrict processing",
                "Right to withdraw consent for consent-based processing",
                "Right to lodge a complaint with a supervisory authority",
              ],
            },
            {
              heading: "CCPA (California users)",
              bullets: [
                "Right to know what personal information is collected and how it's used",
                "Right to delete personal information",
                "Right to opt out of the sale of personal information (we do not sell personal information)",
                "Right to non-discrimination for exercising these rights",
              ],
            },
          ],
        },
        {
          heading: "Data Retention",
          paragraphs: [
            "We retain event data according to your plan and usage. If an event's storage period expires, we will notify the organizer by email before deleting the associated media.",
            "You may request deletion of your event and its data at any time from your dashboard, or by contacting us.",
          ],
        },
        {
          heading: "Changes to This Policy",
          paragraphs: [
            "We may update this Privacy Policy from time to time. If we make material changes, we will notify organizers by email or through a notice on the website.",
          ],
        },
        {
          heading: "Contact Us",
          paragraphs: [
            "For any questions, concerns, or privacy-related requests, contact:",
          ],
          bullets: [
            "[Your Company Name]",
            "Email: [support email]",
            "Address: [Your Company Address]",
          ],
        },
      ]}
    />
  );
}
