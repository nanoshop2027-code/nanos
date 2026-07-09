# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Nanos is a production-ready RESTful E-commerce API (Node.js, Express 5, MongoDB/Mongoose, JWT). It ships as an auth + user-management foundation intended to be extended with commerce features. CommonJS modules throughout.

## Commands

```bash
npm run dev        # Local dev with nodemon (entry: src/app.js)
npm start          # Local production run (entry: src/app.js)
npm run vercel-dev # Run the serverless entry (api/index.js) locally
```

- **No test suite exists** — `npm test` intentionally fails. There is no linter configured.
- Manual/interactive testing is done through Swagger UI at `/api-docs` (also raw spec at `/api-docs.json`).
- Requires a `.env` file (copy from `.env.example`). Without valid `MONGODB_URI` and the JWT secrets the server will not start / will error on first request.

## Two entry points must stay in sync

There are **two nearly-identical app bootstraps** that both wire up the same middleware, routes, Swagger, and error handling:

- `src/app.js` — traditional long-lived server. Connects to DB + seeds super admin once at boot, then `app.listen`.
- `api/index.js` — Vercel serverless handler (`module.exports = async (req, res) => …`). Runs `initializeApp()` on every invocation but guards it with an `isConnected` flag + `mongoose.connection.readyState` checks (see `src/config/database.js`) so the DB connection is reused across warm invocations. Helmet CSP is disabled here so Swagger UI renders on Vercel.

**When you change middleware order, add a route, or change bootstrap behavior, apply it to BOTH files.** `vercel.json` routes all traffic to `api/index.js`; `src/app.js` is what local `npm run dev`/`start` use.

## Request flow & conventions

Every API resource follows the same pipeline. Match it when adding endpoints:

```
routes/*.js  →  validate(joiSchema)  →  [protect, restrictTo(...)]  →  controllers/*.js  →  services|models  →  responseHandler  →  errorHandler
```

- **Controllers** export handlers wrapped in `asyncHandler` (`src/utils/asyncHandler.js`) so thrown/rejected errors reach the central handler — do not add try/catch for control flow; instead `return next(new AppError(message, statusCode))`.
- **Errors**: throw `AppError` (`src/utils/AppError.js`, sets `isOperational`). `src/middleware/errorHandler.js` is the single global handler — it returns full stack in `development` and sanitized messages in production, and translates Mongoose CastError/duplicate-key(11000)/ValidationError and JWT errors into clean 4xx responses. The `.env` `NODE_ENV` drives which branch runs.
- **Responses**: use `sendSuccess(res, message, data?, statusCode?=200)` / `sendError` from `src/utils/responseHandler.js`. Shape is always `{ success, message, data? }`.
- **Validation**: request bodies are validated by Joi schemas in `src/validators/` via the `validate` middleware (`src/middleware/validate.js`, uses `abortEarly:false`, `stripUnknown:true`). Add a schema there and reference it in the route, rather than validating inside controllers.
- **Swagger docs live in the route files** as `@swagger` JSDoc comments (`src/config/swagger.js` scans `src/routes/**/*.js`). New endpoints won't appear in the docs unless annotated there.

## Auth & authorization model

- Two middleware in `src/middleware/auth.js`: `protect` (verifies the Bearer access token, loads `req.user`, rejects deactivated users) and `restrictTo(...roles)` (role gate). Chain them: `protect, restrictTo('super-admin')`.
- Three roles: `super-admin`, `admin`, `user` (enum on the User model). Exactly one super admin is **auto-seeded on startup** from `SUPER_ADMIN_*` env vars by `src/utils/createSuperAdmin.js`.
- **Tokens** (`src/services/tokenService.js`, exported as a singleton): short-lived JWT access token (stateless, verified by `protect`) + refresh token that is **persisted in the `RefreshToken` collection** and can be revoked. Password change / reset revokes all of a user's refresh tokens. There is a separate reset-password JWT secret.
- Password hashing (bcrypt, 12 rounds) and stripping of sensitive fields happen in the **User model** (`pre('save')` hook + `toJSON` override + `select: false` on password). Query with `.select('+password')` when you need to compare it. Don't re-hash or manually delete `password` in controllers.

## Config

All environment access is funneled through `src/config/config.js` (loads dotenv, provides defaults). Read config values from there rather than reading `process.env` directly in feature code. External integrations: MongoDB (`config/database.js`), ImageKit for image storage (`config/imagekit.js`, `services/imageService.js`), Nodemailer SMTP for email (`config/email.js`, `services/emailService.js`). Email sends are best-effort — failures are caught and logged, not surfaced as request errors (see `authController.register`).

## Notes

- `src/config/swagger.js` hardcodes the production server URL as `https://nanos-ten.vercel.app` when `VERCEL_URL` is set; otherwise it falls back to `API_URL` or `http://localhost:PORT`. Update this if the deployment URL changes.
- Rate limiting is applied to the `/api` prefix (100 req / 15 min per IP).
- The repo root contains many `*.md` / deployment guide files (`START_HERE.md`, `VERCEL_DEPLOYMENT_GUIDE.md`, etc.) — these are human-facing deployment notes, not code.
