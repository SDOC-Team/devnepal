import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

import { getTestDatabaseUrl } from "./test-env";

export default async function globalSetup(): Promise<void> {
  const url = getTestDatabaseUrl();
  await ensureDatabaseExists(url);

  const pool = new Pool({ connectionString: url, max: 1 });
  try {
    const db = drizzle(pool);
    await migrate(db, { migrationsFolder: "drizzle" });
  } finally {
    await pool.end();
  }
}

async function ensureDatabaseExists(url: string): Promise<void> {
  const target = new URL(url);
  const databaseName = target.pathname.replace(/^\//, "");
  if (databaseName.length === 0) {
    throw new Error("TEST_DATABASE_URL must include a database name");
  }

  const adminUrl = new URL(url);
  adminUrl.pathname = "/postgres";

  const pool = new Pool({ connectionString: adminUrl.toString(), max: 1 });
  try {
    const existing = await pool.query("select 1 from pg_database where datname = $1", [
      databaseName,
    ]);
    if (existing.rowCount === 0) {
      await pool.query(`create database "${databaseName.replace(/"/g, "")}"`);
    }
  } finally {
    await pool.end();
  }
}
