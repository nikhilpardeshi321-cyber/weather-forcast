"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SimpleCache {
    constructor(ttlSeconds = 300) {
        this.map = new Map();
        this.ttlMs = ttlSeconds * 1000;
    }
    get(key) {
        const e = this.map.get(key);
        if (!e)
            return undefined;
        if (Date.now() > e.expiresAt) {
            this.map.delete(key);
            return undefined;
        }
        return e.value;
    }
    set(key, value) {
        this.map.set(key, { value, expiresAt: Date.now() + this.ttlMs });
    }
}
exports.default = SimpleCache;
