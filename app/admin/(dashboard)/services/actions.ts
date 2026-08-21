"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin-session";
import { textField, linesToArray, intField, checkboxField, slugify } from "@/lib/admin-form";
import type { ActionState } from "@/lib/admin-form";

async function logActivity(action: string, entityLabel: string) {
  const user = await requireAdminSession();
  await prisma.activityLog.create({
    data: { action, entityType: "Service", entityLabel, adminUserId: user.id },
  });
}

function readServiceInput(formData: FormData) {
  const title = textField(formData, "title");
  const slugInput = textField(formData, "slug");
  const excerpt = textField(formData, "excerpt");
  const description = linesToArray(formData, "description");
  const image = textField(formData, "image");
  const included = linesToArray(formData, "included");
  const benefits = linesToArray(formData, "benefits");
  const paymentLink = textField(formData, "paymentLink");

  return {
    title,
    slug: slugify(slugInput || title),
    excerpt,
    description,
    image,
    imageWidth: intField(formData, "imageWidth", 1200),
    imageHeight: intField(formData, "imageHeight", 675),
    included,
    benefits,
    paymentLink: paymentLink || null,
    order: intField(formData, "order", 0),
    published: checkboxField(formData, "published"),
  };
}

function validate(input: ReturnType<typeof readServiceInput>): string | null {
  if (!input.title) return "Title is required.";
  if (!input.slug) return "Slug is required.";
  if (!input.excerpt) return "Excerpt is required.";
  if (input.description.length === 0) return "Add at least one description paragraph.";
  if (!input.image) return "Image path is required.";
  return null;
}

export async function createService(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdminSession();
  const input = readServiceInput(formData);
  const error = validate(input);
  if (error) return { error };

  const existing = await prisma.service.findUnique({ where: { slug: input.slug } });
  if (existing) return { error: "A service with this slug already exists." };

  await prisma.service.create({ data: input });
  await logActivity("created", input.title);
  revalidatePath("/admin/services");
  redirect("/admin/services");
}

export async function updateService(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdminSession();
  const input = readServiceInput(formData);
  const error = validate(input);
  if (error) return { error };

  const existing = await prisma.service.findUnique({ where: { id } });
  if (!existing) return { error: "Service not found." };

  const slugTaken = await prisma.service.findFirst({
    where: { slug: input.slug, NOT: { id } },
  });
  if (slugTaken) return { error: "A service with this slug already exists." };

  await prisma.service.update({ where: { id }, data: input });
  await logActivity("updated", input.title);
  revalidatePath("/admin/services");
  redirect("/admin/services");
}

export async function deleteService(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = textField(formData, "id");
  if (!id) return;

  const existing = await prisma.service.findUnique({ where: { id } });
  if (!existing) return;

  await prisma.service.delete({ where: { id } });
  await logActivity("deleted", existing.title);
  revalidatePath("/admin/services");
}

export async function toggleServicePublished(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = textField(formData, "id");
  if (!id) return;

  const existing = await prisma.service.findUnique({ where: { id } });
  if (!existing) return;

  await prisma.service.update({ where: { id }, data: { published: !existing.published } });
  await logActivity(existing.published ? "unpublished" : "published", existing.title);
  revalidatePath("/admin/services");
}
