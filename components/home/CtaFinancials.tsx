import { ExternalLink, Flag, Network } from "lucide-react";
import BookConsultationButton from "@/components/ui/BookConsultationButton";
import CtaButton from "@/components/ui/CtaButton";
import IconFeatureCard from "@/components/ui/IconFeatureCard";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import { BASE_PATH } from "@/lib/site-config";

const items = [
  {
    icon: ExternalLink,
    title: "Free Consultations",
    description:
      "Get started with a no-cost consultation to review your tax situation and explore tailored solutions.",
  },
  {
    icon: Flag,
    title: "Nationwide Service",
    description:
      "We assist clients in all 50 states, ensuring professional support and guidance wherever you are located.",
  },
  {
    icon: Network,
    title: "Proven Expertise",
    description:
      "Our experienced team has successfully resolved tax debt and accounting challenges for countless clients.",
  },
];

export default function CtaFinancials() {
  return (
    <section
      className="bg-cover bg-center bg-no-repeat py-16 lg:py-25"
      style={{ backgroundImage: `url('${BASE_PATH}/images/Group-348157845.png')` }}
    >
      <Container>
        <Reveal direction="up" className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <h2 className="text-white">Start Your Path to Financial Freedom</h2>
            <p className="mt-4 text-white/90">
              Take control of your taxes today with the trusted guidance of
              U.S. Tax Experts. Our team is ready to provide personalized
              solutions, protect your assets, and help you achieve long-term
              peace of mind.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <BookConsultationButton>Book Consultation</BookConsultationButton>
            <CtaButton href="/make-a-payment" variant="outline">
              Make a Payment
            </CtaButton>
          </div>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {items.map((item, index) => (
            <Reveal key={item.title} direction="up" delay={index * 0.1}>
              <IconFeatureCard {...item} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
