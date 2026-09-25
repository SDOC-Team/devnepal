import { existsSync } from "node:fs";

import { config as loadEnv } from "dotenv";
import { defineConfig } from "drizzle-kit";
import { z } from "zod";

if (existsSync(".env.local")) {
  loadEnv({ path: ".env.local" });
}
if (existsSync(".env")) {
  loadEnv({ path: ".env" });
}

const databaseUrl = z
  .url({ message: "DATABASE_URL must be a valid PostgreSQL URL" })
  .parse(process.env.DATABASE_URL);

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: databaseUrl },
  strict: true,
  verbose: true,
});
