import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { readDbEnv, buildDatabaseUrl } from "@/lib/db-env";

// Prisma 7 requires a driver adapter — this one talks Postgres wire
// protocol (via node-postgres), built from the separate DB_HOST/DB_PORT/
// DB_USER/DB_PASSWORD/DB_NAME env vars (see .env.example) rather than a
// single DATABASE_URL. Backed by Supabase's hosted Postgres.
//
// Unlike the previous MariaDB adapter, Prisma 7's Postgres-adapter client
// throws immediately if PrismaClient is constructed with no adapter at all
// — it won't let you defer the failure to query time. So this always
// builds a real PrismaPg adapter; when the DB env vars aren't set yet, it
// points at a syntactically valid placeholder URL instead of connection
// details, so construction still succeeds and every call site's existing
// try/catch around its actual query is what surfaces the "not connected"
// state (same UX as before, just moved one layer down).
function buildAdapter() {
  const conn = readDbEnv();
  if (!conn) return new PrismaPg(buildDatabaseUrl());

  return new PrismaPg({
    host: conn.host,
    port: conn.port,
    user: conn.user,
    password: conn.password,
    database: conn.database,
    max: 5,
    // Supabase requires SSL on its direct-connection port; skip strict cert
    // validation since Node's default CA bundle doesn't always include it.
    ssl: { rejectUnauthorized: false },
    // node-postgres's default connect timeout is too short for Supabase's
    // pooler on some networks — see buildDatabaseUrl()'s connect_timeout.
    connectionTimeoutMillis: 20_000,
  });
}

// Standard Next.js dev-mode singleton: without this, hot reload would spin
// up a fresh PrismaClient (and a fresh connection pool) on every file save.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter: buildAdapter() });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
