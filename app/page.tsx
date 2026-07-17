import Hero from "@/components/home/Hero";
import AboutIntro from "@/components/home/AboutIntro";
import ServiceTabs from "@/components/home/ServiceTabs";
import HoverVideoSplit from "@/components/home/HoverVideoSplit";
import Testimonials from "@/components/home/Testimonials";
import CtaFinancials from "@/components/home/CtaFinancials";
import SectionHeading from "@/components/ui/SectionHeading";
import Container from "@/components/ui/Container";

export default function Home() {
  return (
    <>
      <Hero />
      <AboutIntro />

      <section className="py-16 lg:py-25">
        <Container>
          <SectionHeading
            align="center"
            title="Comprehensive Tax and Accounting Services"
            subtitle="We provide a full range of services designed to resolve IRS tax issues and keep your finances on track. From tax debt relief and settlement, to bookkeeping, accounting, and tax planning, our team delivers personalized solutions tailored to your unique needs."
          />
          <div className="mt-12">
            <ServiceTabs />
          </div>
        </Container>
      </section>

      <HoverVideoSplit />

      <section className="py-16 lg:py-25">
        <Container>
          <SectionHeading align="center" title="What Our Clients Are Saying" />
          <div className="mt-10">
            <Testimonials />
          </div>
        </Container>
      </section>

      <CtaFinancials />
    </>
  );
}
