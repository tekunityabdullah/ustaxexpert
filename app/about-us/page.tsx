import type { Metadata } from "next";
import Image from "next/image";
import { ShieldCheck, Eye, HeartHandshake, Award } from "lucide-react";
import BreadcrumbHero from "@/components/ui/BreadcrumbHero";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import IconFeatureCard from "@/components/ui/IconFeatureCard";
import CtaFinancials from "@/components/home/CtaFinancials";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about U.S. Tax Experts, a nationwide team dedicated to resolving IRS tax debt and providing trusted accounting, bookkeeping, and tax planning services.",
};

const stats = [
  { value: "50", label: "States Served" },
  { value: "10+", label: "Years of Experience" },
  { value: "$M's", label: "Saved for Clients" },
  { value: "1000+", label: "Cases Resolved" },
];

const values = [
  {
    icon: ShieldCheck,
    title: "Integrity",
    description: "We give honest, straightforward advice, even when it's not what you want to hear.",
  },
  {
    icon: Eye,
    title: "Transparency",
    description: "No hidden fees or surprise outcomes — you always know where your case stands.",
  },
  {
    icon: HeartHandshake,
    title: "Dedication",
    description: "Every client gets a personalized strategy built around their unique situation.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "Our team stays current on IRS programs to secure the best possible results.",
  },
];

export default function AboutUsPage() {
  return (
    <>
      <BreadcrumbHero title="About Us" />

      <section className="py-16 lg:py-25">
        <Container>
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="mb-3 text-lg font-semibold text-gold-600">Who We Are</p>
              <h2>A Nationwide Team Committed to Your Financial Peace of Mind</h2>
              <p className="mt-5 text-body">
                U.S. Tax Experts was founded on a simple belief: every taxpayer
                deserves a clear path out of IRS debt and confidence in their
                financial future. We bring together experienced tax
                professionals, accountants, and enrolled agents who work
                directly with the IRS on your behalf, so you don&rsquo;t have
                to face collections, liens, or audits alone.
              </p>
              <p className="mt-4 text-body">
                From individuals facing wage garnishment to small businesses
                needing ongoing bookkeeping and accounting support, we tailor
                every engagement to the specifics of your case, backed by
                proven strategies and transparent communication from day one.
              </p>
            </div>
            <div className="lg:col-span-5">
              <Image
                src="/images/Group-34813.png"
                alt="U.S. Tax Experts team"
                width={750}
                height={750}
                className="w-full rounded-lg border border-black/5"
              />
            </div>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-6 border-y border-black/10 py-10 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-extrabold text-navy-900 lg:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-section py-16 lg:py-25">
        <Container>
          <SectionHeading
            align="center"
            title="What We Stand For"
            subtitle="These principles guide every case we take on, from a first consultation to a final resolution."
          />
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <IconFeatureCard key={value.title} {...value} />
            ))}
          </div>
        </Container>
      </section>

      <CtaFinancials />
    </>
  );
}
