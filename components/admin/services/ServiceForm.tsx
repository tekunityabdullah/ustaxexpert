"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Save } from "lucide-react";
import { AdminButton, AdminButtonLink } from "@/components/admin/ui/Button";
import { AdminFormField, AdminInput, AdminTextarea } from "@/components/admin/ui/Field";
import { AdminCard } from "@/components/admin/ui/Card";
import type { Service } from "@prisma/client";
import type { ActionState } from "@/lib/admin-form";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <AdminButton type="submit" disabled={pending}>
      <Save size={14} />
      {pending ? "Saving..." : label}
    </AdminButton>
  );
}

export default function ServiceForm({
  service,
  action,
}: {
  service?: Service;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
}) {
  const [state, formAction] = useActionState(action, undefined);
  const description = Array.isArray(service?.description) ? (service.description as string[]) : [];
  const included = Array.isArray(service?.included) ? (service.included as string[]) : [];
  const benefits = Array.isArray(service?.benefits) ? (service.benefits as string[]) : [];

  return (
    <form action={formAction} className="space-y-6">
      {state?.error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-[13.5px] text-red-700">
          {state.error}
        </div>
      )}

      <AdminCard className="space-y-4">
        <h3 className="text-[15px] font-bold text-heading">Basics</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AdminFormField label="Title" htmlFor="title">
            <AdminInput id="title" name="title" defaultValue={service?.title} required />
          </AdminFormField>
          <AdminFormField
            label="Slug"
            htmlFor="slug"
            hint="Used in the URL. Leave blank to auto-generate from title (create only)."
          >
            <AdminInput id="slug" name="slug" defaultValue={service?.slug} placeholder="auto-generated" />
          </AdminFormField>
        </div>
        <AdminFormField label="Excerpt" htmlFor="excerpt" hint="Short summary shown on listing cards.">
          <AdminTextarea id="excerpt" name="excerpt" rows={2} defaultValue={service?.excerpt} required />
        </AdminFormField>
        <AdminFormField
          label="Description"
          htmlFor="description"
          hint="One paragraph per line — rendered as separate paragraphs on the service page."
        >
          <AdminTextarea
            id="description"
            name="description"
            rows={6}
            defaultValue={description.join("\n")}
            required
          />
        </AdminFormField>
      </AdminCard>

      <AdminCard className="space-y-4">
        <h3 className="text-[15px] font-bold text-heading">Image</h3>
        <AdminFormField label="Image Path" htmlFor="image" hint="e.g. /images/service-photo.jpg">
          <AdminInput id="image" name="image" defaultValue={service?.image} required />
        </AdminFormField>
        <div className="grid grid-cols-2 gap-4">
          <AdminFormField label="Width (px)" htmlFor="imageWidth">
            <AdminInput
              id="imageWidth"
              name="imageWidth"
              type="number"
              min={1}
              defaultValue={service?.imageWidth ?? 1200}
            />
          </AdminFormField>
          <AdminFormField label="Height (px)" htmlFor="imageHeight">
            <AdminInput
              id="imageHeight"
              name="imageHeight"
              type="number"
              min={1}
              defaultValue={service?.imageHeight ?? 675}
            />
          </AdminFormField>
        </div>
      </AdminCard>

      <AdminCard className="space-y-4">
        <h3 className="text-[15px] font-bold text-heading">Highlights</h3>
        <AdminFormField label="What's Included" htmlFor="included" hint="One item per line.">
          <AdminTextarea id="included" name="included" rows={4} defaultValue={included.join("\n")} />
        </AdminFormField>
        <AdminFormField label="Benefits" htmlFor="benefits" hint="One item per line.">
          <AdminTextarea id="benefits" name="benefits" rows={4} defaultValue={benefits.join("\n")} />
        </AdminFormField>
      </AdminCard>

      <AdminCard className="space-y-4">
        <h3 className="text-[15px] font-bold text-heading">Settings</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AdminFormField
            label="Stripe Payment Link"
            htmlFor="paymentLink"
            hint="Optional. Falls back to the site-wide link when unset."
          >
            <AdminInput
              id="paymentLink"
              name="paymentLink"
              defaultValue={service?.paymentLink ?? ""}
              placeholder="https://buy.stripe.com/..."
            />
          </AdminFormField>
          <AdminFormField label="Display Order" htmlFor="order" hint="Lower numbers show first.">
            <AdminInput id="order" name="order" type="number" defaultValue={service?.order ?? 0} />
          </AdminFormField>
        </div>
        <label className="flex items-center gap-2 text-[14px] font-medium text-heading">
          <input
            type="checkbox"
            name="published"
            defaultChecked={service?.published ?? true}
            className="h-4 w-4 rounded border-black/25"
          />
          Published (visible on the live site)
        </label>
      </AdminCard>

      <div className="flex items-center gap-3">
        <SubmitButton label={service ? "Save Changes" : "Create Service"} />
        <AdminButtonLink href="/admin/services" variant="secondary">
          Cancel
        </AdminButtonLink>
      </div>
    </form>
  );
}
