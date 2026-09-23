"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { one, supabase, insert, update, remove, logActivity as writeLog } from "@/lib/db";
import type { Testimonial } from "@/lib/db-types";
import { requireAdminSession } from "@/lib/admin-session";
import { textField, intField, checkboxField } from "@/lib/admin-form";
import type { ActionState } from "@/lib/admin-form";

async function logActivity(action: string, entityLabel: string) {
  const user = await requireAdminSession();
  await writeLog(action, "Testimonial", entityLabel, user.id);
}

function readInput(formData: FormData) {
  return {
    name: textField(formData, "name"),
    quote: textField(formData, "quote"),
    order: intField(formData, "order", 0),
    published: checkboxField(formData, "published"),
  };
}

function validate(input: ReturnType<typeof readInput>): string | null {
  if (!input.name) return "Name is required.";
  if (!input.quote) return "Quote is required.";
  return null;
}

export async function createTestimonial(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdminSession();
  const input = readInput(formData);
  const error = validate(input);
  if (error) return { error };

  await insert("testimonials", input);
  await logActivity("created", input.name);
  revalidatePath("/admin/testimonials");
  redirect("/admin/testimonials");
}

export async function updateTestimonial(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdminSession();
  const input = readInput(formData);
  const error = validate(input);
  if (error) return { error };

  const existing = await one<Testimonial>(supabase.from("testimonials").select("*").eq("id", id).maybeSingle());
  if (!existing) return { error: "Testimonial not found." };

  await update("testimonials", id, input);
  await logActivity("updated", input.name);
  revalidatePath("/admin/testimonials");
  redirect("/admin/testimonials");
}

export async function deleteTestimonial(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = textField(formData, "id");
  if (!id) return;

  const existing = await one<Testimonial>(supabase.from("testimonials").select("*").eq("id", id).maybeSingle());
  if (!existing) return;

  await remove("testimonials", id);
  await logActivity("deleted", existing.name);
  revalidatePath("/admin/testimonials");
}

export async function toggleTestimonialPublished(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = textField(formData, "id");
  if (!id) return;

  const existing = await one<Testimonial>(supabase.from("testimonials").select("*").eq("id", id).maybeSingle());
  if (!existing) return;

  await update("testimonials", id, { published: !existing.published });
  await logActivity(existing.published ? "unpublished" : "published", existing.name);
  revalidatePath("/admin/testimonials");
}
