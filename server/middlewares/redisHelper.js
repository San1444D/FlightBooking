import { createClient } from 'redis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

const DEFAULT_EXPIRATION = process.env.DEFAULT_EXPIRATION || 30 * 60 ; // 30 MIN *  * 
const client = createClient({
    url: REDIS_URL
})
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect(()=> {
        console.log("Connected to Redis");
    });

const getOrSetCache = (key, cb, expiration = DEFAULT_EXPIRATION) => {
    return new Promise((resolve, reject) => {
        client.get(key, async (err, data) => {
            if (err) return reject(err);
            if (data != null) {
                return resolve(JSON.parse(data));
            } else {
                const freshData = await cb();
                client.setex(key, expiration, JSON.stringify(freshData));
                resolve(freshData);
            }
        });
    });
}

export { getOrSetCache };