import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { getAdminSession } from "@/lib/admin-session";
import UserForm from "@/components/admin/users/UserForm";
import { updateUser } from "@/app/admin/(dashboard)/users/actions";

export const metadata = { title: "Edit Admin User" };

export default async function EditUserPage(props: PageProps<"/admin/users/[id]">) {
  const { id } = await props.params;
  const [user, currentUser] = await Promise.all([
    prisma.adminUser.findUnique({ where: { id } }),
    getAdminSession(),
  ]);
  if (!user) notFound();

  const action = updateUser.bind(null, user.id);
  const isSelf = currentUser?.id === user.id;

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
        <h1 className="text-heading">Edit Admin User</h1>
        <p className="mt-1 text-[14px] text-muted">{user.name}</p>
      </div>
      <UserForm user={user} action={action} isSelf={isSelf} />
    </div>
  );
}
