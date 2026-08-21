"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/nav";
import Container from "@/components/ui/Container";
import CtaButton from "@/components/ui/CtaButton";
import TopBar from "@/components/layout/TopBar";
import MobileNav from "@/components/layout/MobileNav";
import { BASE_PATH } from "@/lib/site-config";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 50);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-30 bg-white transition-shadow duration-300 ${
        scrolled ? "shadow-[0_2px_10px_rgba(0,0,0,0.1)]" : ""
      }`}
    >
      <TopBar />
      <Container wide className="flex items-center justify-between gap-4 py-4">
        <Link href="/" className="shrink-0">
          <Image
            src={`${BASE_PATH}/images/logo-cropped.png`}
            alt={"U.S. Tax Experts"}
            width={1086}
            height={291}
            priority
            className="w-48 h-auto lg:w-56"
          />
        </Link>

        <nav className="hidden items-center gap-4 lg:flex xl:gap-6">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative whitespace-nowrap py-2 text-[15px] font-semibold uppercase tracking-wide transition-colors ${
                  isActive
                    ? "text-[#FFEB3B]"
                    : "text-navy-ink hover:text-[#FFEB3B]"
                }`}
              >
                {link.label}
                <span
                  aria-hidden
                  className={`absolute inset-x-0 -bottom-0.5 h-0.5 origin-center scale-x-0 bg-[#FFEB3B] transition-transform duration-300 ease-out group-hover:scale-x-100 ${
                    isActive ? "scale-x-100" : ""
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <CtaButton
            href="https://ustaxexperts.smartvault.com"
            variant="outline-navy"
            size="sm"
          >
            Client Portal
          </CtaButton>
          <CtaButton href="/enroll-now" size="sm">
            Enroll Now
          </CtaButton>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          className="relative flex h-10 w-10 shrink-0 items-center justify-center text-navy-900 lg:hidden"
        >
          <Menu
            size={26}
            className={`absolute transition-all duration-300 ${
              mobileOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
            }`}
          />
          <X
            size={26}
            className={`absolute transition-all duration-300 ${
              mobileOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
            }`}
          />
        </button>
      </Container>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
