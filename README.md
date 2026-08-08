# Event Photo Sharing

Web app for event photo and video collection. Organizers create events, share a link or QR code, and guests upload from their phones without installing an app.

## Prerequisites

- Node.js 22+
- [pnpm](https://pnpm.io/) 9+
- PostgreSQL database
- Cloudflare R2 bucket (or other S3-compatible storage)

## Setup

1. Clone the repo and install dependencies:

```bash
pnpm install
```

2. Copy environment variables (see [`.env.example`](.env.example)):

```bash
cp .env.example apps/api/.env
# Create apps/web/.env.local with the NEXT_PUBLIC_* variables from .env.example
```

3. Push the database schema:

```bash
pnpm db:push
```

4. Start the API and web app (two terminals):

```bash
pnpm dev:api   # http://localhost:4000
pnpm dev:web   # http://localhost:3000
```

## Environment variables

All variables are listed in [`.env.example`](.env.example). Minimum required for local development:

| Variable | Where | Purpose |
|----------|-------|---------|
| `DATABASE_URL` | API | PostgreSQL connection |
| `JWT_SECRET` | API | Auth and gallery unlock tokens |
| `R2_*` | API | Object storage for media |
| `NEXT_PUBLIC_API_URL` | Web | API base URL |
| `NEXT_PUBLIC_BASE_WEB_URL` | Web | Public event links and QR codes |

Optional: `GOOGLE_CLIENT_ID` / `NEXT_PUBLIC_GOOGLE_CLIENT_ID` for Google login; Stripe keys for paid plans.

## Main user flow

1. Register or log in at `/auth/register` or `/auth/login`
2. Create an event from the organizer dashboard
3. Copy the event link or download the QR code from the event page
4. Guests open `/e/{slug}`, enter their name, and upload photos/videos
5. Organizer views, downloads, or deletes media from the event dashboard

## Deploy

The repo is a pnpm monorepo with two apps:

- **`apps/api`** — Hono API (see `apps/api/vercel.json` for Vercel serverless)
- **`apps/web`** — Next.js frontend

### API

Set all API variables from `.env.example` on your host. Run database migrations with `pnpm db:push` against the production database before going live.

Build:

```bash
pnpm --filter @app/shared build
pnpm --filter @app/api build
```

### Web

Set `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_BASE_WEB_URL` to your deployed API and web URLs. Build and start:

```bash
pnpm --filter @app/web build
pnpm --filter @app/web start
```

Point `CORS_ORIGIN` on the API to your web app origin. Set `BASE_WEB_URL` and `WEB_APP_URL` to the public web URL so QR codes and billing redirects are correct.

### Stripe webhooks (optional)

If using paid plans, configure a Stripe webhook to `https://your-api-host/webhooks/stripe` and set `STRIPE_WEBHOOK_SECRET`.

## Project structure

```
apps/api/          Hono REST API, R2 uploads, auth, billing
apps/web/          Next.js organizer dashboard + guest upload UI
packages/shared/   Drizzle schema, validators, database client
```
