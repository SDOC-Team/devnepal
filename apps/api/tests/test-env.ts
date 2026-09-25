import { existsSync } from "node:fs";

import { config as loadEnv } from "dotenv";

if (existsSync(".env.local")) {
  loadEnv({ path: ".env.local" });
}
if (existsSync(".env")) {
  loadEnv({ path: ".env" });
}

export function getTestDatabaseUrl(): string {
  return process.env.TEST_DATABASE_URL ?? "postgres://refined:refined@127.0.0.1:5432/refined_test";
}
