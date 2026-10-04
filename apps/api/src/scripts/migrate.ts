import { config as loadEnv } from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

loadEnv({ path: ".env.local" });
loadEnv();

// Applies the SQL migrations in ./drizzle, relative to the working directory:
// apps/api locally, and the app directory in the production image. Drizzle
// records applied migrations, so rerunning is safe.
async function main(): Promise<void> {
  const connectionString = process.env.DATABASE_URL;
  if (connectionString === undefined || connectionString.length === 0) {
    throw new Error("DATABASE_URL is required");
  }
  const pool = new Pool({ connectionString, max: 1 });
  try {
    await migrate(drizzle(pool), { migrationsFolder: "drizzle" });
  } finally {
    await pool.end();
  }
  console.log("Migrations applied.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exit(1);
  });
