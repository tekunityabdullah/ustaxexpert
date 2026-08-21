import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/db";
import type { PaymentStatus } from "@prisma/client";

// Stripe webhook receiver — this is the ONLY source of truth for the
// Payments admin module. The client never reports "I paid"; Stripe tells us
// directly, with a verified signature, once money has actually moved.
//
// Configure in the Stripe Dashboard → Developers → Webhooks:
//   Endpoint URL: https://your-domain.com/web/ustaxexperts/api/webhooks/stripe
//   Events: checkout.session.completed, checkout.session.expired,
//           checkout.session.async_payment_failed, charge.refunded
// Copy the resulting signing secret into STRIPE_WEBHOOK_SECRET.

function toPaymentStatus(session: Stripe.Checkout.Session): PaymentStatus {
  if (session.payment_status === "paid") return "PAID";
  if (session.status === "expired") return "FAILED";
  return "PENDING";
}

async function upsertFromSession(stripe: Stripe, session: Stripe.Checkout.Session) {
  const status = toPaymentStatus(session);
  const paymentIntentId =
    typeof session.payment_intent === "string" ? session.payment_intent : null;

  const payment = await prisma.payment.upsert({
    where: { stripeSessionId: session.id },
    create: {
      stripeSessionId: session.id,
      stripePaymentIntentId: paymentIntentId,
      customerName: session.metadata?.customerName ?? session.customer_details?.name ?? "Unknown",
      customerEmail: session.customer_details?.email ?? session.customer_email ?? "unknown@example.com",
      serviceSlug: session.metadata?.service ?? "unknown",
      serviceTitle: session.metadata?.service ?? "Unknown Service",
      amount: session.amount_total ?? 0,
      currency: session.currency ?? "usd",
      status,
    },
    update: {
      stripePaymentIntentId: paymentIntentId,
      status,
    },
  });

  await prisma.activityLog.create({
    data: {
      action: status === "PAID" ? "received a payment from" : "recorded a pending payment from",
      entityType: "Payment",
      entityLabel: `${payment.customerName} — ${payment.serviceTitle}`,
    },
  });

  return payment;
}

export async function POST(request: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secretKey || !webhookSecret) {
    return NextResponse.json({ error: "Stripe webhook is not configured." }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header." }, { status: 400 });
  }

  const stripe = new Stripe(secretKey);
  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded":
      case "checkout.session.async_payment_failed":
      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        await upsertFromSession(stripe, session);
        break;
      }
      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        const paymentIntentId =
          typeof charge.payment_intent === "string" ? charge.payment_intent : null;
        if (paymentIntentId) {
          const existing = await prisma.payment.findFirst({
            where: { stripePaymentIntentId: paymentIntentId },
          });
          if (existing) {
            await prisma.payment.update({
              where: { id: existing.id },
              data: { status: "REFUNDED" },
            });
            await prisma.activityLog.create({
              data: {
                action: "refunded a payment from",
                entityType: "Payment",
                entityLabel: `${existing.customerName} — ${existing.serviceTitle}`,
              },
            });
          }
        }
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error("Stripe webhook handler error:", err);
    // Return 200 anyway isn't right here — a real processing failure should
    // make Stripe retry, so surface a 500.
    return NextResponse.json({ error: "Webhook handler failed." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
