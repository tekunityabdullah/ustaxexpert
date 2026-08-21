"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Save } from "lucide-react";
import { AdminButton, AdminButtonLink } from "@/components/admin/ui/Button";
import { AdminFormField, AdminInput, AdminTextarea } from "@/components/admin/ui/Field";
import { AdminCard } from "@/components/admin/ui/Card";
import type { Testimonial } from "@prisma/client";
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

export default function TestimonialForm({
  testimonial,
  action,
}: {
  testimonial?: Testimonial;
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

      <AdminCard className="space-y-4">
        <AdminFormField label="Client Name" htmlFor="name">
          <AdminInput id="name" name="name" defaultValue={testimonial?.name} required />
        </AdminFormField>
        <AdminFormField label="Quote" htmlFor="quote">
          <AdminTextarea id="quote" name="quote" rows={4} defaultValue={testimonial?.quote} required />
        </AdminFormField>
        <AdminFormField label="Display Order" htmlFor="order" hint="Lower numbers show first.">
          <AdminInput id="order" name="order" type="number" defaultValue={testimonial?.order ?? 0} />
        </AdminFormField>
        <label className="flex items-center gap-2 text-[14px] font-medium text-heading">
          <input
            type="checkbox"
            name="published"
            defaultChecked={testimonial?.published ?? true}
            className="h-4 w-4 rounded border-black/25"
          />
          Published (visible on the live site)
        </label>
      </AdminCard>

      <div className="flex items-center gap-3">
        <SubmitButton label={testimonial ? "Save Changes" : "Create Testimonial"} />
        <AdminButtonLink href="/admin/testimonials" variant="secondary">
          Cancel
        </AdminButtonLink>
      </div>
    </form>
  );
}
