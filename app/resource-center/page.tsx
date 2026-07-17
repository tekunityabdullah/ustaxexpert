import type { Metadata } from "next";
import { BookOpen, FileText, Calculator, Newspaper } from "lucide-react";
import BreadcrumbHero from "@/components/ui/BreadcrumbHero";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import CtaFinancials from "@/components/home/CtaFinancials";

export const metadata: Metadata = {
  title: "Resource Center",
  description:
    "Guides, IRS forms, calculators, and insights to help you understand your tax situation and make informed financial decisions.",
};

const resources = [
  {
    icon: BookOpen,
    title: "Tax Guides",
    description:
      "Plain-language guides that walk you through IRS notices, tax debt programs, and what to expect at each stage of resolution.",
  },
  {
    icon: FileText,
    title: "IRS Forms & Publications",
    description:
      "Quick access to the most commonly requested IRS forms, with notes on how and when each one applies to your case.",
  },
  {
    icon: Calculator,
    title: "Financial Calculators",
    description:
      "Estimate potential penalties, interest, and payment plan options before your consultation so you know what to expect.",
  },
  {
    icon: Newspaper,
    title: "Blog & Insights",
    description:
      "Ongoing updates on IRS policy changes, tax season deadlines, and strategies for staying ahead of your obligations.",
  },
];

export default function ResourceCenterPage() {
  return (
    <>
      <BreadcrumbHero title="Resource Center" />

      <section className="py-16 lg:py-25">
        <Container>
          <SectionHeading
            align="center"
            title="Tools and Guidance to Help You Stay Informed"
            subtitle="Our Resource Center is growing — here's what you can expect to find as we roll out new guides, tools, and updates. In the meantime, our team is happy to answer any questions directly."
          />

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {resources.map((resource) => {
              const Icon = resource.icon;
              return (
                <div
                  key={resource.title}
                  className="rounded-lg border border-black/10 bg-white p-7"
                >
                  <span className="bg-gold-gradient mb-5 flex h-14 w-14 items-center justify-center rounded-lg">
                    <Icon size={24} className="text-navy-ink" />
                  </span>
                  <h4 className="mb-2">{resource.title}</h4>
                  <p className="text-[15px] leading-relaxed text-muted">
                    {resource.description}
                  </p>
                  <span className="mt-4 inline-block text-xs font-semibold uppercase tracking-wide text-gold-600">
                    Coming Soon
                  </span>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <CtaFinancials />
    </>
  );
}
