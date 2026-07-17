"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { NAV_LINKS } from "@/lib/nav";
import Container from "@/components/ui/Container";
import CtaButton from "@/components/ui/CtaButton";
import TopBar from "@/components/layout/TopBar";
import MobileNav from "@/components/layout/MobileNav";

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
      <Container className="flex items-center justify-between py-2.5">
        <Link href="/" className="shrink-0 rounded-lg bg-white p-2">
          <Image
            src="/images/Group-34806.png"
            alt={"U.S. Tax Experts"}
            width={250}
            height={84}
            priority
            className="h-12 w-auto lg:h-14"
          />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[15px] font-semibold uppercase tracking-wide transition-colors ${
                  isActive
                    ? "text-accent-orange"
                    : "text-navy-ink hover:text-accent-orange"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <CtaButton href="/contact-us">Enroll Now</CtaButton>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="flex h-10 w-10 items-center justify-center text-navy-900 lg:hidden"
        >
          <Menu size={26} />
        </button>
      </Container>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
