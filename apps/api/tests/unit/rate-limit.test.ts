import { beforeEach, describe, expect, it } from "vitest";

import { clientIp, RATE_LIMITS, rateLimit, resetRateLimits } from "@/server/rate-limit";

const rule = { limit: 3, windowMs: 60_000 };

describe("rateLimit", () => {
  beforeEach(() => {
    resetRateLimits();
  });

  it("allows requests up to the limit and then blocks with a retry hint", () => {
    for (let index = 0; index < rule.limit; index += 1) {
      expect(rateLimit("test", "ip", rule).allowed).toBe(true);
    }
    const blocked = rateLimit("test", "ip", rule);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("tracks keys and buckets independently", () => {
    expect(rateLimit("alpha", "one", rule).allowed).toBe(true);
    expect(rateLimit("alpha", "two", rule).allowed).toBe(true);
    expect(rateLimit("beta", "one", rule).allowed).toBe(true);
  });

  it("resets after the window elapses", async () => {
    const short = { limit: 1, windowMs: 25 };
    expect(rateLimit("short", "ip", short).allowed).toBe(true);
    expect(rateLimit("short", "ip", short).allowed).toBe(false);
    await new Promise((resolve) => setTimeout(resolve, 40));
    expect(rateLimit("short", "ip", short).allowed).toBe(true);
  });

  it("reports the remaining allowance", () => {
    expect(rateLimit("remaining", "ip", rule).remaining).toBe(2);
    rateLimit("remaining", "ip", rule);
    expect(rateLimit("remaining", "ip", rule).remaining).toBe(0);
  });

  it("ships sane rules for every bucket", () => {
    for (const entry of Object.values(RATE_LIMITS)) {
      expect(entry.limit).toBeGreaterThan(0);
      expect(entry.windowMs).toBeGreaterThanOrEqual(1000);
    }
  });
});

describe("clientIp", () => {
  it("prefers the Cloudflare client IP header", () => {
    const request = new Request("http://localhost/profile", {
      headers: {
        "cf-connecting-ip": "203.0.113.9",
        "x-forwarded-for": "10.0.0.1, 10.0.0.2",
      },
    });
    expect(clientIp(request)).toBe("203.0.113.9");
  });

  it("uses the first x-forwarded-for hop", () => {
    const request = new Request("http://localhost/profile", {
      headers: { "x-forwarded-for": "203.0.113.9, 10.0.0.1" },
    });
    expect(clientIp(request)).toBe("203.0.113.9");
  });

  it("falls back to x-real-ip and then to a shared unknown key", () => {
    const realIp = new Request("http://localhost/profile", {
      headers: { "x-real-ip": "198.51.100.7" },
    });
    expect(clientIp(realIp)).toBe("198.51.100.7");
    expect(clientIp(new Request("http://localhost/profile"))).toBe("unknown");
  });
});
