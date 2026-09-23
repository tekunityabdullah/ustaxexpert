import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Pure Supabase (PostgREST over HTTPS) — no ORM, no direct Postgres
// connection, no database password. This server-side client uses the
// service-role key, which bypasses Row Level Security (RLS is enabled on
// every table with no policies, so the public anon key can't read or write
// anything). NEVER expose SUPABASE_SERVICE_ROLE_KEY to the browser: it has
// no NEXT_PUBLIC_ prefix and must only be imported from server code.

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const dbConfigured = Boolean(url && serviceKey);

const globalForSupabase = globalThis as unknown as { supabase?: SupabaseClient };

// When the env vars aren't set yet the client still constructs (placeholder
// values) and every query returns an error, which `many`/`one`/etc. below
// turn into a thrown Error — so each page's existing try/catch shows its
// "database not connected" state instead of the app crashing at import.
export const supabase: SupabaseClient =
  globalForSupabase.supabase ??
  createClient(url || "http://localhost:54321", serviceKey || "not-configured", {
    auth: { persistSession: false, autoRefreshToken: false },
  });

if (process.env.NODE_ENV !== "production") {
  globalForSupabase.supabase = supabase;
}

// PostgREST returns timestamps as ISO strings; app code expects Dates.
const DATE_KEYS = new Set(["createdAt", "updatedAt", "lastLoginAt", "date", "uploadedAt"]);

export function revive<T>(row: unknown): T {
  if (row === null || typeof row !== "object") return row as T;
  const out: Record<string, unknown> = { ...(row as Record<string, unknown>) };
  for (const key of Object.keys(out)) {
    const value = out[key];
    if (DATE_KEYS.has(key) && typeof value === "string") {
      out[key] = new Date(value);
    } else if (value && typeof value === "object" && !Array.isArray(value) && !(value instanceof Date)) {
      // Embedded relations (e.g. adminUser: { name }) — revive nested rows too.
      if (key === "adminUser") out[key] = revive(value);
    }
  }
  return out as T;
}

type Result = PromiseLike<{ data: unknown; error: { message: string } | null }>;

function check<R extends { error: { message: string } | null }>(res: R): R {
  if (res.error) throw new Error(res.error.message);
  return res;
}

/** Run a select and return every row (throws on any database error). */
export async function many<T>(query: Result): Promise<T[]> {
  const { data } = check(await query);
  return ((data as unknown[] | null) ?? []).map((row) => revive<T>(row));
}

/** Run a select for at most one row (use with `.limit(1)` / `.maybeSingle()`). */
export async function one<T>(query: Result): Promise<T | null> {
  const { data } = check(await query);
  if (data === null || data === undefined) return null;
  const row = Array.isArray(data) ? data[0] : data;
  return row ? revive<T>(row) : null;
}

/** Run a `select("*", { count: "exact", head: true })` and return the count. */
export async function countOf(
  query: PromiseLike<{ count: number | null; error: { message: string } | null }>
): Promise<number> {
  const res = check(await query);
  return res.count ?? 0;
}

const TABLES_WITH_UPDATED_AT = new Set([
  "admin_users",
  "payments",
  "services",
  "blog_posts",
  "faqs",
  "testimonials",
  "site_settings",
]);

/** Tables use TEXT ids and NOT NULL "updatedAt" with no DB default, so the app supplies both. */
export async function insert<T>(table: string, data: Record<string, unknown>): Promise<T> {
  const row: Record<string, unknown> = { ...data };
  if (row.id === undefined) row.id = crypto.randomUUID();
  if (TABLES_WITH_UPDATED_AT.has(table)) row.updatedAt = new Date().toISOString();
  const { data: created } = check(await supabase.from(table).insert(row).select().single());
  return revive<T>(created);
}

export async function update(
  table: string,
  id: string | number,
  data: Record<string, unknown>
): Promise<void> {
  const row: Record<string, unknown> = { ...data };
  if (TABLES_WITH_UPDATED_AT.has(table)) row.updatedAt = new Date().toISOString();
  check(await supabase.from(table).update(row).eq("id", id));
}

export async function remove(table: string, id: string | number): Promise<void> {
  check(await supabase.from(table).delete().eq("id", id));
}

/** Insert-or-update on a unique column. Callers must pass an explicit `id` (never generated here, so an existing row's id is never clobbered). */
export async function upsert(
  table: string,
  data: Record<string, unknown>,
  onConflict: string
): Promise<void> {
  const row: Record<string, unknown> = { ...data };
  if (TABLES_WITH_UPDATED_AT.has(table)) row.updatedAt = new Date().toISOString();
  check(await supabase.from(table).upsert(row, { onConflict }));
}

/** Append an entry to the admin activity feed. Never throws — logging must not break a request. */
export async function logActivity(
  action: string,
  entityType: string,
  entityLabel: string,
  adminUserId: string | null
): Promise<void> {
  try {
    await insert("activity_log", { action, entityType, entityLabel, adminUserId });
  } catch (err) {
    console.error("Failed to write activity log:", err);
  }
}
