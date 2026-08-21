import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import { getAdminSession } from "@/lib/admin-session";
import { BASE_PATH } from "@/lib/site-config";
import LoginForm from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Admin Sign In",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const user = await getAdminSession();
  if (user) redirect("/admin");

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-900 px-5 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex justify-center">
          <div className="rounded-md bg-white p-2">
            <Image
              src={`${BASE_PATH}/images/logo-cropped.png`}
              alt="U.S. Tax Experts"
              width={1086}
              height={291}
              className="h-9 w-auto"
            />
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-white p-7">
          <h5 className="text-heading">Admin Sign In</h5>
          <p className="mt-1 mb-6 text-[13.5px] text-muted">
            Sign in to manage payments and site content.
          </p>
          <LoginForm />
        </div>

        <p className="mt-5 flex items-center justify-center gap-1.5 text-[12px] text-white/50">
          <ShieldCheck size={13} />
          Authorized staff only. This area is not indexed or public.
        </p>
      </div>
    </div>
  );
}
