"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Save } from "lucide-react";
import { AdminButton, AdminButtonLink } from "@/components/admin/ui/Button";
import { AdminFormField, AdminInput, AdminSelect } from "@/components/admin/ui/Field";
import { AdminCard } from "@/components/admin/ui/Card";
import type { AdminUser } from "@prisma/client";
import type { ActionState } from "@/lib/admin-form";

const ROLES = ["SUPER_ADMIN", "ADMIN", "EDITOR"];

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <AdminButton type="submit" disabled={pending}>
      <Save size={14} />
      {pending ? "Saving..." : label}
    </AdminButton>
  );
}

export default function UserForm({
  user,
  action,
  isSelf,
}: {
  user?: AdminUser;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  isSelf?: boolean;
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AdminFormField label="Full Name" htmlFor="name">
            <AdminInput id="name" name="name" defaultValue={user?.name} required />
          </AdminFormField>
          <AdminFormField label="Email Address" htmlFor="email" hint={user ? "Email can't be changed." : undefined}>
            <AdminInput
              id="email"
              name="email"
              type="email"
              defaultValue={user?.email}
              disabled={Boolean(user)}
              required={!user}
            />
          </AdminFormField>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AdminFormField label="Role" htmlFor="role">
            <AdminSelect
              id="role"
              name="role"
              defaultValue={user?.role ?? "EDITOR"}
              disabled={isSelf && user?.role === "SUPER_ADMIN"}
            >
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {role.replace("_", " ")}
                </option>
              ))}
            </AdminSelect>
          </AdminFormField>
          <AdminFormField
            label={user ? "New Password" : "Password"}
            htmlFor="password"
            hint={user ? "Leave blank to keep the current password." : "At least 8 characters."}
          >
            <AdminInput id="password" name="password" type="password" required={!user} />
          </AdminFormField>
        </div>
        {user && (
          <label className="flex items-center gap-2 text-[14px] font-medium text-heading">
            <input
              type="checkbox"
              name="active"
              defaultChecked={user.active}
              disabled={isSelf}
              className="h-4 w-4 rounded border-black/25"
            />
            Active (can sign in)
          </label>
        )}
      </AdminCard>

      <div className="flex items-center gap-3">
        <SubmitButton label={user ? "Save Changes" : "Create User"} />
        <AdminButtonLink href="/admin/users" variant="secondary">
          Cancel
        </AdminButtonLink>
      </div>
    </form>
  );
}
