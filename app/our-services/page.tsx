import type { Metadata } from "next";
import { services } from "@/lib/services";
import BreadcrumbHero from "@/components/ui/BreadcrumbHero";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import ServiceCard from "@/components/services/ServiceCard";
import CtaFinancials from "@/components/home/CtaFinancials";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Explore U.S. Tax Experts' full range of services: tax planning & preparation, bookkeeping, accounting, tax settlement, and tax debt relief.",
};

export default function OurServicesPage() {
  return (
    <>
      <BreadcrumbHero title="Our Services" />

      <section className="py-16 lg:py-25">
        <Container>
          <SectionHeading
            align="center"
            title="Comprehensive Tax and Accounting Services"
            subtitle="We provide a full range of services designed to resolve IRS tax issues and keep your finances on track. From tax debt relief and settlement, to bookkeeping, accounting, and tax planning, our team delivers personalized solutions tailored to your unique needs."
          />
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </Container>
      </section>

      <CtaFinancials />
    </>
  );
}
