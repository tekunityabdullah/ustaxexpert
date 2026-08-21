import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";
import { getServiceBySlug } from "@/lib/services";
import { BASE_PATH } from "@/lib/site-config";

function isValidEmail(value: unknown): value is string {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function safeReference(name: string, serviceTitle: string) {
  return `${name}--${serviceTitle}`
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 200);
}

export async function POST(request: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      { error: "Online payment isn't configured on the server yet." },
      { status: 503 }
    );
  }

  let body: { service?: unknown; name?: unknown; email?: unknown; amount?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) {
    return NextResponse.json({ error: "Please enter your name." }, { status: 422 });
  }

  if (!isValidEmail(body.email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 422 });
  }

  const service =
    typeof body.service === "string" ? await getServiceBySlug(body.service) : undefined;
  if (!service) {
    return NextResponse.json({ error: "Please select a valid service." }, { status: 422 });
  }

  const amount = Number(body.amount);
  if (!Number.isFinite(amount) || amount < 1 || amount > 1_000_000) {
    return NextResponse.json({ error: "Please enter a valid payment amount." }, { status: 422 });
  }

  const origin = request.headers.get("origin") ?? new URL(request.url).origin;
  const stripe = new Stripe(secretKey);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: body.email,
      client_reference_id: safeReference(name, service.title),
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: Math.round(amount * 100),
            product_data: {
              name: `${service.title} — Payment`,
              description: `Payment from ${name} for ${service.title}`,
            },
          },
        },
      ],
      metadata: {
        service: service.slug,
        customerName: name,
      },
      success_url: `${origin}${BASE_PATH}/make-a-payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}${BASE_PATH}/make-a-payment`,
    });

    if (!session.url) {
      throw new Error("Stripe did not return a checkout URL.");
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout session error:", err);
    return NextResponse.json(
      { error: "Could not start checkout. Please try again or contact us." },
      { status: 500 }
    );
  }
}
