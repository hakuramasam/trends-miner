interface RateLimitOptions {
  windowMs: number;
  max: number;
}

interface RateLimitEntry {
  timestamp: number;
  count: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

export class RateLimiter {
  private windowMs: number;
  private max: number;

  constructor(options: RateLimitOptions) {
    this.windowMs = options.windowMs;
    this.max = options.max;
  }

  check(key: string, action: string): { allowed: boolean; remaining: number; retryAfter?: number } {
    const now = Date.now();
    const storeKey = `${action}:${key}`;
    const entry = rateLimitStore.get(storeKey);

    if (!entry || now - entry.timestamp > this.windowMs) {
      rateLimitStore.set(storeKey, { timestamp: now, count: 1 });
      return { allowed: true, remaining: this.max - 1 };
    }

    if (entry.count >= this.max) {
      const retryAfter = Math.ceil((this.windowMs - (now - entry.timestamp)) / 1000);
      return { allowed: false, remaining: 0, retryAfter };
    }

    entry.count++;
    return { allowed: true, remaining: this.max - entry.count };
  }

  reset(key: string, action: string): void {
    const storeKey = `${action}:${key}`;
    rateLimitStore.delete(storeKey);
  }

  resetAll(): void {
    rateLimitStore.clear();
  }
}

export const apiRateLimiter = new RateLimiter({ windowMs: 60 * 1000, max: 100 });
export const claimRateLimiter = new RateLimiter({ windowMs: 60 * 1000, max: 5 });
export const neynarRateLimiter = new RateLimiter({ windowMs: 60 * 1000, max: 20 });
export const feedRateLimiter = new RateLimiter({ windowMs: 60 * 1000, max: 30 });