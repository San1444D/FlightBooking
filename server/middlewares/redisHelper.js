import { createClient } from 'redis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

const DEFAULT_EXPIRATION = process.env.DEFAULT_EXPIRATION || 30 * 60; // 30 MIN *  * 
const client = createClient({
    url: REDIS_URL
});
client.on("error", (err) => console.log("Redis Client Error", err))
client.connect()
    .then(() => { console.log("✅ Connected to Redis"); })
    .catch((err) => { console.error("❌ Redis connection error:", err); });

const getOrSetCache = async (key, cb, expiration = DEFAULT_EXPIRATION) => {
    try {
        // use the node-redis v4 promise API
        const data = await client.get(key);
        if (data != null) {
            return JSON.parse(data);
        }
        const freshData = await cb();
        if (freshData == null) {
            return null;
        }
        // setEx expects seconds for expiry
        await client.setEx(key, expiration, JSON.stringify(freshData));
        return freshData;
    } catch (err) {
        throw err;
    }
};

export { getOrSetCache };