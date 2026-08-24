// Shared by lib/db.ts (the app's Prisma client, needs discrete fields for
// the @prisma/adapter-pg driver adapter) and prisma.config.ts (the Prisma
// CLI, needs a single connection-string URL) — one place reads the
// separate DB_HOST/DB_PORT/DB_USER/DB_PASSWORD/DB_NAME env vars so both
// stay in sync. Postgres via Supabase — get these from the Supabase
// dashboard: Project Settings → Database → Connection parameters.

export type DbConnection = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
};

/** Returns null when the database hasn't been configured yet (DB_HOST/DB_NAME unset). */
export function readDbEnv(): DbConnection | null {
  const host = process.env.DB_HOST;
  const database = process.env.DB_NAME;
  if (!host || !database) return null;

  return {
    host,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD ?? "",
    database,
  };
}

/**
 * A postgresql:// connection string built from the discrete env vars —
 * only needed because Prisma's CLI config (prisma.config.ts) wants a
 * single URL, not discrete fields. Falls back to a syntactically valid
 * placeholder so `prisma generate` still works before a real database is
 * configured. `sslmode=no-verify` (not `require`) — modern pg/Prisma treat
 * `require` as full certificate verification, and Node's default CA bundle
 * doesn't trust Supabase's pooler cert chain, which fails as an opaque
 * "can't reach database" rather than a clear TLS error. `no-verify` still
 * encrypts the connection, just skips the chain check (mirrors the
 * `rejectUnauthorized: false` used by the adapter in lib/db.ts).
 */
export function buildDatabaseUrl(): string {
  const conn = readDbEnv();
  if (!conn) return "postgresql://postgres:password@localhost:5432/change_me";

  const auth = conn.password
    ? `${encodeURIComponent(conn.user)}:${encodeURIComponent(conn.password)}`
    : encodeURIComponent(conn.user);
  // connect_timeout=20 — the schema engine's default connect timeout is too
  // short for Supabase's pooler on some networks, and a timeout surfaces as
  // the same generic "can't reach database server" (P1001) as a real outage.
  return `postgresql://${auth}@${conn.host}:${conn.port}/${conn.database}?sslmode=no-verify&connect_timeout=20`;
}
