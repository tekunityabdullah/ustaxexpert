import type { Metadata } from "next";
import { getFaqs } from "@/lib/faqs";
import BreadcrumbHero from "@/components/ui/BreadcrumbHero";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import FaqAccordion from "@/components/faqs/FaqAccordion";
import CtaFinancials from "@/components/home/CtaFinancials";
import Reveal from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "FAQs",
  description:
    "Answers to common questions about IRS tax debt relief, consultations, timelines, and how U.S. Tax Experts works with clients nationwide.",
};

export default async function FaqsPage() {
  const faqs = await getFaqs();

  return (
    <>
      <BreadcrumbHero title="FAQs" />

      <section className="py-16 lg:py-25">
        <Container>
          <Reveal direction="up">
            <SectionHeading
              align="center"
              title="Frequently Asked Questions"
              subtitle="Have a question that isn't answered here? Reach out and our team will get back to you directly."
            />
          </Reveal>
          <div className="mt-12">
            <FaqAccordion faqs={faqs} />
          </div>
        </Container>
      </section>

      <CtaFinancials />
    </>
  );
}
