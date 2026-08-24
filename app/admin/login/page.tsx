import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Image from "next/image";
import { ShieldCheck, Lock } from "lucide-react";
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-navy-900 px-5 py-12">
      {/* Subtle depth + texture instead of a flat, harsh block of color —
          a radial vignette (darker toward the edges) plus a faint dot grid,
          both purely monochromatic so it stays restrained, not decorative. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(255,255,255,0.06), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative w-full max-w-sm">
        <div className="mb-7 flex justify-center">
          <div className="rounded-md bg-white p-2 shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
            <Image
              src={`${BASE_PATH}/images/logo-cropped.png`}
              alt="U.S. Tax Experts"
              width={1086}
              height={291}
              className="h-9 w-auto"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-white/10 bg-white shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
          <div className="h-1 bg-gold-gradient" />
          <div className="p-7">
            <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-md bg-section text-navy-900">
              <Lock size={19} />
            </span>
            <h5 className="text-heading">Admin Sign In</h5>
            <p className="mt-1 mb-6 text-[13.5px] text-muted">
              Sign in to manage payments and site content.
            </p>
            <LoginForm />
          </div>
        </div>

        <p className="mt-5 flex items-center justify-center gap-1.5 text-[12px] text-white/50">
          <ShieldCheck size={13} />
          Authorized staff only. This area is not indexed or public.
        </p>
      </div>
    </div>
  );
}
