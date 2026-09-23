"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { one, supabase, insert, update, remove, logActivity as writeLog } from "@/lib/db";
import type { Faq } from "@/lib/db-types";
import { requireAdminSession } from "@/lib/admin-session";
import { textField, intField, checkboxField } from "@/lib/admin-form";
import type { ActionState } from "@/lib/admin-form";

async function logActivity(action: string, entityLabel: string) {
  const user = await requireAdminSession();
  await writeLog(action, "FAQ", entityLabel, user.id);
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

  await insert("faqs", input);
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

  const existing = await one<Faq>(supabase.from("faqs").select("*").eq("id", id).maybeSingle());
  if (!existing) return { error: "FAQ not found." };

  await update("faqs", id, input);
  await logActivity("updated", input.question);
  revalidatePath("/admin/faqs");
  redirect("/admin/faqs");
}

export async function deleteFaq(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = textField(formData, "id");
  if (!id) return;

  const existing = await one<Faq>(supabase.from("faqs").select("*").eq("id", id).maybeSingle());
  if (!existing) return;

  await remove("faqs", id);
  await logActivity("deleted", existing.question);
  revalidatePath("/admin/faqs");
}

export async function toggleFaqPublished(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = textField(formData, "id");
  if (!id) return;

  const existing = await one<Faq>(supabase.from("faqs").select("*").eq("id", id).maybeSingle());
  if (!existing) return;

  await update("faqs", id, { published: !existing.published });
  await logActivity(existing.published ? "unpublished" : "published", existing.question);
  revalidatePath("/admin/faqs");
}
