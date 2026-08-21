"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  Briefcase,
  Newspaper,
  HelpCircle,
  MessageSquareQuote,
  Image as ImageIcon,
  Users,
  Settings,
  Clock,
  type LucideIcon,
} from "lucide-react";
import { AdminEmptyState } from "@/components/admin/ui/EmptyState";

export type ActivityItem = {
  id: string;
  action: string;
  entityType: string;
  entityLabel: string;
  adminUserName: string | null;
  createdAt: string; // ISO
};

type EntityMeta = { icon: LucideIcon; href: string; group: "payments" | "content" | "team" };

const ENTITY_META: Record<string, EntityMeta> = {
  Payment: { icon: CreditCard, href: "/admin/payments", group: "payments" },
  Service: { icon: Briefcase, href: "/admin/services", group: "content" },
  BlogPost: { icon: Newspaper, href: "/admin/blog", group: "content" },
  FAQ: { icon: HelpCircle, href: "/admin/faqs", group: "content" },
  Testimonial: { icon: MessageSquareQuote, href: "/admin/testimonials", group: "content" },
  Media: { icon: ImageIcon, href: "/admin/media", group: "content" },
  AdminUser: { icon: Users, href: "/admin/users", group: "team" },
  SiteSettings: { icon: Settings, href: "/admin/settings", group: "team" },
};

const FILTERS = [
  { key: "all", label: "All" },
  { key: "payments", label: "Payments" },
  { key: "content", label: "Content" },
  { key: "team", label: "Team" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function ActivityFeed({ items }: { items: ActivityItem[] }) {
  const [filter, setFilter] = useState<FilterKey>("all");

  const counts: Record<FilterKey, number> = {
    all: items.length,
    payments: items.filter((i) => ENTITY_META[i.entityType]?.group === "payments").length,
    content: items.filter((i) => ENTITY_META[i.entityType]?.group === "content").length,
    team: items.filter((i) => ENTITY_META[i.entityType]?.group === "team").length,
  };

  const visible =
    filter === "all" ? items : items.filter((i) => ENTITY_META[i.entityType]?.group === filter);

  return (
    <div>
      <div className="mb-3 flex items-center gap-1 border-b border-black/10">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={`relative px-2.5 pb-2 text-[12.5px] font-semibold transition-colors ${
              filter === f.key ? "text-navy-900" : "text-muted hover:text-heading"
            }`}
          >
            {f.label}
            {counts[f.key] > 0 && <span className="ml-1 text-[11px] opacity-60">{counts[f.key]}</span>}
            {filter === f.key && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-navy-900" />
            )}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <AdminEmptyState
          icon={Clock}
          title="No activity"
          description="Nothing in this category yet."
        />
      ) : (
        <ul className="divide-y divide-black/5 rounded-lg border border-black/10 bg-white">
          {visible.map((item) => {
            const meta = ENTITY_META[item.entityType];
            const Icon = meta?.icon ?? Clock;
            const content = (
              <>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-section text-navy-900/70">
                  <Icon size={14} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] text-body">
                    <span className="font-semibold text-heading">
                      {item.adminUserName ?? "Someone"}
                    </span>{" "}
                    {item.action} {item.entityType.toLowerCase()}{" "}
                    <span className="font-medium text-heading">&ldquo;{item.entityLabel}&rdquo;</span>
                  </span>
                  <span className="mt-0.5 block text-[11.5px] text-muted">
                    {relativeTime(item.createdAt)}
                  </span>
                </span>
              </>
            );

            return (
              <li key={item.id}>
                {meta ? (
                  <Link
                    href={meta.href}
                    className="flex items-start gap-3 px-3.5 py-3 transition-colors hover:bg-section/60"
                  >
                    {content}
                  </Link>
                ) : (
                  <div className="flex items-start gap-3 px-3.5 py-3">{content}</div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
