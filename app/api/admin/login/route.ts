import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
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

  let user;
  try {
    user = await prisma.adminUser.findUnique({ where: { email } });
  } catch (err) {
    console.error("Admin login DB error:", err);
    return NextResponse.json(
      { error: "The admin database isn't reachable right now. Check DATABASE_URL on the server." },
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

  await prisma.$transaction([
    prisma.adminUser.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } }),
    prisma.activityLog.create({
      data: {
        action: "logged in",
        entityType: "AdminUser",
        entityLabel: user.name,
        adminUserId: user.id,
      },
    }),
  ]);

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
