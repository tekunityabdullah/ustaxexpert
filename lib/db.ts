import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { readDbEnv } from "@/lib/db-env";

// Prisma 7 requires a driver adapter — this one talks MySQL/MariaDB wire
// protocol, built from the separate DB_HOST/DB_PORT/DB_USER/DB_PASSWORD/
// DB_NAME env vars (see .env.example) rather than a single DATABASE_URL.
function buildAdapter() {
  const conn = readDbEnv();
  if (!conn) return null;

  return new PrismaMariaDb({
    host: conn.host,
    port: conn.port,
    user: conn.user,
    password: conn.password,
    database: conn.database,
    connectionLimit: 5,
  });
}

// Standard Next.js dev-mode singleton: without this, hot reload would spin
// up a fresh PrismaClient (and a fresh connection pool) on every file save.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const adapter = buildAdapter();

// `adapter` is only null when the DB env vars aren't set yet (e.g. before
// the admin panel's database has been provisioned). PrismaClient still
// constructs fine in that case; any actual query will throw a clear error
// rather than the app failing to build/start.
export const prisma =
  globalForPrisma.prisma ?? new PrismaClient(adapter ? { adapter } : undefined);

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
