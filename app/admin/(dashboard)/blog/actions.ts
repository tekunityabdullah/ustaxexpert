"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin-session";
import { textField, checkboxField, slugify } from "@/lib/admin-form";
import type { ActionState } from "@/lib/admin-form";
import { stripHtmlToText } from "@/lib/blog-content";

const ICONS = ["Mail", "LifeBuoy", "TrendingUp", "Calculator"];

async function logActivity(action: string, entityLabel: string) {
  const user = await requireAdminSession();
  await prisma.activityLog.create({
    data: { action, entityType: "BlogPost", entityLabel, adminUserId: user.id },
  });
}

function readInput(formData: FormData) {
  const title = textField(formData, "title");
  const slugInput = textField(formData, "slug");
  const iconInput = textField(formData, "icon");

  return {
    title,
    slug: slugify(slugInput || title),
    excerpt: textField(formData, "excerpt"),
    // Raw HTML from the rich text editor (components/admin/blog/RichTextEditor) —
    // stored as-is in the Json `content` column and rendered directly on the
    // public blog page.
    content: (formData.get("content") as string | null) ?? "",
    image: textField(formData, "image") || null,
    category: textField(formData, "category"),
    icon: ICONS.includes(iconInput) ? iconInput : "Mail",
    readTime: textField(formData, "readTime") || "3 min read",
    date: textField(formData, "date"),
    published: checkboxField(formData, "published"),
  };
}

function validate(input: ReturnType<typeof readInput>): string | null {
  if (!input.title) return "Title is required.";
  if (!input.slug) return "Slug is required.";
  if (!input.excerpt) return "Excerpt is required.";
  if (stripHtmlToText(input.content).length === 0) return "Post content can't be empty.";
  if (!input.category) return "Category is required.";
  if (!input.date || Number.isNaN(Date.parse(input.date))) return "Please enter a valid date.";
  return null;
}

export async function createBlogPost(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdminSession();
  const input = readInput(formData);
  const error = validate(input);
  if (error) return { error };

  const existing = await prisma.blogPost.findUnique({ where: { slug: input.slug } });
  if (existing) return { error: "A post with this slug already exists." };

  await prisma.blogPost.create({ data: { ...input, date: new Date(input.date) } });
  await logActivity("created", input.title);
  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}

export async function updateBlogPost(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdminSession();
  const input = readInput(formData);
  const error = validate(input);
  if (error) return { error };

  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) return { error: "Post not found." };

  const slugTaken = await prisma.blogPost.findFirst({ where: { slug: input.slug, NOT: { id } } });
  if (slugTaken) return { error: "A post with this slug already exists." };

  await prisma.blogPost.update({ where: { id }, data: { ...input, date: new Date(input.date) } });
  await logActivity("updated", input.title);
  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}

export async function deleteBlogPost(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = textField(formData, "id");
  if (!id) return;

  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) return;

  await prisma.blogPost.delete({ where: { id } });
  await logActivity("deleted", existing.title);
  revalidatePath("/admin/blog");
}

export async function toggleBlogPostPublished(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = textField(formData, "id");
  if (!id) return;

  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) return;

  await prisma.blogPost.update({ where: { id }, data: { published: !existing.published } });
  await logActivity(existing.published ? "unpublished" : "published", existing.title);
  revalidatePath("/admin/blog");
}
