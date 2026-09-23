import { NextResponse, type NextRequest } from "next/server";
import { supabase, one, update, insert } from "@/lib/db";
import type { AdminUser } from "@/lib/db-types";
import { ADMIN_SESSION_COOKIE, createSessionToken, verifyPassword } from "@/lib/auth";

const GENERIC_ERROR = "Invalid email or password.";
const SEVEN_DAYS = 60 * 60 * 24 * 7;

export async function POST(request: NextRequest) {
  let body: { email?: unknown; password?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 });
  }

  let user: AdminUser | null;
  try {
    user = await one<AdminUser>(
      supabase.from("admin_users").select("*").eq("email", email).maybeSingle()
    );
  } catch (err) {
    console.error("Admin login DB error:", err);
    return NextResponse.json(
      { error: "The admin database isn't reachable right now. Check NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY on the server, and that the Supabase project is not paused." },
      { status: 503 }
    );
  }

  if (!user || !user.active) {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 });
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 });
  }

  const token = await createSessionToken({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  // Best-effort bookkeeping — a failure here must not block a valid login.
  try {
    await update("admin_users", user.id, { lastLoginAt: new Date().toISOString() });
    await insert("activity_log", {
      action: "logged in",
      entityType: "AdminUser",
      entityLabel: user.name,
      adminUserId: user.id,
    });
  } catch (err) {
    console.error("Admin login bookkeeping error:", err);
  }

  const response = NextResponse.json({
    ok: true,
    user: { name: user.name, email: user.email, role: user.role },
  });

  response.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SEVEN_DAYS,
  });

  return response;
}
