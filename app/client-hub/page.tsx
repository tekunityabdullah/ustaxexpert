import type { Metadata } from "next";
import { FileUp, MessageSquare, ClipboardCheck } from "lucide-react";
import BreadcrumbHero from "@/components/ui/BreadcrumbHero";
import Container from "@/components/ui/Container";
import CtaButton from "@/components/ui/CtaButton";
import IconFeatureCard from "@/components/ui/IconFeatureCard";

export const metadata: Metadata = {
  title: "Client Hub",
  description:
    "Your secure portal for document uploads, case status updates, and direct communication with your U.S. Tax Experts specialist.",
};

const perks = [
  {
    icon: FileUp,
    title: "Secure Document Upload",
    description: "Share sensitive tax documents through an encrypted portal, not email attachments.",
  },
  {
    icon: ClipboardCheck,
    title: "Real-Time Case Status",
    description: "Track exactly where your case stands with the IRS at every stage of resolution.",
  },
  {
    icon: MessageSquare,
    title: "Direct Messaging",
    description: "Message your assigned specialist directly with questions, without waiting on hold.",
  },
];

export default function ClientHubPage() {
  return (
    <>
      <BreadcrumbHero title="Client Hub" />

      <section className="py-16 lg:py-25">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-lg font-semibold text-gold-600">
              For Existing Clients
            </p>
            <h2>Your Case, Always Within Reach</h2>
            <p className="mt-5 text-body">
              The Client Hub is your secure, always-on connection to your
              case. Upload documents, track progress, and message your
              specialist directly, all in one place. Existing clients can log
              in below; if you don&rsquo;t have an account yet, reach out to
              your specialist to get set up.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <CtaButton href="/contact-us">Client Login</CtaButton>
              <CtaButton href="/contact-us" variant="outline" className="border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-white">
                Request Access
              </CtaButton>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {perks.map((perk) => (
              <IconFeatureCard key={perk.title} {...perk} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
