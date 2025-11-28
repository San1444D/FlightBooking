## Purpose

This repo is a simple monorepo with a Vite + React frontend (`client/`) and an Express + Mongoose backend (`server/`). The intent of this file is to give AI coding agents the minimal, concrete context needed to be productive here.

## High-level architecture

- **Frontend:** `client/` — Vite + React app (ESM). UI lives in `client/src/` with pages in `client/src/pages/`, presentational components in `client/src/components/`, and Redux reducers/slicers in `client/src/slicers/`.
- **Backend:** `server/` — Express (ESM) with Mongoose. Entrypoint is `server/index.js`. DB connection utility should live in `server/connect.js`.
- **Separation of concerns:** network/API surface is implemented by `server/routes/` (register routes in `server/index.js`) and business logic lives in `server/controllers/`. Mongoose models belong in `server/models/`.

## Key developer workflows (commands)

- **Start frontend (dev/HMR):** `cd client && npm run dev` (Vite dev server)
- **Build frontend for production:** `cd client && npm run build` and `cd client && npm run preview` to locally preview the build
- **Start backend (dev):** `cd server && npm run dev` (uses `nodemon index.js` per `server/package.json`)
- **Start backend (prod):** `cd server && npm start` (runs `node index.js`)

Note: Both `client/package.json` and `server/package.json` set `"type": "module"` — use ESM `import`/`export` rather than CommonJS `require`.

## Project-specific conventions & patterns

- **ESM-only:** Files and examples should use `import` / `export` and top-level `await` may be permitted where Node/Esm allows it.
- **File layout expectations:**
  - `server/index.js` — create and start Express `app` and register routes, e.g. `app.use('/api/users', usersRoute)`.
  - `server/connect.js` — central place for Mongoose connection logic (call from `index.js`).
  - `server/routes/<resource>.js` — export an Express `Router()`.
  - `server/controllers/<resource>Controller.js` — export handler functions used by routes.
  - `server/models/<Resource>.js` — Mongoose schema + model.
- **Frontend state:** `client/src/slicers/` indicates Redux usage; follow existing patterns (slice per domain) and export actions/selectors from each slicer file.
- **Assets and static files:** `client/public/` and `client/src/assets/` — prefer `src/assets` for module imports, `public/` for truly static files served by Vite.

## Integration points & dependencies

- **HTTP client:** front-end uses `axios` (see `client/package.json`) — follow existing axios usage (centralized instances recommended).
- **DB:** backend uses `mongoose`. Look for/put connection strings and credentials into environment variables; `server/connect.js` is where to centralize.
- **Dev tools:** `nodemon` on backend, `vite` on frontend. ESLint is configured under `client/` (`eslint.config.js` exists).

## Minimal examples (copy-ready)

Backend route registration (in `server/index.js`):
```js
import express from 'express'
import usersRoute from './routes/users.js'
import connectDB from './connect.js'
````instructions
## Purpose

This monorepo contains a Vite + React frontend (`client/`) and an Express + Mongoose backend (`server/`). This file gives AI coding agents the concrete, project-specific knowledge to be productive quickly.

## Architecture & MVC mapping

- Frontend (`client/`): Vite + React (ESM). Pages under `client/src/pages/`, components in `client/src/components/`, and Redux slices in `client/src/slicers/`.
- Backend (`server/`): Express (ESM) + Mongoose. Follow MVC:
  - Models: `server/models/` (Mongoose schemas: `User`, `Flight`, `Booking`, `Payment`, `Notification`).
  - Controllers: `server/controllers/` (thin handlers that call models/services).
  - Routes (View layer): `server/routes/` — register routers in `server/index.js`.
  - Database connection: centralize in `server/connect.js` and call it from `server/index.js`.

## Customer / Admin feature mapping (how UI maps to API)

- Customer pages: `Login/Signup`, `Dashboard` (upcoming trips, offers), `SearchFlights`, `FlightDetails`, `Checkout`, `MyBookings`, `Profile`, `Support`.
- Admin pages: `AdminFlights`, `AdminBookings`, `Users`, `Analytics/Dashboard`.
- Backend endpoints should follow REST conventions, e.g.: `/api/auth/*`, `/api/flights/*`, `/api/bookings/*`, `/api/users/*`, `/api/payments/*`, `/api/notifications/*`.

## Security, auth & roles

- Use JWT for authentication; store secret in environment variables. Protect routes with `server/middlewares/auth.js` that verifies token and role (`user` vs `admin`).
- Encrypt passwords with `bcryptjs`. Do not store raw card data — integrate a payment provider and store tokens.

## Recommended packages (discoverable & used in this project)

- Backend: `express`, `mongoose`, `dotenv`, `cors`, `bcryptjs`, `jsonwebtoken`, `multer` (for file uploads), `nodemon` (dev).
- Frontend: `react`, `axios`, `react-router-dom`, `redux` (slices in `client/src/slicers/`), `react-toastify`, UI lib (Bootstrap/Material UI).

## Environment & run commands

- Put secrets into a `.env` file at `server/` root (e.g., `MONGODB_URI`, `JWT_SECRET`, `PORT`).
- Dev servers (two terminals):
```pwsh
cd server
npm run dev

cd ../client
npm run dev
```

## Data model notes (high level)

- `User`: email, hashed password, name, contact, passport details, role, frequent flyer numbers, preferences.
- `Flight`: airline, flightNumber, origin, destination, departure/arrival times, seat map/availability, price, class.
- `Booking`: userRef, flightRef, seats, priceBreakdown, status, paymentRef, createdAt.

## Testing, validation & production concerns

- Test auth flows, CRUD for flights/bookings, payment success/failure, and search/availability logic.
- Add indexes for frequent queries (e.g., flights by origin/destination/date) and use pagination for large lists.
- Add request validation and consistent error responses. Use centralized error middleware in `server/middlewares/`.

## Examples & quick snippets

Backend route registration (in `server/index.js`):
```js
import express from 'express'
import connectDB from './connect.js'
import flightsRoute from './routes/flights.js'

const app = express()
app.use(express.json())
app.use('/api/flights', flightsRoute)

await connectDB()
app.listen(process.env.PORT || 5000)
```

Frontend `axios` instance pattern (place under `client/src/`):
```js
import axios from 'axios'
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' })
api.interceptors.request.use(cfg => { /* attach token from storage */ return cfg })
export default api
```

## Where to start (files to inspect)

- `server/index.js` and `server/connect.js` (entry + DB)
- `server/routes/`, `server/controllers/`, `server/models/` (implement features here)
- `client/src/` (`main.jsx`, `App.jsx`, `pages/`, `slicers/`)

## When to ask the maintainer

- Which port to expose, CORS policy, and JWT secret handling
- Preferred payment provider (Stripe/PayPal) and notification channels
- Admin roles & exact privileges for role-based routes

---
If you want, I can scaffold starter back-end files (`index.js`, `connect.js`, basic models/controllers) or create an API spec that maps Customer/Admin flows to concrete endpoints. Tell me which and I'll proceed.

````
