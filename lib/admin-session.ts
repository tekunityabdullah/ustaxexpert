import "server-only";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { AdminUser } from "@prisma/client";

/**
 * Full, DB-backed session check (confirms the account still exists and is
 * active) — use in Server Components/layouts. Proxy's check is optimistic
 * (cookie-only) by design; this is the real one.
 */
export async function getAdminSession(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;

  const payload = await verifySessionToken(token);
  if (!payload) return null;

  try {
    const user = await prisma.adminUser.findUnique({ where: { id: payload.sub } });
    return user && user.active ? user : null;
  } catch {
    return null;
  }
}

/**
 * For use inside Server Actions, which are reachable by anyone who can send
 * the right POST regardless of what page rendered the form — so every
 * mutation re-checks the session itself rather than trusting the caller.
 * Throws (rather than redirecting) since actions run outside a page render.
 */
export async function requireAdminSession(): Promise<AdminUser> {
  const user = await getAdminSession();
  if (!user) throw new Error("Unauthorized");
  return user;
}
