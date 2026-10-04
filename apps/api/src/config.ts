import { z } from "zod";

const envSchema = z
  .object({
    NODE_ENV: z.string().optional(),
    DATABASE_URL: z.url(),
    AUTH_SECRET: z.string().min(32, "AUTH_SECRET must be at least 32 characters"),
    AUTH_GITHUB_ID: z.string().min(1, "AUTH_GITHUB_ID is required"),
    AUTH_GITHUB_SECRET: z.string().min(1, "AUTH_GITHUB_SECRET is required"),
    // The public origin. Auth.js builds the GitHub callback URL from it; without
    // it the production server uses its own bind address (0.0.0.0:3000).
    AUTH_URL: z.url().optional(),
    ADMIN_GITHUB_IDS: z.string().default(""),
    // Extra origin for external clients (CORS, CSRF, post-login redirects).
    // Unset means same-origin only; no default, so production never trusts a dev origin.
    WEB_ORIGIN: z.url().optional(),
    STORAGE_DIR: z.string().min(1).default("./storage"),
    GITHUB_WEBHOOK_SECRET: z.string().default(""),
  })
  .refine((env) => env.NODE_ENV !== "production" || env.AUTH_URL !== undefined, {
    path: ["AUTH_URL"],
    message: "AUTH_URL is required in production, e.g. https://devnepal.gov.np",
  });

export type AppEnv = z.infer<typeof envSchema>;

/** Validates an environment; throws with every problem listed. */
export function parseEnv(env: Record<string, string | undefined>): AppEnv {
  const parsed = envSchema.safeParse(env);
  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid environment configuration:\n${details}`);
  }
  return parsed.data;
}

let cachedEnv: AppEnv | null = null;

export function getEnv(): AppEnv {
  if (cachedEnv === null) {
    cachedEnv = parseEnv(process.env);
  }
  return cachedEnv;
}

let cachedAdminIds: ReadonlySet<number> | null = null;

export function getAdminGithubIds(): ReadonlySet<number> {
  if (cachedAdminIds === null) {
    const raw = getEnv().ADMIN_GITHUB_IDS;
    const ids = new Set<number>();
    for (const entry of raw.split(",")) {
      const trimmed = entry.trim();
      if (trimmed.length === 0) {
        continue;
      }
      if (!/^\d+$/.test(trimmed)) {
        throw new Error(`ADMIN_GITHUB_IDS contains a non-numeric entry: "${trimmed}"`);
      }
      const value = Number(trimmed);
      if (!Number.isSafeInteger(value) || value <= 0) {
        throw new Error(`ADMIN_GITHUB_IDS contains an invalid GitHub id: "${trimmed}"`);
      }
      ids.add(value);
    }
    cachedAdminIds = ids;
  }
  return cachedAdminIds;
}

export function isAdminGithubId(githubId: number): boolean {
  return getAdminGithubIds().has(githubId);
}
