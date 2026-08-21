import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  CreditCard,
  Briefcase,
  Newspaper,
  HelpCircle,
  MessageSquareQuote,
  Image as ImageIcon,
  Settings,
  Users,
} from "lucide-react";

export type AdminNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export type AdminNavGroup = {
  label: string;
  items: AdminNavItem[];
};

// Grouped for the sidebar (Overview / Content / System) — a flat list of
// nine equal-weight links reads as clutter; grouping gives the eye a
// structure to scan instead of one long column.
export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Payments", href: "/admin/payments", icon: CreditCard },
    ],
  },
  {
    label: "Content",
    items: [
      { label: "Services", href: "/admin/services", icon: Briefcase },
      { label: "Blog", href: "/admin/blog", icon: Newspaper },
      { label: "FAQs", href: "/admin/faqs", icon: HelpCircle },
      { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquareQuote },
      { label: "Media", href: "/admin/media", icon: ImageIcon },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Settings", href: "/admin/settings", icon: Settings },
      { label: "Users", href: "/admin/users", icon: Users },
    ],
  },
];

// Flat view of the same list — used to resolve the current page's title/icon
// for the topbar.
export const ADMIN_NAV: AdminNavItem[] = ADMIN_NAV_GROUPS.flatMap((g) => g.items);
