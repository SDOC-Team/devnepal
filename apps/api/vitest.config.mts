import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";
import { defineConfig } from "vitest/config";

if (existsSync(".env.local")) {
  loadEnv({ path: ".env.local" });
}
if (existsSync(".env")) {
  loadEnv({ path: ".env" });
}

const testDatabaseUrl =
  process.env.TEST_DATABASE_URL ?? "postgres://refined:refined@127.0.0.1:5432/refined_test";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@gov-portal/shared": fileURLToPath(
        new URL("../../packages/shared/src/index.ts", import.meta.url),
      ),
    },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    globalSetup: ["tests/global-setup.ts"],
    env: {
      NODE_ENV: "test",
      DATABASE_URL: testDatabaseUrl,
      TEST_DATABASE_URL: testDatabaseUrl,
      AUTH_SECRET: "test-secret-test-secret-test-secret-1234",
      AUTH_GITHUB_ID: "test-github-client-id",
      AUTH_GITHUB_SECRET: "test-github-client-secret",
      ADMIN_GITHUB_IDS: "424242",
      WEB_ORIGIN: "http://localhost:5173",
      STORAGE_DIR: "./.test-storage",
    },
    fileParallelism: false,
  },
});
