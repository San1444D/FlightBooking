import { rateLimit } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import RedisClient from "ioredis";

const configRateLimiter = () => {

  const REDIS_URL = process.env.REDIS_URL;

  console.log('Rate Limiter connecting to Redis at:', REDIS_URL);
  const client = new RedisClient(REDIS_URL);
  client.on('connect', () => console.log('IORedis connected'));
  client.on('error', (err) => console.error('IORedis error:', err));

  const limiter = rateLimit({
    // Rate limiter configuration
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "") || 15 * 60 * 1e3,
    // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUEST || "") || 100,
    // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true,
    // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false,
    // Disable the `X-RateLimit-*` headers
    // Redis store configuration
    store: new RedisStore({
      sendCommand: (command, ...args) => client.call(command, ...args)
    })
    // 	store: new RedisStore({
    //     // sendCommand is the function rate-limit-redis uses to send commands to Redis
    //     sendCommand: async (command, ...args) => {
    //       // Ensure the client is open before sending commands
    //       if (!client.isOpen) {
    //         await client.connect();
    //       }
    //       return client.call(command, ...args);
    //     },
    //   }),
  });
  return limiter;
};
export { configRateLimiter };
