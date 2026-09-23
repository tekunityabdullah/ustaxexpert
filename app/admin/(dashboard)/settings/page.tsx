import { supabase, one } from "@/lib/db";
import type { SiteSettings } from "@/lib/db-types";
import SettingsForm from "@/components/admin/settings/SettingsForm";
import { updateSettings } from "./actions";

export const metadata = { title: "Settings" };

export default async function AdminSettingsPage() {
  let settings: SiteSettings | null = null;
  try {
    settings = await one<SiteSettings>(supabase.from("site_settings").select("*").eq("id", 1).maybeSingle());
  } catch {
    // Handled by the empty defaultValue fallbacks in the form below.
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-heading">Site Settings</h1>
        <p className="mt-1 text-[14px] text-muted">Manage contact details shown across the site.</p>
      </div>
      <SettingsForm settings={settings} action={updateSettings} />
    </div>
  );
}
