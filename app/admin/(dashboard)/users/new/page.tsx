import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import UserForm from "@/components/admin/users/UserForm";
import { createUser } from "@/app/admin/(dashboard)/users/actions";

export const metadata = { title: "New Admin User" };

export default function NewUserPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted hover:text-heading"
      >
        <ArrowLeft size={14} />
        Back to Users
      </Link>
      <div>
        <h1 className="text-heading">New Admin User</h1>
        <p className="mt-1 text-[14px] text-muted">Invite a new team member to the admin panel.</p>
      </div>
      <UserForm action={createUser} />
    </div>
  );
}
