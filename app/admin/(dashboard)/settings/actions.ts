"use server";

import { revalidatePath } from "next/cache";
import { upsert, logActivity as writeLog } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin-session";
import { textField, parsePipeLines } from "@/lib/admin-form";
import type { ActionState } from "@/lib/admin-form";

export async function updateSettings(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireAdminSession();

  const name = textField(formData, "name");
  const tagline = textField(formData, "tagline");
  const description = textField(formData, "description");
  const address = textField(formData, "address");
  const phones = parsePipeLines(textField(formData, "phones"), ["label", "href", "type"]);
  const social = parsePipeLines(textField(formData, "social"), ["label", "href", "icon"]);

  if (!name) return { error: "Site name is required." };
  if (!description) return { error: "Description is required." };
  if (!address) return { error: "Address is required." };

  await upsert("site_settings", { id: 1, name, tagline, description, address, phones, social }, "id");

  await writeLog("updated", "SiteSettings", "Site Settings", user.id);

  revalidatePath("/admin/settings");
  return { success: true };
}
