import CtaButton from "@/components/ui/CtaButton";
import Container from "@/components/ui/Container";

export default function Hero() {
  return (
    <section className="relative flex min-h-[720px] items-center overflow-hidden pt-[110px]">
      <div className="absolute inset-0 -z-20 bg-navy-900" />
      <video
        className="absolute inset-0 -z-10 h-full w-full object-cover"
        src="/videos/7507565-uhd_3840_2160_25fps-1.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />
      <div className="absolute inset-0 -z-10 bg-black/50" />

      <Container className="py-20 text-center">
        <h1 className="mx-auto max-w-4xl text-white">
          Your Top Source for IRS Tax Debt Relief!
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/90">
          At U.S. Tax Experts, we help manage your Tax &amp; Accounting
          needs, and resolve IRS Tax debt, including tax liens and levies. We
          provide trusted, personalized tax solutions, and strategies,
          nationwide, helping our clients save millions of dollars.
          <br />
          <br />
          If you&rsquo;re someone who owes more than $10,000 in IRS tax debt
          we understand how overwhelming tax issues can be, which is why we
          provide personalized debt relief strategies designed to ease
          financial burdens, and restore peace of mind.
        </p>
        <div className="mt-8">
          <CtaButton href="/contact-us">Book Consultation</CtaButton>
        </div>
      </Container>
    </section>
  );
}
