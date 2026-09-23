"use server";

import { revalidatePath } from "next/cache";
import { supabase, one, insert, remove, logActivity as writeLog } from "@/lib/db";
import type { Media } from "@/lib/db-types";
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

  await insert("media", {
    filename: file.name,
    url,
    mimeType: file.type,
    size: file.size,
    uploadedById: user.id,
  });

  await writeLog("uploaded", "Media", file.name, user.id);

  revalidatePath("/admin/media");
  return undefined;
}

export async function deleteMedia(formData: FormData): Promise<void> {
  const user = await requireAdminSession();
  const id = textField(formData, "id");
  if (!id) return;

  const existing = await one<Media>(supabase.from("media").select("*").eq("id", id).maybeSingle());
  if (!existing) return;

  await remove("media", id);
  await deleteUploadedFile(existing.url);

  await writeLog("deleted", "Media", existing.filename, user.id);

  revalidatePath("/admin/media");
}
