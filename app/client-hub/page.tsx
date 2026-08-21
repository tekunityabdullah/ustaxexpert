import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import BreadcrumbHero from "@/components/ui/BreadcrumbHero";
import Container from "@/components/ui/Container";
import CtaButton from "@/components/ui/CtaButton";
import Reveal from "@/components/ui/Reveal";
import CtaFinancials from "@/components/home/CtaFinancials";

export const metadata: Metadata = {
  title: "Client Hub",
  description:
    "Your secure portal for document uploads, case status updates, and direct communication with your U.S. Tax Experts specialist.",
};

export default function ClientHubPage() {
  return (
    <>
      <BreadcrumbHero title="Client Hub" />

      <section className="py-16 lg:py-25">
        <Container>
          <Reveal direction="up" className="mx-auto max-w-2xl text-center">
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
              <CtaButton href="https://ustaxexperts.smartvault.com">Client Login</CtaButton>
              <CtaButton href="/contact-us" variant="outline-navy">
                Request Access
              </CtaButton>
            </div>
            <p className="mt-4 flex items-center justify-center gap-2 text-sm text-muted">
              <ShieldCheck size={16} className="text-gold-600" />
              Protected by Multi-Factor Authentication
            </p>
          </Reveal>
        </Container>
      </section>

      <CtaFinancials />
    </>
  );
}
