import type { Metadata } from "next";
import BreadcrumbHero from "@/components/ui/BreadcrumbHero";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import ContactForm from "@/components/contact/ContactForm";
import CtaFinancials from "@/components/home/CtaFinancials";
import Reveal from "@/components/ui/Reveal";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Enroll Now",
  description:
    "Start your enrollment with U.S. Tax Experts and get a free, no-obligation review of your tax or accounting situation.",
};

export default function EnrollNowPage() {
  return (
    <>
      <BreadcrumbHero title="Enroll Now" />

      <section className="bg-section py-16 lg:py-25">
        <Container>
          <Reveal direction="up" className="mx-auto">
            <SectionHeading
              align="center"
              title="Start Your Enrollment"
              subtitle="Tell us a bit about your situation below. There's no cost and no obligation to move forward."
            />
            <div className="mt-10 w-full overflow-hidden rounded-2xl">
  <iframe
    src="https://calendly.com/ustaxexperts"
    className="block w-full border-0"
    style={{
      height: "1000px",
    }}
    title="Schedule an appointment"
  />
</div>
          </Reveal>
        </Container>
      </section>


      <CtaFinancials />
    </>
  );
}
