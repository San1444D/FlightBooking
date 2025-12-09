import { rateLimit } from 'express-rate-limit'
import { RedisStore, type RedisReply } from 'rate-limit-redis'
import RedisClient from 'ioredis'

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

// Create a `ioredis` client
// const client = new RedisClient(REDIS_URL)
const client = new RedisClient({
	username: 'default',
	password: 'h1EatYlWEUd7wJCrE4nCXVBwx1BkdTcO',
	host: 'redis-12473.c212.ap-south-1-1.ec2.cloud.redislabs.com',
	port: 12473
})
// ... (see https://github.com/luin/ioredis#connect-to-redis)

// Create and use the rate limiter
const limiter = rateLimit({
	// Rate limiter configuration
	windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '') || 15 * 60 * 1000, // 15 minutes
	max: parseInt(process.env.RATE_LIMIT_MAX_REQUEST || '') || 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers

	// Redis store configuration
	store: new RedisStore({
		sendCommand: (command: string, ...args: string[]) =>
			client.call(command, ...args) as Promise<RedisReply>,
	}),
})

export { limiter }