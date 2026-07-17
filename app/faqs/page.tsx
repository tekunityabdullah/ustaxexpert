import type { Metadata } from "next";
import { faqs } from "@/lib/faqs";
import BreadcrumbHero from "@/components/ui/BreadcrumbHero";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import FaqAccordion from "@/components/faqs/FaqAccordion";
import CtaFinancials from "@/components/home/CtaFinancials";

export const metadata: Metadata = {
  title: "FAQs",
  description:
    "Answers to common questions about IRS tax debt relief, consultations, timelines, and how U.S. Tax Experts works with clients nationwide.",
};

export default function FaqsPage() {
  return (
    <>
      <BreadcrumbHero title="FAQs" />

      <section className="py-16 lg:py-25">
        <Container>
          <SectionHeading
            align="center"
            title="Frequently Asked Questions"
            subtitle="Have a question that isn't answered here? Reach out and our team will get back to you directly."
          />
          <div className="mx-auto mt-12 max-w-3xl">
            <FaqAccordion faqs={faqs} />
          </div>
        </Container>
      </section>

      <CtaFinancials />
    </>
  );
}
