"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { NAV_LINKS } from "@/lib/nav";
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
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <div
        className={`fixed inset-y-0 right-0 z-50 flex w-[80%] max-w-sm flex-col bg-navy-900 p-6 transition-transform duration-300 ease-out lg:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="ml-auto flex h-10 w-10 items-center justify-center rounded-full text-white hover:bg-white/10"
        >
          <X size={22} />
        </button>
        <nav className="mt-6 flex flex-1 flex-col gap-2">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3 py-3 text-base font-semibold uppercase tracking-wide transition-colors ${
                  isActive
                    ? "text-gold-300"
                    : "text-white hover:text-gold-300"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <CtaButton href="/contact-us" className="mt-4 w-full">
          Enroll Now
        </CtaButton>
      </div>
    </>
  );
}
