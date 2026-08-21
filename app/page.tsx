import Hero from "@/components/home/Hero";
import AboutIntro from "@/components/home/AboutIntro";
import ServiceTabs from "@/components/home/ServiceTabs";
import HoverVideoSplit from "@/components/home/HoverVideoSplit";
import TrustSignals from "@/components/home/TrustSignals";
import Testimonials from "@/components/home/Testimonials";
import CtaFinancials from "@/components/home/CtaFinancials";
import SectionHeading from "@/components/ui/SectionHeading";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import { getServices } from "@/lib/services";
import { getTestimonials } from "@/lib/testimonials";

export default async function Home() {
  const [services, testimonials] = await Promise.all([getServices(), getTestimonials()]);

  return (
    <>
      <Hero />
      <AboutIntro />

      <section className="py-16 lg:py-25">
        <Container>
          <Reveal direction="up">
            <SectionHeading
              align="center"
              title="Comprehensive Tax and Accounting Services"
              subtitle="We provide a full range of services designed to resolve IRS tax issues and keep your finances on track. From tax debt relief and settlement, to bookkeeping, accounting, and tax planning, our team delivers personalized solutions tailored to your unique needs."
            />
          </Reveal>
          <Reveal direction="up" delay={0.15} className="mt-12">
            <ServiceTabs services={services} />
          </Reveal>
        </Container>
      </section>

      <HoverVideoSplit />

      <section className="py-16 lg:py-25">
        <Container>
          <Reveal direction="up">
            <SectionHeading align="center" title="What Our Clients Are Saying" />
          </Reveal>
          <Reveal direction="up" delay={0.15} className="mt-10">
            <Testimonials testimonials={testimonials} />
          </Reveal>
        </Container>
      </section>

      <CtaFinancials />
    </>
  );
}
