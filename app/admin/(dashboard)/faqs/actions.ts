"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin-session";
import { textField, intField, checkboxField } from "@/lib/admin-form";
import type { ActionState } from "@/lib/admin-form";

async function logActivity(action: string, entityLabel: string) {
  const user = await requireAdminSession();
  await prisma.activityLog.create({
    data: { action, entityType: "FAQ", entityLabel, adminUserId: user.id },
  });
}

function readFaqInput(formData: FormData) {
  return {
    question: textField(formData, "question"),
    answer: textField(formData, "answer"),
    category: textField(formData, "category"),
    order: intField(formData, "order", 0),
    published: checkboxField(formData, "published"),
  };
}

function validate(input: ReturnType<typeof readFaqInput>): string | null {
  if (!input.question) return "Question is required.";
  if (!input.answer) return "Answer is required.";
  if (!input.category) return "Category is required.";
  return null;
}

export async function createFaq(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdminSession();
  const input = readFaqInput(formData);
  const error = validate(input);
  if (error) return { error };

  await prisma.faq.create({ data: input });
  await logActivity("created", input.question);
  revalidatePath("/admin/faqs");
  redirect("/admin/faqs");
}

export async function updateFaq(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdminSession();
  const input = readFaqInput(formData);
  const error = validate(input);
  if (error) return { error };

  const existing = await prisma.faq.findUnique({ where: { id } });
  if (!existing) return { error: "FAQ not found." };

  await prisma.faq.update({ where: { id }, data: input });
  await logActivity("updated", input.question);
  revalidatePath("/admin/faqs");
  redirect("/admin/faqs");
}

export async function deleteFaq(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = textField(formData, "id");
  if (!id) return;

  const existing = await prisma.faq.findUnique({ where: { id } });
  if (!existing) return;

  await prisma.faq.delete({ where: { id } });
  await logActivity("deleted", existing.question);
  revalidatePath("/admin/faqs");
}

export async function toggleFaqPublished(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = textField(formData, "id");
  if (!id) return;

  const existing = await prisma.faq.findUnique({ where: { id } });
  if (!existing) return;

  await prisma.faq.update({ where: { id }, data: { published: !existing.published } });
  await logActivity(existing.published ? "unpublished" : "published", existing.question);
  revalidatePath("/admin/faqs");
}
