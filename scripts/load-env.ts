// Must be the FIRST import in any standalone script: ES imports are hoisted
// and evaluated in order, and lib/db.ts reads process.env when it's first
// imported. Next.js loads .env.local itself for the app; plain Node/tsx
// scripts (like the seed) don't, so do it here (falling back to .env).
import { config } from "dotenv";
import { existsSync } from "node:fs";

config({ path: existsSync(".env.local") ? ".env.local" : ".env", quiet: true });
