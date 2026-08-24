"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { ADMIN_NAV, ADMIN_NAV_GROUPS } from "@/lib/admin-nav";
import { BASE_PATH } from "@/lib/site-config";

type AdminUserSummary = { name: string; email: string; role: string };

const COLLAPSE_KEY = "admin-sidebar-collapsed";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function roleLabel(role: string): string {
  return role
    .toLowerCase()
    .split("_")
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(" ");
}

function Avatar({ name, size = 34 }: { name: string; size?: number }) {
  return (
    <span
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      className="flex shrink-0 items-center justify-center rounded-full bg-gold-gradient font-bold text-navy-ink"
    >
      {initials(name)}
    </span>
  );
}

function NavLinks({
  collapsed,
  onNavigate,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col px-3">
      {ADMIN_NAV_GROUPS.map((group, gi) => (
        <div key={group.label} className={gi === 0 ? "" : "mt-5"}>
          <p
            className={`px-3 pb-1.5 text-[10.5px] font-bold tracking-widest text-white/45 uppercase ${
              collapsed ? "lg:hidden" : ""
            }`}
          >
            {group.label}
          </p>
          <div className="flex flex-col gap-0.5">
            {group.items.map((item) => {
              const isActive =
                item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  title={collapsed ? item.label : undefined}
                  aria-current={isActive ? "page" : undefined}
                  className={`group flex items-center gap-3 rounded-md border-l-2 px-3 py-2 text-[13.5px] font-medium transition-colors ${
                    collapsed ? "lg:justify-center lg:px-2" : ""
                  } ${
                    isActive
                      ? "border-gold-300 bg-white/10 text-white"
                      : "border-transparent text-white/80 hover:bg-white/7 hover:text-white"
                  }`}
                >
                  <Icon
                    size={17}
                    strokeWidth={2}
                    className={`shrink-0 transition-colors ${
                      isActive ? "text-gold-300" : "text-white/60 group-hover:text-white/90"
                    }`}
                  />
                  <span className={collapsed ? "lg:hidden" : ""}>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

function PageHeading() {
  const pathname = usePathname();
  const current = [...ADMIN_NAV]
    .sort((a, b) => b.href.length - a.href.length)
    .find((item) => (item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href)));

  if (!current) return <span className="text-[15px] font-bold text-heading">Admin</span>;

  const Icon = current.icon;
  return (
    <span className="flex items-center gap-2">
      <Icon size={16} className="text-navy-900/70" />
      <span className="text-[15px] font-bold text-heading">{current.label}</span>
    </span>
  );
}

function UserMenu({ user, onLogout }: { user: AdminUserSummary; onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={`flex items-center gap-2 rounded-md py-1 pr-1 pl-1.5 transition-colors ${
          open ? "bg-section" : "hover:bg-section"
        }`}
      >
        <Avatar name={user.name} size={30} />
        <span className="hidden text-left leading-tight sm:block">
          <span className="block text-[13px] font-semibold text-heading">{user.name}</span>
          <span className="block text-[11px] text-muted">{roleLabel(user.role)}</span>
        </span>
        <ChevronDown
          size={15}
          className={`mr-0.5 shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute top-full right-0 z-20 mt-2 w-56 rounded-md border border-black/10 bg-white py-1.5 shadow-[0_8px_24px_rgba(15,23,42,0.12)]"
        >
          <div className="border-b border-black/5 px-3.5 py-2.5">
            <p className="truncate text-[13px] font-semibold text-heading">{user.name}</p>
            <p className="truncate text-[12px] text-muted">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={onLogout}
            role="menuitem"
            className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-[13px] font-medium text-heading transition-colors hover:bg-section"
          >
            <LogOut size={14} className="text-muted" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

export default function AdminShell({
  user,
  children,
}: {
  user: AdminUserSummary;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setCollapsed(window.localStorage.getItem(COLLAPSE_KEY) === "1");
  }, []);

  function toggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev;
      window.localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      return next;
    });
  }

  async function handleLogout() {
    await fetch(`${BASE_PATH}/api/admin/logout`, { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-section">
      {/* Mobile backdrop */}
      <div
        aria-hidden
        onClick={() => setMobileOpen(false)}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity lg:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-navy-900 pb-4 transition-transform duration-200 lg:translate-x-0 lg:transition-[width] lg:duration-200 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } ${collapsed ? "lg:w-19" : "lg:w-64"}`}
      >
        <div className="flex items-center border-b border-white/10 px-4 py-5">
          {/* Mobile: logo + close button — always the full drawer, never the collapsed rail */}
          <div className="flex w-full items-center justify-between lg:hidden">
            <div className="rounded-md bg-white px-2.5 py-2 shadow-[0_2px_8px_rgba(0,0,0,0.18)]">
              <Image
                src={`${BASE_PATH}/images/logo-cropped.png`}
                alt="U.S. Tax Experts"
                width={1086}
                height={291}
                className="h-7 w-auto"
              />
            </div>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="text-white/70 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Desktop, expanded: logo + collapse toggle side by side */}
          {!collapsed && (
            <div className="hidden w-full items-center justify-between lg:flex">
              <div className="rounded-md bg-white p-1.5">
                <Image
                  src={`${BASE_PATH}/images/logo-cropped.png`}
                  alt="U.S. Tax Experts"
                  width={1086}
                  height={291}
                  className="h-6 w-auto"
                />
              </div>
              <button
                type="button"
                onClick={toggleCollapsed}
                aria-label="Collapse sidebar"
                title="Collapse sidebar"
                className="flex h-7 w-7 items-center justify-center rounded-md border border-white/15 bg-white/10 text-white transition-colors hover:border-white/25 hover:bg-white/20"
              >
                <PanelLeftClose size={16} strokeWidth={2} />
              </button>
            </div>
          )}

          {/* Desktop, collapsed: single centered toggle to expand again */}
          {collapsed && (
            <button
              type="button"
              onClick={toggleCollapsed}
              aria-label="Expand sidebar"
              title="Expand sidebar"
              className="hidden h-8 w-8 items-center justify-center rounded-md border border-white/15 bg-white/10 text-white transition-colors hover:border-white/25 hover:bg-white/20 lg:mx-auto lg:flex"
            >
              <PanelLeftOpen size={16} strokeWidth={2} />
            </button>
          )}
        </div>

        <div className="mt-4 flex-1 overflow-y-auto">
          <NavLinks collapsed={collapsed} onNavigate={() => setMobileOpen(false)} />
        </div>

        <div className="mt-4 border-t border-white/10 px-4 pt-4">
          <div
            className={`flex items-center gap-3 rounded-md px-1.5 py-1.5 ${
              collapsed ? "lg:justify-center lg:px-0" : ""
            }`}
          >
            <Avatar name={user.name} />
            <div className={`min-w-0 flex-1 ${collapsed ? "lg:hidden" : ""}`}>
              <p className="truncate text-[13px] font-semibold text-white">{user.name}</p>
              <p className="truncate text-[11.5px] text-white/60">{roleLabel(user.role)}</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              aria-label="Sign out"
              title="Sign out"
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-white/60 transition-colors hover:bg-white/8 hover:text-white ${
                collapsed ? "lg:hidden" : ""
              }`}
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* Topbar + content */}
      <div className={`transition-[padding] duration-200 ${collapsed ? "lg:pl-19" : "lg:pl-64"}`}>
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-black/10 bg-white px-5 py-3.5 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="text-navy-900 lg:hidden"
            >
              <Menu size={22} />
            </button>
            <PageHeading />
          </div>

          <div className="flex items-center gap-3">
            <a
              href={BASE_PATH || "/"}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 text-[13px] font-semibold text-muted transition-colors hover:text-navy-900 sm:flex"
            >
              View Site
              <ExternalLink size={13} />
            </a>
            <span className="hidden h-5 w-px bg-black/10 sm:block" />
            <UserMenu user={user} onLogout={handleLogout} />
          </div>
        </header>

        <main className="p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
