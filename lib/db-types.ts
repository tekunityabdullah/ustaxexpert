// Row types for the Supabase tables (see supabase/schema.sql). Column names
// match the database exactly (camelCase, quoted in SQL). Timestamps are
// revived to Date objects by lib/db.ts, so app code never sees ISO strings.

export type AdminRole = "SUPER_ADMIN" | "ADMIN" | "EDITOR";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export type AdminUser = {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: AdminRole;
  active: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ActivityLog = {
  id: string;
  action: string;
  entityType: string;
  entityLabel: string;
  createdAt: Date;
  adminUserId: string | null;
};

export type Payment = {
  id: string;
  stripeSessionId: string;
  stripePaymentIntentId: string | null;
  customerName: string;
  customerEmail: string;
  serviceSlug: string;
  serviceTitle: string;
  amount: number; // cents
  currency: string;
  status: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type Service = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  description: unknown; // string[]
  image: string;
  imageWidth: number;
  imageHeight: number;
  included: unknown; // string[]
  benefits: unknown; // string[]
  paymentLink: string | null;
  order: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: unknown; // HTML string, or legacy BlogContentBlock[]
  image: string | null;
  category: string;
  icon: string;
  readTime: string;
  date: Date;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Testimonial = {
  id: string;
  name: string;
  quote: string;
  order: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Media = {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
  uploadedAt: Date;
  uploadedById: string | null;
};

export type SiteSettings = {
  id: number;
  name: string;
  tagline: string;
  description: string;
  address: string;
  phones: unknown; // { label, href, type }[]
  social: unknown; // { label, href, icon }[]
  updatedAt: Date;
};
