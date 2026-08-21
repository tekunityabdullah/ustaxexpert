import BookConsultationButton from "@/components/ui/BookConsultationButton";
import CtaButton from "@/components/ui/CtaButton";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import { BASE_PATH } from "@/lib/site-config";

export default function Hero() {
  return (
    <section className="relative flex h-screen items-center overflow-hidden pt-[95px] lg:pt-[150px]">
      <div className="absolute inset-0 -z-20 bg-navy-900" />
      <div
        className="absolute inset-0 -z-10 h-full w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${BASE_PATH}/images/banner.jpg)` }}
      />
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-black/60 via-black/40 to-black/60" />

      <Container className="py-20 text-center">
        <Reveal direction="up" duration={0.8}>
          <h1 className="mx-auto max-w-4xl font-extrabold tracking-tight text-white">
            Your Top Source for IRS Tax Debt Relief!
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-white/85">
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
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <BookConsultationButton>Book Consultation</BookConsultationButton>
            <CtaButton href="/make-a-payment" variant="outline">
              Make a Payment
            </CtaButton>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
