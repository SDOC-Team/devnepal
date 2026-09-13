import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema";

declare global {
  // Reused across Next.js dev hot reloads so the pool is not re-created per reload.
  var __refinedDevPool: Pool | undefined;
}

function createPool(): Pool {
  // Intentionally read process.env directly: this module is imported during
  // `next build`, where no database configuration exists. Startup validation
  // lives in instrumentation.ts, and every other module validates lazily.
  return new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 5,
  });
}

const pool = globalThis.__refinedDevPool ?? createPool();
if (process.env.NODE_ENV !== "production") {
  globalThis.__refinedDevPool = pool;
}

export const db = drizzle(pool, { schema });

export type Database = typeof db;
