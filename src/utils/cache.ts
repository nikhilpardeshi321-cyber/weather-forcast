type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

export default class SimpleCache<T> {
  private map = new Map<string, CacheEntry<T>>();
  private ttlMs: number;

  constructor(ttlSeconds = 300) {
    this.ttlMs = ttlSeconds * 1000;
  }

  get(key: string): T | undefined {
    const e = this.map.get(key);
    if (!e) return undefined;
    if (Date.now() > e.expiresAt) {
      this.map.delete(key);
      return undefined;
    }
    return e.value;
  }

  set(key: string, value: T) {
    this.map.set(key, { value, expiresAt: Date.now() + this.ttlMs });
  }
}
