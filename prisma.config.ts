// Read by the Prisma CLI (migrate/generate/studio) — a separate process
// from the Next.js app, so it doesn't get .env.local loaded automatically.
// Plain `dotenv` only reads `.env` by default, so point it at .env.local
// explicitly (falling back to .env if that's what's present instead).
import { config as loadEnv } from "dotenv";
import { existsSync } from "node:fs";
loadEnv({ path: existsSync(".env.local") ? ".env.local" : ".env" });

import { defineConfig } from "prisma/config";
import { buildDatabaseUrl } from "./lib/db-env";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: buildDatabaseUrl(),
  },
});
