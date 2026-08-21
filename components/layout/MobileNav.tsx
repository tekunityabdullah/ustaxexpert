"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/nav";
import { BASE_PATH } from "@/lib/site-config";
import CtaButton from "@/components/ui/CtaButton";

export default function MobileNav({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div
        aria-hidden
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-gray-500/60 transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <div
        className={`fixed inset-y-0 left-0 z-50 flex w-[80%] max-w-sm flex-col bg-white p-6 shadow-[0_0_40px_rgba(0,0,0,0.15)] transition-transform duration-300 ease-out lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <Link href="/" onClick={onClose} className="inline-block w-fit shrink-0">
          <Image
            src={`${BASE_PATH}/images/logo-cropped.png`}
            alt="U.S. Tax Experts"
            width={1086}
            height={291}
            className="h-10 w-auto"
          />
        </Link>

        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {NAV_LINKS.map((link, index) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className="group relative flex items-baseline gap-3 border-b border-black/5 py-3.5"
              >
                <span className="text-xs font-semibold text-navy-900/25">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span
                  className={`text-lg font-bold tracking-tight transition-colors ${
                    isActive ? "text-[#FFEB3B]" : "text-navy-ink group-hover:text-[#FFEB3B]"
                  }`}
                >
                  {link.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-6 flex flex-col gap-3 border-t border-black/10 pt-6">
          <CtaButton
            href="https://ustaxexperts.smartvault.com"
            variant="outline-navy"
            className="w-full"
          >
            Client Portal
          </CtaButton>
          <CtaButton href="/make-a-payment" variant="outline-navy" className="w-full">
            Make a Payment
          </CtaButton>
          <CtaButton href="/enroll-now" className="w-full">
            Enroll Now
          </CtaButton>
        </div>
      </div>
    </>
  );
}
