// This is a simple in-memory cache implementation
// In production, you would use Redis or another distributed cache

type CacheEntry<T> = {
    data: T;
    expiry: number;
};

class Cache {
    private cache: Map<string, CacheEntry<any>> = new Map();

    async get<T>(key: string): Promise<T | null> {
        const entry = this.cache.get(key);

        if (!entry) {
            return null;
        }

        // Check if the entry has expired
        if (Date.now() > entry.expiry) {
            this.cache.delete(key);
            return null;
        }

        return entry.data as T;
    }

    async set<T>(key: string, data: T, ttlSeconds: number): Promise<void> {
        const expiry = Date.now() + ttlSeconds * 1000;
        this.cache.set(key, { data, expiry });
    }

    async delete(key: string): Promise<void> {
        this.cache.delete(key);
    }
}

// Export a singleton instance
export const cache = new Cache(); 