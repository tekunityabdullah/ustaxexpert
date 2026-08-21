"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Save, CheckCircle2 } from "lucide-react";
import { AdminButton } from "@/components/admin/ui/Button";
import { AdminFormField, AdminInput, AdminTextarea } from "@/components/admin/ui/Field";
import { AdminCard } from "@/components/admin/ui/Card";
import { serializePipeLines } from "@/lib/admin-form";
import type { ActionState } from "@/lib/admin-form";
import type { SiteSettings } from "@prisma/client";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <AdminButton type="submit" disabled={pending}>
      <Save size={14} />
      {pending ? "Saving..." : "Save Settings"}
    </AdminButton>
  );
}

export default function SettingsForm({
  settings,
  action,
}: {
  settings: SiteSettings | null;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
}) {
  const [state, formAction] = useActionState(action, undefined);

  return (
    <form action={formAction} className="space-y-6">
      {state?.error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-[13.5px] text-red-700">
          {state.error}
        </div>
      )}
      {state?.success && (
        <div className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13.5px] text-emerald-700">
          <CheckCircle2 size={15} />
          Settings saved.
        </div>
      )}

      <AdminCard className="space-y-4">
        <h3 className="text-[15px] font-bold text-heading">General</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AdminFormField label="Site Name" htmlFor="name">
            <AdminInput id="name" name="name" defaultValue={settings?.name} required />
          </AdminFormField>
          <AdminFormField label="Tagline" htmlFor="tagline">
            <AdminInput id="tagline" name="tagline" defaultValue={settings?.tagline} />
          </AdminFormField>
        </div>
        <AdminFormField label="Description" htmlFor="description" hint="Used for SEO and social sharing.">
          <AdminTextarea id="description" name="description" rows={3} defaultValue={settings?.description} required />
        </AdminFormField>
      </AdminCard>

      <AdminCard className="space-y-4">
        <h3 className="text-[15px] font-bold text-heading">Contact</h3>
        <AdminFormField label="Office Address" htmlFor="address">
          <AdminInput id="address" name="address" defaultValue={settings?.address} required />
        </AdminFormField>
        <AdminFormField
          label="Phone Numbers"
          htmlFor="phones"
          hint='One per line: Label | tel:+1XXXXXXXXXX | Type — e.g. "1 (800) 316-4033 | tel:+18003164033 | Main"'
        >
          <AdminTextarea
            id="phones"
            name="phones"
            rows={3}
            defaultValue={serializePipeLines(settings?.phones, ["label", "href", "type"])}
          />
        </AdminFormField>
        <AdminFormField
          label="Social Links"
          htmlFor="social"
          hint='One per line: Label | URL | icon — e.g. "Facebook | https://facebook.com/... | facebook"'
        >
          <AdminTextarea
            id="social"
            name="social"
            rows={3}
            defaultValue={serializePipeLines(settings?.social, ["label", "href", "icon"])}
          />
        </AdminFormField>
      </AdminCard>

      <SubmitButton />
    </form>
  );
}
