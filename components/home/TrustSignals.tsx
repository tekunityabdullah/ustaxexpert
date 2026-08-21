import { ShieldCheck, Lock, BadgeCheck, FileCheck2 } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import IconFeatureCard from "@/components/ui/IconFeatureCard";
import AccreditationsStrip from "@/components/ui/AccreditationsStrip";
import { trustBadges } from "@/lib/trust";

const icons = { ShieldCheck, Lock, BadgeCheck, FileCheck2 };

export default function TrustSignals() {
  return (
    <section className="bg-section py-16 lg:py-25">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Security & Trust"
          title="Your Information, Protected Every Step of the Way"
          subtitle="We know how sensitive tax and financial information is. Here's how we keep your data and your case secure."
        />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trustBadges.map((badge) => (
            <IconFeatureCard
              key={badge.title}
              icon={icons[badge.icon]}
              title={badge.title}
              description={badge.description}
            />
          ))}
        </div>

        <div className="mt-12">
          <AccreditationsStrip />
        </div>
      </Container>
    </section>
  );
}
