import { prisma } from "@/lib/db";
import SettingsForm from "@/components/admin/settings/SettingsForm";
import { updateSettings } from "./actions";

export const metadata = { title: "Settings" };

export default async function AdminSettingsPage() {
  let settings = null;
  try {
    settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
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
