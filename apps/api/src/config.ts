import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.url(),
  AUTH_SECRET: z.string().min(32, "AUTH_SECRET must be at least 32 characters"),
  AUTH_GITHUB_ID: z.string().min(1, "AUTH_GITHUB_ID is required"),
  AUTH_GITHUB_SECRET: z.string().min(1, "AUTH_GITHUB_SECRET is required"),
  ADMIN_GITHUB_IDS: z.string().default(""),
  WEB_ORIGIN: z.url().default("http://localhost:5173"),
  STORAGE_DIR: z.string().min(1).default("./storage"),
});

export type AppEnv = z.infer<typeof envSchema>;

let cachedEnv: AppEnv | null = null;

export function getEnv(): AppEnv {
  if (cachedEnv === null) {
    const parsed = envSchema.safeParse(process.env);
    if (!parsed.success) {
      const details = parsed.error.issues
        .map((issue) => `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`)
        .join("\n");
      throw new Error(`Invalid environment configuration:\n${details}`);
    }
    cachedEnv = parsed.data;
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
