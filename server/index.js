// server/index.js
// Entry point for the Express backend.
// - Loads environment variables
// - (Optionally) connects to MongoDB via `server/connect.js`
// - Registers middleware (body parsers, CORS)
// - Mounts routers from `server/routes/`
// - Starts the HTTP server

import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { connectDB } from './connect.js';
import { limiter } from './middlewares/rateLimiter.ts';

// Load environment variables from `server/.env` (MONGODB_URI, JWT_SECRET, PORT, etc.)
dotenv.config()

// Connect to the database.
// Implement `connectDB` in `server/connect.js` to export a named function `connectDB`.
// If you prefer a default export, update this import accordingly.
try {
    // Calling connectDB is optional when connect.js is a stub; handle errors in connect.js.
    connectDB()
} catch (err) {
    // Do not crash the process here; connect.js should throw if DB is required.
    console.warn('Warning: connectDB() raised an error (check server/connect.js):', err?.message || err)
}

const app = express()

// --- Middleware ---
// Parse JSON bodies (use express.json() directly in newer projects if preferred)
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cookieParser()) // <- required to populate req.cookies
app.use(limiter); // Apply rate limiting middleware

// Enable CORS. For production, restrict origins via options: `cors({ origin: 'https://example.com' })`.
app.use(cors(
    {
        origin: process.env.CORS_ORIGIN || '*',
        credentials: true,
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }
))




// --- Routes ---
// Route files should live in `server/routes/` and export an Express Router instance.
// Example: `server/routes/authRoutes.js` exports default router and is mounted below.
import authRoute from './routes/authRoutes.js'
// import customerRouters from './routes/customerRouters.js'
// import flightRouters from './routes/flightRouters.js'
// import adminRoutes from './routes/adminRoutes.js'

app.use('/api/auth', authRoute) // auth: signup, login, token refresh
// app.use('/api/customers', customerRouters) // public or protected customer endpoints
// app.use('/api/flights', flightRouters) // flight search, details, admin flight management
// app.use('/api/admin', adminRoutes) // admin-only endpoints (protect with auth middleware)



// --- Healthcheck ---
app.get('/api/health', (req, res) => res.json({ status: 'ok' }))


// --- Error handling ---
// Centralized error handler: controllers should `throw` or `next(err)` with a `status` property.
app.use((err, req, res, next) => {
    console.error(err)
    res.status(err?.status || 500).json({ error: err?.message || 'Internal server error' })
})

// --- Start server ---
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})