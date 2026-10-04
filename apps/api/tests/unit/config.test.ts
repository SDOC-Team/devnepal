import { describe, expect, it } from "vitest";

import { parseEnv } from "@/config";

const base = {
  DATABASE_URL: "postgres://user:pass@127.0.0.1:5432/app",
  AUTH_SECRET: "a".repeat(32),
  AUTH_GITHUB_ID: "client-id",
  AUTH_GITHUB_SECRET: "client-secret",
};

describe("parseEnv", () => {
  it("requires AUTH_URL in production", () => {
    expect(() => parseEnv({ ...base, NODE_ENV: "production" })).toThrow(/AUTH_URL/);
  });

  it("accepts production with AUTH_URL set", () => {
    const env = parseEnv({ ...base, NODE_ENV: "production", AUTH_URL: "https://example.gov.np" });
    expect(env.AUTH_URL).toBe("https://example.gov.np");
  });

  it("does not require AUTH_URL in development", () => {
    expect(() => parseEnv({ ...base, NODE_ENV: "development" })).not.toThrow();
  });

  it("leaves WEB_ORIGIN unset rather than defaulting to a dev origin", () => {
    expect(parseEnv(base).WEB_ORIGIN).toBeUndefined();
  });
});
