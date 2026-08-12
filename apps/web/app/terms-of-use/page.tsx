import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/legal-page-layout";

export const metadata: Metadata = {
  title: "Terms of Use — Event Photo",
  description: "The terms that govern your use of Event Photo.",
};

export default function TermsOfUsePage() {
  return (
    <LegalPageLayout
      title="Terms of Use"
      effectiveDate="[Effective Date]"
      intro={[
        "Welcome to Event Photo, a platform operated by [Your Company Name] (“we,” “us,” or “Event Photo”) that lets organizers create shared event galleries and collect photos and videos from guests.",
        "Please read these Terms carefully before using the Services. By accessing or using Event Photo, you agree to be bound by these Terms. If you do not agree, please do not use the Services.",
      ]}
      sections={[
        {
          heading: "General",
          paragraphs: [
            "If you are agreeing to these Terms on behalf of an organization, you represent that you have the authority to bind that organization.",
            "You must be at least 18 years old, or have permission from a parent or guardian, to create an account and use the Services as an organizer.",
          ],
        },
        {
          heading: "Right to Use the Services",
          paragraphs: [
            "We grant you a limited, non-exclusive, non-transferable right to access and use the Services for their intended purpose.",
          ],
          bullets: [
            "You may not use the Services to build a competing product.",
            "You may not attempt to disrupt, overload, or gain unauthorized access to the Services.",
            "You may not use the Services for any unlawful purpose.",
          ],
        },
        {
          heading: "Registration and Accounts",
          paragraphs: [
            "Organizers must provide accurate information when creating an account, including a valid email address. You are responsible for keeping your login credentials secure and for all activity under your account.",
            "Guests can upload to an event gallery without creating an account, subject to any settings the organizer has configured (such as password protection).",
          ],
        },
        {
          heading: "User Content",
          paragraphs: [
            "You retain ownership of the photos, videos, captions, and other content you upload (“User Content”). By uploading User Content, you grant us a license to host, store, and display it as part of operating the Services for your event.",
            "You are solely responsible for your User Content. You confirm that you have the right to share it, and that it does not violate any law or infringe anyone else's rights (including privacy, publicity, or intellectual property rights).",
            "We may remove User Content that violates these Terms or applicable law, or that we're required to remove by a legal request.",
          ],
        },
        {
          heading: "Charges and Payments",
          paragraphs: [
            "Certain features require a one-time payment per event, as described on our Pricing page. Fees are non-refundable except as described in our refund policy or as required by law.",
            "We may change our pricing for new purchases at any time; changes will not affect an event you've already paid for.",
          ],
        },
        {
          heading: "Third-Party Providers",
          paragraphs: [
            "The Services rely on third-party infrastructure providers (for example, cloud storage and payment processing) to operate. We are not responsible for outages or issues caused by these third parties, though we will work to minimize any impact on you.",
          ],
        },
        {
          heading: "Proprietary Rights",
          paragraphs: [
            "Event Photo and its underlying technology, design, and branding are owned by [Your Company Name]. Nothing in these Terms transfers any of our intellectual property rights to you.",
          ],
        },
        {
          heading: "Disclaimers",
          paragraphs: [
            "THE SERVICES ARE PROVIDED “AS IS” WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT, TO THE FULLEST EXTENT PERMITTED BY LAW.",
          ],
        },
        {
          heading: "Limitation of Liability",
          paragraphs: [
            "TO THE FULLEST EXTENT PERMITTED BY LAW, [YOUR COMPANY NAME] WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES ARISING FROM YOUR USE OF THE SERVICES. OUR TOTAL LIABILITY FOR ANY CLAIM WILL NOT EXCEED THE AMOUNT YOU PAID US IN THE 12 MONTHS BEFORE THE CLAIM AROSE.",
          ],
        },
        {
          heading: "Termination",
          paragraphs: [
            "We may suspend or terminate access to the Services for any account that violates these Terms. You may stop using the Services, or delete your account and event data, at any time.",
          ],
        },
        {
          heading: "Changes to These Terms",
          paragraphs: [
            "We may update these Terms from time to time. If we make material changes, we will notify you by email or through a notice on the website at least [7] days before they take effect.",
          ],
        },
        {
          heading: "Governing Law",
          paragraphs: [
            "These Terms are governed by the laws of [Your Governing Jurisdiction], without regard to conflict-of-law principles.",
          ],
          bullets: [
            "[Your Company Name]",
            "Address: [Your Company Address]",
            "Email: [support email]",
          ],
        },
      ]}
    />
  );
}
