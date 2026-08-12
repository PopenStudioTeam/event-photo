import type { Metadata } from "next";
import { PolicyStatementPage } from "@/components/legal/policy-statement-page";

export const metadata: Metadata = {
  title: "Fair Refund Policy — Event Photo",
  description: "How refunds work if Event Photo isn't the right fit for your event.",
};

export default function FairRefundPolicyPage() {
  return (
    <PolicyStatementPage
      title="Fair Refund Policy"
      subtext="Learn more about how our refund process works."
      content={[
        {
          type: "paragraph",
          text: "Happy customers mean everything to us. That's why we offer a money-back guarantee if you end up not using Event Photo for your event, for whatever reason — according to our fair refund policy.",
        },
        {
          type: "badge",
          label: "Graphic: money-back guarantee seal/badge",
        },
        {
          type: "paragraph",
          text: "To request a refund, email us or reach out through the chat bubble in the corner.",
        },
      ]}
      signatureName="Event Photo Team"
      signatureEmail="[support email]"
    />
  );
}
