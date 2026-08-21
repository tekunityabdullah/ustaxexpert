// Shared by lib/db.ts (the app's Prisma client, needs discrete fields for
// the @prisma/adapter-mariadb driver adapter) and prisma.config.ts (the
// Prisma CLI, needs a single connection-string URL) — one place reads the
// separate DB_HOST/DB_PORT/DB_USER/DB_PASSWORD/DB_NAME env vars so both
// stay in sync.

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
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD ?? "",
    database,
  };
}

/**
 * A mysql:// connection string built from the discrete env vars — only
 * needed because Prisma's CLI config (prisma.config.ts) wants a single URL,
 * not discrete fields. Falls back to a syntactically valid placeholder so
 * `prisma generate` still works before a real database is configured.
 */
export function buildDatabaseUrl(): string {
  const conn = readDbEnv();
  if (!conn) return "mysql://user:password@localhost:3306/change_me";

  const auth = conn.password
    ? `${encodeURIComponent(conn.user)}:${encodeURIComponent(conn.password)}`
    : encodeURIComponent(conn.user);
  return `mysql://${auth}@${conn.host}:${conn.port}/${conn.database}`;
}
