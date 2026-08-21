import type { Metadata } from "next";
import BreadcrumbHero from "@/components/ui/BreadcrumbHero";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import PaymentForm from "@/components/payment/PaymentForm";
import Reveal from "@/components/ui/Reveal";
import { getServices } from "@/lib/services";

export const metadata: Metadata = {
  title: "Make a Payment",
  description:
    "Make a secure online payment to U.S. Tax Experts for tax debt relief, tax settlement, accounting, bookkeeping, or tax planning services.",
};

export default async function MakeAPaymentPage() {
  const services = await getServices();

  return (
    <>
      <BreadcrumbHero title="Make a Payment" />

      <section className="py-16 lg:py-25">
        <Container>
          <Reveal direction="up" className="mx-auto max-w-xl">
            <SectionHeading
              align="center"
              title="Pay Your Invoice Online"
              subtitle="Select the service this payment is for, tell us who you are, and enter the amount you'd like to pay. You'll complete payment securely on the next screen."
            />
            <div className="mt-10">
              <PaymentForm services={services} />
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
