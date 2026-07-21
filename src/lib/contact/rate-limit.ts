import "server-only";

import { checkRateLimit } from "@vercel/firewall";

import type { ContactRateLimiter } from "@/types/contact-request";

const rateLimitId = "contact-request";
const localWindowMs = 10 * 60 * 1_000;
const localMaximum = 3;

interface LocalBucket {
  count: number;
  resetAt: number;
}

const localBuckets = new Map<string, LocalBucket>();

function localRateLimitKey(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local-development";
}

function checkLocalLimit(request: Request): "allowed" | "limited" {
  const now = Date.now();
  const key = localRateLimitKey(request);
  const existing = localBuckets.get(key);

  if (!existing || existing.resetAt <= now) {
    localBuckets.set(key, { count: 1, resetAt: now + localWindowMs });
    return "allowed";
  }

  if (existing.count >= localMaximum) {
    return "limited";
  }

  existing.count += 1;
  return "allowed";
}

export const contactRateLimiter: ContactRateLimiter = Object.freeze({
  async check(request: Request) {
    if (process.env.VERCEL_ENV) {
      try {
        const result = await checkRateLimit(rateLimitId, { request });
        if (result.rateLimited || result.error === "blocked") {
          return "limited";
        }
        return result.error === "not-found" ? "unavailable" : "allowed";
      } catch {
        return "unavailable";
      }
    }

    if (process.env.NODE_ENV === "production") {
      return "unavailable";
    }

    return checkLocalLimit(request);
  },
});
