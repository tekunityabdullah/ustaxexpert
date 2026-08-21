import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-session";
import AdminShell from "@/components/admin/AdminShell";

export const metadata = {
  title: {
    default: "Admin",
    template: "%s | Admin — U.S. Tax Experts",
  },
  robots: { index: false, follow: false },
};

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Full, DB-backed check — proxy.ts already did the fast optimistic check,
  // this confirms the account still actually exists and is active.
  const user = await getAdminSession();
  if (!user) redirect("/admin/login");

  return (
    <AdminShell user={{ name: user.name, email: user.email, role: user.role }}>
      {children}
    </AdminShell>
  );
}
