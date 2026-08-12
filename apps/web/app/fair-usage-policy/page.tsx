import type { Metadata } from "next";
import { PolicyStatementPage } from "@/components/legal/policy-statement-page";

export const metadata: Metadata = {
  title: "Fair Usage Policy — Event Photo",
  description: "The fair usage terms that keep Event Photo running smoothly for everyone.",
};

export default function FairUsagePolicyPage() {
  return (
    <PolicyStatementPage
      title="Fair Usage Policy"
      content={[
        {
          type: "paragraph",
          text: "We at Event Photo are on a mission to make event photo sharing better for everyone. To keep our services running smoothly for all our customers, you must comply with the following fair usage policies:",
        },
        {
          type: "list",
          items: [
            "It's your responsibility to make sure every photo or video uploaded to your gallery is safe, appropriate, and complies with any applicable law and commercial trademarks.",
            "Event Photo's sole purpose is to store media captured for an event run on Event Photo. It is not intended to be used as an all-purpose cloud drive (like Google Drive, Dropbox, etc.).",
            "Plans described as unlimited are subject to a fair usage policy, limited to [X] media uploads and [X] participants per event. If you need more than that, please contact us so we can adjust the limits.",
            "Our team may adjust, restrict, or remove any event or account that violates this policy without prior notice.",
          ],
        },
        {
          type: "paragraph",
          text: "Please don't hesitate to contact us with any questions regarding your event.",
        },
      ]}
      signatureName="Event Photo Team"
      signatureEmail="[support email]"
    />
  );
}
