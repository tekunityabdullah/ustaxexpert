import Link from "next/link";
import { Users, Plus, Pencil } from "lucide-react";
import { prisma } from "@/lib/db";
import { getAdminSession } from "@/lib/admin-session";
import {
  AdminTable,
  AdminTableHead,
  AdminTh,
  AdminTbody,
  AdminTr,
  AdminTd,
} from "@/components/admin/ui/Table";
import { AdminBadge } from "@/components/admin/ui/Badge";
import { AdminEmptyState } from "@/components/admin/ui/EmptyState";
import { AdminButtonLink } from "@/components/admin/ui/Button";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";
import { deleteUser } from "./actions";

export const metadata = { title: "Admin Users" };

function formatDate(date: Date | null) {
  if (!date) return "Never";
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

export default async function AdminUsersPage() {
  let users: Awaited<ReturnType<typeof prisma.adminUser.findMany>> = [];
  let dbError = false;
  const currentUser = await getAdminSession();

  try {
    users = await prisma.adminUser.findMany({ orderBy: { createdAt: "asc" } });
  } catch {
    dbError = true;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-heading">Admin Users</h1>
          <p className="mt-1 text-[14px] text-muted">Manage who can access this admin panel.</p>
        </div>
        <AdminButtonLink href="/admin/users/new">
          <Plus size={15} />
          New User
        </AdminButtonLink>
      </div>

      {dbError ? (
        <AdminEmptyState
          icon={Users}
          title="Database not connected"
          description="Set the DB_HOST/DB_USER/DB_PASSWORD/DB_NAME env vars and run migrations."
        />
      ) : (
        <AdminTable>
          <AdminTableHead>
            <AdminTh>Name</AdminTh>
            <AdminTh>Email</AdminTh>
            <AdminTh>Role</AdminTh>
            <AdminTh>Status</AdminTh>
            <AdminTh>Last Login</AdminTh>
            <AdminTh className="text-right">Actions</AdminTh>
          </AdminTableHead>
          <AdminTbody>
            {users.map((user) => (
              <AdminTr key={user.id}>
                <AdminTd className="font-semibold text-heading">
                  {user.name}
                  {user.id === currentUser?.id && (
                    <span className="ml-1.5 text-[11.5px] font-normal text-muted">(you)</span>
                  )}
                </AdminTd>
                <AdminTd className="text-muted">{user.email}</AdminTd>
                <AdminTd className="text-muted">{user.role.replace("_", " ")}</AdminTd>
                <AdminTd>
                  <AdminBadge tone={user.active ? "success" : "neutral"}>
                    {user.active ? "Active" : "Inactive"}
                  </AdminBadge>
                </AdminTd>
                <AdminTd className="text-[13px] text-muted">{formatDate(user.lastLoginAt)}</AdminTd>
                <AdminTd>
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-black/15 text-muted hover:border-navy-900 hover:text-heading"
                      aria-label={`Edit ${user.name}`}
                    >
                      <Pencil size={14} />
                    </Link>
                    {user.id !== currentUser?.id && (
                      <form action={deleteUser}>
                        <input type="hidden" name="id" value={user.id} />
                        <ConfirmSubmitButton
                          confirmMessage={`Remove "${user.name}" from the admin panel? This cannot be undone.`}
                          size="sm"
                        >
                          Delete
                        </ConfirmSubmitButton>
                      </form>
                    )}
                  </div>
                </AdminTd>
              </AdminTr>
            ))}
          </AdminTbody>
        </AdminTable>
      )}
    </div>
  );
}
