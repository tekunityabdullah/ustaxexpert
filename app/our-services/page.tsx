import type { Metadata } from "next";
import { getServices } from "@/lib/services";
import BreadcrumbHero from "@/components/ui/BreadcrumbHero";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import ServiceCard from "@/components/services/ServiceCard";
import CtaFinancials from "@/components/home/CtaFinancials";
import Reveal from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Explore U.S. Tax Experts' full range of services: tax planning & preparation, bookkeeping, accounting, tax settlement, and tax debt relief.",
};

export default async function OurServicesPage() {
  const services = await getServices();

  return (
    <>
      <BreadcrumbHero title="Our Services" />

      <section className="py-16 lg:py-25">
        <Container>
          <Reveal direction="up">
            <SectionHeading
              align="center"
              title="Comprehensive Tax and Accounting Services"
              subtitle="We provide a full range of services designed to resolve IRS tax issues and keep your finances on track. From tax debt relief and settlement, to bookkeeping, accounting, and tax planning, our team delivers personalized solutions tailored to your unique needs."
            />
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <Reveal key={service.slug} direction="up" delay={(index % 3) * 0.1}>
                <ServiceCard service={service} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <CtaFinancials />
    </>
  );
}
