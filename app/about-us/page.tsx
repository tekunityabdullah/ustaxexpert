import type { Metadata } from "next";
import Image from "next/image";
import BreadcrumbHero from "@/components/ui/BreadcrumbHero";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedNumber from "@/components/ui/AnimatedNumber";
import TeamBios from "@/components/about/TeamBios";
import ResultCategories from "@/components/about/ResultCategories";
import CtaFinancials from "@/components/home/CtaFinancials";
import Reveal from "@/components/ui/Reveal";
import { BASE_PATH } from "@/lib/site-config";

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

export default function AboutUsPage() {
  return (
    <>
      <BreadcrumbHero title="About Us" />

      <section className="py-16 lg:py-25">
        <Container>
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <Reveal direction="left" className="lg:col-span-7">
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
            </Reveal>
            <Reveal direction="right" className="lg:col-span-5">
              <Image
                src={`${BASE_PATH}/images/office-scene-close-up.jpg`}
                alt="U.S. Tax Experts team"
                width={750}
                height={750}
                className="w-full rounded-lg border border-black/5"
              />
            </Reveal>
          </div>

          <Reveal
            direction="up"
            className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-black/10 bg-black/10 sm:grid-cols-4"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white px-4 py-8 text-center">
                <p className="text-3xl font-extrabold text-navy-900 lg:text-4xl">
                  <AnimatedNumber value={stat.value} />
                </p>
                <p className="mt-1.5 text-sm text-muted">{stat.label}</p>
              </div>
            ))}
          </Reveal>
        </Container>
      </section>

      <section className="bg-section py-16 lg:py-25">
        <Container>
          <Reveal direction="up">
            <SectionHeading
              align="center"
              eyebrow="Meet the Team"
              title="Professional Tax Experts, Certifications, and Experience"
              subtitle="Every case is handled by a specialist with real IRS resolution experience, backed by our full team of accountants and tax professionals."
            />
          </Reveal>
          <TeamBios />
        </Container>
      </section>

      <section className="py-16 lg:py-25">
        <Container>
          <Reveal direction="up">
            <SectionHeading
              align="center"
              eyebrow="Track Record"
              title="The Kinds of Results We Help Clients Achieve"
              subtitle="Every case is different, but here are the outcomes we most often pursue on behalf of our clients."
            />
          </Reveal>
          <ResultCategories />
        </Container>
      </section>

      <CtaFinancials />
    </>
  );
}
