import { Mail, LifeBuoy, TrendingUp, Calculator, type LucideIcon } from "lucide-react";
import type { BlogPost } from "@/lib/blog";

// Icon varies per category (so cards stay visually distinguishable), but
// color is intentionally the same everywhere — the site's standard
// gold-on-navy pattern — so the blog matches the rest of the brand
// instead of every card having a different color.
export const blogIcons: Record<BlogPost["icon"], LucideIcon> = {
  Mail,
  LifeBuoy,
  TrendingUp,
  Calculator,
};

export const blogStyle = {
  badge: "bg-navy-900/10 text-navy-900",
  iconWrap: "bg-gold-gradient text-navy-ink",
  bar: "bg-gold-gradient",
};
