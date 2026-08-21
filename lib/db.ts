import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

// Prisma 7 requires a driver adapter — this one talks MySQL/MariaDB wire
// protocol. Parse the single DATABASE_URL (mysql://user:pass@host:port/db)
// into the discrete fields the adapter wants.
function buildAdapter() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return null;

  const url = new URL(connectionString);
  return new PrismaMariaDb({
    host: url.hostname,
    port: url.port ? Number(url.port) : 3306,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.replace(/^\//, ""),
    connectionLimit: 5,
  });
}

// Standard Next.js dev-mode singleton: without this, hot reload would spin
// up a fresh PrismaClient (and a fresh connection pool) on every file save.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const adapter = buildAdapter();

// `adapter` is only null when DATABASE_URL isn't set yet (e.g. before the
// admin panel's database has been provisioned). PrismaClient still
// constructs fine in that case; any actual query will throw a clear error
// rather than the app failing to build/start.
export const prisma =
  globalForPrisma.prisma ?? new PrismaClient(adapter ? { adapter } : undefined);

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
