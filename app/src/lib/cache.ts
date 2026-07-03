interface CacheOptions<T> {
  ttl: number;
  staleWhileRevalidate?: number;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

const cacheStore = new Map<string, CacheEntry<any>>();

export class Cache<T = any> {
  private ttl: number;
  private staleWhileRevalidate: number;

  constructor(options: CacheOptions<T>) {
    this.ttl = options.ttl;
    this.staleWhileRevalidate = options.staleWhileRevalidate || 0;
  }

  async get(key: string, fetchFn: () => Promise<T>): Promise<T> {
    const now = Date.now();
    const entry = cacheStore.get(key);

    if (entry) {
      const age = now - entry.timestamp;
      if (age < entry.ttl) {
        return entry.data;
      }
      if (this.staleWhileRevalidate > 0 && age < entry.ttl + this.staleWhileRevalidate) {
        fetchFn().then(data => cacheStore.set(key, { data, timestamp: Date.now(), ttl: this.ttl })).catch(() => {});
        return entry.data;
      }
    }

    const data = await fetchFn();
    cacheStore.set(key, { data, timestamp: now, ttl: this.ttl });
    return data;
  }

  set(key: string, data: T): void {
    cacheStore.set(key, { data, timestamp: Date.now(), ttl: this.ttl });
  }

  delete(key: string): void {
    cacheStore.delete(key);
  }

  clear(): void {
    cacheStore.clear();
  }

  has(key: string): boolean {
    const entry = cacheStore.get(key);
    if (!entry) return false;
    return Date.now() - entry.timestamp < entry.ttl;
  }
}

export const empireCache = new Cache<any>({ ttl: 5 * 60 * 1000, staleWhileRevalidate: 1 * 60 * 1000 });
export const feedCache = new Cache<any>({ ttl: 10 * 60 * 1000, staleWhileRevalidate: 2 * 60 * 1000 });
export const leaderboardCache = new Cache<any>({ ttl: 15 * 60 * 1000 });
export const userCache = new Cache<any>({ ttl: 2 * 60 * 1000 });