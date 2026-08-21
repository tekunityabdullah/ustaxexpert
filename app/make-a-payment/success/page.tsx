import type { Metadata } from "next";
import Stripe from "stripe";
import { CheckCircle2 } from "lucide-react";
import BreadcrumbHero from "@/components/ui/BreadcrumbHero";
import Container from "@/components/ui/Container";
import CtaButton from "@/components/ui/CtaButton";

export const metadata: Metadata = {
  title: "Payment Received",
  description: "Thank you for your payment to U.S. Tax Experts.",
};

export default async function PaymentSuccessPage(
  props: PageProps<"/make-a-payment/success">
) {
  const searchParams = await props.searchParams;
  const sessionId =
    typeof searchParams.session_id === "string" ? searchParams.session_id : undefined;

  let amount: string | null = null;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (sessionId && secretKey) {
    try {
      const stripe = new Stripe(secretKey);
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status === "paid" && session.amount_total) {
        amount = (session.amount_total / 100).toLocaleString("en-US", {
          style: "currency",
          currency: session.currency?.toUpperCase() ?? "USD",
        });
      }
    } catch {
      // Fall through to a generic confirmation if the session can't be
      // verified (expired link, network hiccup, etc.) — still a real
      // Stripe redirect, so payment itself already succeeded.
    }
  }

  return (
    <>
      <BreadcrumbHero title="Payment Received" />

      <section className="py-16 lg:py-25">
        <Container>
          <div className="mx-auto max-w-lg text-center">
            <span className="bg-gold-gradient mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full text-navy-ink">
              <CheckCircle2 size={32} />
            </span>
            <h2>Thank You!</h2>
            <p className="mt-4 text-body">
              {amount
                ? `We've received your payment of ${amount}. A receipt has been sent to your email.`
                : "We've received your payment. A receipt has been sent to your email."}
            </p>
            <div className="mt-8">
              <CtaButton href="/">Back to Home</CtaButton>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
