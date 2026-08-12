import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/legal-page-layout";

export const metadata: Metadata = {
  title: "Security — Event Photo",
  description: "How Event Photo protects your data and your guests' uploads.",
};

export default function SecurityPage() {
  return (
    <LegalPageLayout
      title="Security"
      numbered={false}
      sections={[
        {
          heading: "Personnel",
          paragraphs: [
            "All contractors and team members sign confidentiality agreements before gaining access to our codebase or data. Our hiring process includes a code review, portfolio review, and interviews before anyone joins the team.",
          ],
        },
        {
          heading: "Data Access",
          paragraphs: [
            "Our infrastructure is hosted on [Your Hosting Provider]. Access to our infrastructure dashboard and data requires two-factor authentication.",
          ],
        },
        {
          heading: "Code Practices",
          paragraphs: [
            "We maintain code quality with automated tests and code review for every change. Changes go through a staging environment before being deployed to production.",
          ],
        },
        {
          heading: "End to End Encryption",
          paragraphs: [
            "Event Photo encrypts data in transit using TLS. Data at rest is encrypted using industry-standard encryption provided by [Your Hosting Provider]. You can read more in [your hosting provider's encryption documentation].",
          ],
        },
        {
          heading: "Password Encryption",
          paragraphs: [
            "Organizer passwords are stored using a secure hashing algorithm — never in plain text.",
          ],
        },
        {
          heading: "Payments",
          paragraphs: [
            "Payments are processed by Stripe, our third-party payment provider. We do not store full billing details on our servers. Stripe is PCI-DSS compliant — you can read more in [Stripe's security documentation].",
          ],
        },
        {
          heading: "Data center and backups",
          subsections: [
            {
              heading: "Data Center",
              paragraphs: [
                "Event Photo is hosted on [Your Hosting Provider / Region]. You can read more about their security practices in [your provider's security overview].",
              ],
            },
            {
              heading: "Physical Access Control",
              paragraphs: [
                "Physical security for our infrastructure is handled by [Your Hosting Provider], who maintain their own data center access controls.",
              ],
            },
            {
              heading: "Backups",
              paragraphs: [
                "We run [backup frequency] backups. Backups are encrypted and retained for [retention period] before being deleted.",
              ],
            },
          ],
        },
        {
          heading: "Data privacy",
          subsections: [
            {
              heading: "Data Belongs to You",
              paragraphs: [
                "We believe your data belongs to you. You can modify, export, or delete it whenever you want. Read more about what data we collect and how we use it in our [Privacy Policy](/privacy-policy).",
              ],
            },
          ],
        },
        {
          heading: "Availability and business continuity",
          subsections: [
            {
              heading: "Availability",
              paragraphs: [
                "We aim for high availability by relying on [Your Hosting Provider]'s infrastructure. [Link to your provider's live status page, if you publish one.]",
              ],
            },
            {
              heading: "Attack Prevention & Mitigation",
              paragraphs: [
                "[Describe the specific protections you have in place once confirmed — for example rate limiting, a web application firewall, or DDoS protection from your hosting or CDN provider.]",
              ],
            },
            {
              heading: "Security Incidents",
              paragraphs: [
                "Have you noticed any abuse, a bug, or a security issue? Please report it to [support email]. In the event of a security incident, we will contact affected customers and work with you throughout.",
              ],
            },
            {
              heading: "Business Continuity",
              paragraphs: [
                "We keep [backup frequency] encrypted backups. In the case of production data loss, we would restore from these backups.",
              ],
            },
          ],
        },
      ]}
    />
  );
}
