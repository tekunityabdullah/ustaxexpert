import { NextResponse } from "next/server";

type ContactPayload = {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
};

function isValidEmail(value: unknown): value is string {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  let payload: Partial<ContactPayload>;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const message = typeof payload.message === "string" ? payload.message.trim() : "";

  if (!name || !isValidEmail(payload.email) || !message) {
    return NextResponse.json(
      { error: "Name, a valid email, and a message are required." },
      { status: 422 }
    );
  }

  // NOTE: no email/CRM integration wired up yet — log server-side for now.
  console.log("Contact form submission:", {
    name,
    email: payload.email,
    phone: payload.phone ?? "",
    service: payload.service ?? "",
    message,
  });

  return NextResponse.json({ ok: true });
}
