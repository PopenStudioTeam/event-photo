import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/legal-page-layout";

export const metadata: Metadata = {
  title: "Data Processing Agreement — Event Photo",
  description:
    "How Event Photo processes personal data on behalf of organizers.",
};

export default function DataProcessingAgreementPage() {
  return (
    <LegalPageLayout
      title="Data Processing Agreement"
      effectiveDate="[Effective Date]"
      intro={[
        "This Data Processing Agreement (“DPA”) forms part of the agreement between [Your Company Name] (“Processor,” “we,” “us”) and the organizer using Event Photo to run an event (“Controller,” “you”).",
        "It describes how we process personal data on your behalf when your guests upload photos, videos, and messages to your event gallery.",
      ]}
      sections={[
        {
          heading: "Purpose and Scope",
          paragraphs: [
            "This DPA applies whenever we process personal data on your behalf as part of providing the Services, including guest names, uploaded media, and any messages or captions guests choose to include.",
          ],
        },
        {
          heading: "Definitions",
          bullets: [
            "“Personal Data” has the meaning given in applicable data protection law (e.g. GDPR, CCPA).",
            "“Processing” means any operation performed on Personal Data, such as collection, storage, or deletion.",
            "“Sub-processor” means any third party we engage to process Personal Data on our behalf.",
          ],
        },
        {
          heading: "Roles of the Parties",
          paragraphs: [
            "For Personal Data uploaded by your guests to your event, you act as the Controller and we act as the Processor. We process this data only on your documented instructions, as reflected in your event's settings (for example, moderation and password protection).",
          ],
        },
        {
          heading: "Our Obligations as Processor",
          bullets: [
            "Process Personal Data only as necessary to provide the Services or as instructed by you.",
            "Ensure personnel who access Personal Data are bound by confidentiality obligations.",
            "Implement appropriate technical and organizational security measures.",
            "Assist you in responding to data subject requests relating to your event.",
            "Notify you without undue delay after becoming aware of a Personal Data breach affecting your event.",
          ],
        },
        {
          heading: "Sub-processors",
          paragraphs: [
            "You authorize us to engage the following categories of Sub-processors to help operate the Services. We remain responsible for their compliance with this DPA.",
          ],
          bullets: [
            "Cloud storage provider — stores uploaded photos and videos.",
            "Payment processor — handles payment for paid event plans.",
            "[Your Database Host] — stores event and account records.",
            "[Any additional Sub-processor you use, e.g. email delivery or support chat]",
          ],
        },
        {
          heading: "International Transfers",
          paragraphs: [
            "If Personal Data is transferred outside the region where your guests are located, we will rely on an appropriate transfer mechanism, such as Standard Contractual Clauses, where required by applicable law.",
          ],
        },
        {
          heading: "Data Subject Requests",
          paragraphs: [
            "If we receive a request directly from one of your guests relating to their Personal Data, we will forward it to you promptly and provide reasonable assistance in responding.",
          ],
        },
        {
          heading: "Return or Deletion of Data",
          paragraphs: [
            "Upon deletion of your event, or upon request, we will delete the associated Personal Data within a reasonable period, except where we are required to retain it by law.",
          ],
        },
        {
          heading: "Term and Termination",
          paragraphs: [
            "This DPA remains in effect for as long as we process Personal Data on your behalf under the Terms of Use, and terminates automatically when that processing ends.",
          ],
        },
        {
          heading: "Contact",
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
