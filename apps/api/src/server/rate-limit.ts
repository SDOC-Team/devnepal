import { RateLimitedError } from "./errors";

export type RateLimitRule = {
  limit: number;
  windowMs: number;
};

/**
 * Per-process fixed-window limits. This is a single-instance deployment
 * (one Node server), so in-memory counters are sufficient; if the app is ever
 * scaled out, replace the store with a shared one (for example Postgres).
 */
export const RATE_LIMITS = {
  auth: { limit: 30, windowMs: 60_000 },
  webhooks: { limit: 60, windowMs: 60_000 },
  profileWrite: { limit: 30, windowMs: 60_000 },
  adminWrite: { limit: 120, windowMs: 60_000 },
} as const satisfies Record<string, RateLimitRule>;

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

type Entry = {
  count: number;
  resetAt: number;
};

const MAX_KEYS_PER_BUCKET = 5_000;

const buckets = new Map<string, Map<string, Entry>>();

export function rateLimit(bucketName: string, key: string, rule: RateLimitRule): RateLimitResult {
  const now = Date.now();
  let bucket = buckets.get(bucketName);
  if (bucket === undefined) {
    bucket = new Map();
    buckets.set(bucketName, bucket);
  }

  const entry = bucket.get(key);
  if (entry === undefined || entry.resetAt <= now) {
    if (bucket.size >= MAX_KEYS_PER_BUCKET) {
      for (const [existingKey, existing] of bucket) {
        if (existing.resetAt <= now) {
          bucket.delete(existingKey);
        }
      }
    }
    bucket.set(key, { count: 1, resetAt: now + rule.windowMs });
    return { allowed: true, remaining: rule.limit - 1, retryAfterSeconds: 0 };
  }

  entry.count += 1;
  if (entry.count > rule.limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
    };
  }
  return { allowed: true, remaining: rule.limit - entry.count, retryAfterSeconds: 0 };
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded !== null) {
    const first = forwarded.split(",")[0]?.trim();
    if (first !== undefined && first.length > 0) {
      return first;
    }
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

export function enforceRateLimit(request: Request, bucketName: keyof typeof RATE_LIMITS): void {
  const rule = RATE_LIMITS[bucketName];
  const result = rateLimit(bucketName, clientIp(request), rule);
  if (!result.allowed) {
    throw new RateLimitedError(result.retryAfterSeconds);
  }
}

export function resetRateLimits(): void {
  buckets.clear();
}
