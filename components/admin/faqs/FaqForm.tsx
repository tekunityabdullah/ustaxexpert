"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Save } from "lucide-react";
import { AdminButton, AdminButtonLink } from "@/components/admin/ui/Button";
import { AdminFormField, AdminInput, AdminTextarea, AdminSelect } from "@/components/admin/ui/Field";
import { AdminCard } from "@/components/admin/ui/Card";
import type { Faq } from "@prisma/client";
import type { ActionState } from "@/lib/admin-form";

const CATEGORIES = ["Getting Started", "Tax Debt Relief", "Accounting & Planning", "Working With Us"];

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <AdminButton type="submit" disabled={pending}>
      <Save size={14} />
      {pending ? "Saving..." : label}
    </AdminButton>
  );
}

export default function FaqForm({
  faq,
  action,
}: {
  faq?: Faq;
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
        <AdminFormField label="Question" htmlFor="question">
          <AdminInput id="question" name="question" defaultValue={faq?.question} required />
        </AdminFormField>
        <AdminFormField label="Answer" htmlFor="answer">
          <AdminTextarea id="answer" name="answer" rows={5} defaultValue={faq?.answer} required />
        </AdminFormField>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AdminFormField label="Category" htmlFor="category">
            <AdminSelect id="category" name="category" defaultValue={faq?.category ?? CATEGORIES[0]}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </AdminSelect>
          </AdminFormField>
          <AdminFormField label="Display Order" htmlFor="order" hint="Lower numbers show first.">
            <AdminInput id="order" name="order" type="number" defaultValue={faq?.order ?? 0} />
          </AdminFormField>
        </div>
        <label className="flex items-center gap-2 text-[14px] font-medium text-heading">
          <input
            type="checkbox"
            name="published"
            defaultChecked={faq?.published ?? true}
            className="h-4 w-4 rounded border-black/25"
          />
          Published (visible on the live site)
        </label>
      </AdminCard>

      <div className="flex items-center gap-3">
        <SubmitButton label={faq ? "Save Changes" : "Create FAQ"} />
        <AdminButtonLink href="/admin/faqs" variant="secondary">
          Cancel
        </AdminButtonLink>
      </div>
    </form>
  );
}
