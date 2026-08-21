"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin-session";
import { hashPassword } from "@/lib/auth";
import { textField, checkboxField } from "@/lib/admin-form";
import type { ActionState } from "@/lib/admin-form";

const ROLES = ["SUPER_ADMIN", "ADMIN", "EDITOR"] as const;
type Role = (typeof ROLES)[number];

function readRole(formData: FormData): Role {
  const value = textField(formData, "role");
  return (ROLES as readonly string[]).includes(value) ? (value as Role) : "EDITOR";
}

async function logActivity(actorId: string, action: string, entityLabel: string) {
  await prisma.activityLog.create({
    data: { action, entityType: "AdminUser", entityLabel, adminUserId: actorId },
  });
}

export async function createUser(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const actor = await requireAdminSession();

  const name = textField(formData, "name");
  const email = textField(formData, "email").toLowerCase();
  const password = textField(formData, "password");
  const role = readRole(formData);

  if (!name) return { error: "Name is required." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Please enter a valid email address." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) return { error: "An admin user with this email already exists." };

  const passwordHash = await hashPassword(password);
  await prisma.adminUser.create({ data: { name, email, passwordHash, role } });
  await logActivity(actor.id, "created", `${name} (${email})`);

  revalidatePath("/admin/users");
  redirect("/admin/users");
}

export async function updateUser(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const actor = await requireAdminSession();

  const name = textField(formData, "name");
  const password = textField(formData, "password");

  if (!name) return { error: "Name is required." };

  const existing = await prisma.adminUser.findUnique({ where: { id } });
  if (!existing) return { error: "User not found." };

  const isSelf = existing.id === actor.id;

  // The form disables the role/active fields for your own account (you
  // can't demote or deactivate yourself), and disabled inputs don't appear
  // in FormData at all — so for self-edits, keep the existing values
  // server-side rather than trusting a role/active field that may be absent.
  const role = isSelf ? existing.role : readRole(formData);
  const active = isSelf ? true : checkboxField(formData, "active");

  if (password && password.length < 8) {
    return { error: "Password must be at least 8 characters, or leave it blank to keep the current one." };
  }

  await prisma.adminUser.update({
    where: { id },
    data: {
      name,
      role,
      active,
      ...(password ? { passwordHash: await hashPassword(password) } : {}),
    },
  });
  await logActivity(actor.id, "updated", `${name} (${existing.email})`);

  revalidatePath("/admin/users");
  redirect("/admin/users");
}

export async function deleteUser(formData: FormData): Promise<void> {
  const actor = await requireAdminSession();
  const id = textField(formData, "id");
  if (!id || id === actor.id) return; // can't delete your own account

  const existing = await prisma.adminUser.findUnique({ where: { id } });
  if (!existing) return;

  await prisma.adminUser.delete({ where: { id } });
  await logActivity(actor.id, "deleted", `${existing.name} (${existing.email})`);
  revalidatePath("/admin/users");
}
