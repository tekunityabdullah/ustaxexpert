"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin-session";
import { textField } from "@/lib/admin-form";
import type { ActionState } from "@/lib/admin-form";
import { saveUploadedFile, deleteUploadedFile, ALLOWED_MIME_TYPES, MAX_UPLOAD_BYTES } from "@/lib/media-storage";

export async function uploadMedia(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireAdminSession();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Please choose a file to upload." };
  }
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { error: "Unsupported file type. Upload a JPG, PNG, WebP, GIF, or SVG image." };
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return { error: "File is too large. Maximum size is 8MB." };
  }

  const { url } = await saveUploadedFile(file);

  await prisma.media.create({
    data: {
      filename: file.name,
      url,
      mimeType: file.type,
      size: file.size,
      uploadedById: user.id,
    },
  });

  await prisma.activityLog.create({
    data: { action: "uploaded", entityType: "Media", entityLabel: file.name, adminUserId: user.id },
  });

  revalidatePath("/admin/media");
  return undefined;
}

export async function deleteMedia(formData: FormData): Promise<void> {
  const user = await requireAdminSession();
  const id = textField(formData, "id");
  if (!id) return;

  const existing = await prisma.media.findUnique({ where: { id } });
  if (!existing) return;

  await prisma.media.delete({ where: { id } });
  await deleteUploadedFile(existing.url);

  await prisma.activityLog.create({
    data: { action: "deleted", entityType: "Media", entityLabel: existing.filename, adminUserId: user.id },
  });

  revalidatePath("/admin/media");
}
