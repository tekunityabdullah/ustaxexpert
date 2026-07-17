import Image from "next/image";
import FeatureCard from "@/components/ui/FeatureCard";
import Container from "@/components/ui/Container";

const features = [
  {
    icon: "/images/Mask-Group-5.png",
    number: 1,
    title: "Added Value",
    description: "We help resolve IRS tax debt quickly with proven strategies.",
  },
  {
    icon: "/images/Mask-Group-3.png",
    number: 2,
    title: "Personalized Solutions",
    description: "Every solution is tailored to your unique financial needs.",
  },
  {
    icon: "/images/Mask-Group-4.png",
    number: 3,
    title: "Trusted Experts",
    description: "Serving clients in all 50 states with trusted care.",
  },
  {
    icon: "/images/Group-34814.png",
    number: 4,
    title: "Professional Guidance",
    description: "Experienced experts guiding you toward lasting stability.",
  },
];

export default function AboutIntro() {
  return (
    <section className="bg-section py-16 lg:py-25">
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <h2>Trusted Solutions for Every Tax Challenge</h2>
            <p className="mt-5 text-body">
              We specialize in delivering reliable strategies to resolve even
              the most complex tax and accounting challenges. From IRS debt
              relief and Tax Settlement, to Accounting, Bookkeeping and Tax
              Planning &amp; Preparation, our team provides tailored
              solutions designed to protect your finances and restore peace
              of mind.
            </p>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {features.map((feature) => (
                <FeatureCard key={feature.title} {...feature} />
              ))}
            </div>
          </div>
          <div className="lg:col-span-4">
            <Image
              src="/images/Group-34813.png"
              alt="U.S. Tax Experts team"
              width={750}
              height={750}
              className="w-full rounded-lg border border-black/5"
            />
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:mt-24">
          <div className="lg:col-span-4">
            <Image
              src="/images/download-17.png"
              alt="Tax resolution consultation"
              width={910}
              height={606}
              className="w-full rounded-lg border border-black/5"
            />
          </div>
          <div className="lg:col-span-8">
            <p className="mb-3 text-lg font-semibold text-gold-600">
              Building Trust Through Expertise
            </p>
            <h2>
              Trusted Support for Your Tax
              <br />
              Resolution Journey
            </h2>
            <p className="mt-5 text-body">
              We understand the stress and uncertainty that come with IRS tax
              issues. Our team specializes in resolving tax debt, removing
              liens and levies, and creating personalized strategies to help
              you regain control of your finances, security, and future.
              With trusted experience and nationwide service, we stand by
              your side every step of the way, ensuring clarity, confidence,
              and lasting peace of mind.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
