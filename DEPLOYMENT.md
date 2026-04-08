# Betterfly Brand Central — Deployment Guide

This project has been migrated from Replit to a split deployment:

- **Frontend** → Vercel (static React SPA via Vite)
- **API server** → Railway (Node.js Express + PostgreSQL)

---

## Architecture

```
┌──────────────┐         ┌──────────────────────┐
│   Vercel     │  /api/* │   Railway             │
│   (React)    │────────►│   (Express + PG)      │
│              │  proxy  │                       │
│  dist/public │         │  dist/index.cjs       │
└──────────────┘         └──────────────────────┘
```

Vercel serves the static frontend and uses `vercel.json` rewrites to proxy all `/api/*` and `/brand-assets/*` requests to the Railway API.

---

## 1. Railway (API Server)

### Provision a project

1. Create a new project on [Railway](https://railway.app)
2. Add a **PostgreSQL** plugin — Railway auto-provisions the database and sets `DATABASE_URL`
3. Connect your GitHub repo (or deploy from CLI)

### Environment variables

Set these in the Railway dashboard (Settings → Variables):

| Variable | Value |
|---|---|
| `DATABASE_URL` | Auto-set by Railway PostgreSQL plugin |
| `ANTHROPIC_API_KEY` | Your Anthropic key (`sk-ant-...`) |
| `CORS_ORIGIN` | Your Vercel URL, e.g. `https://brand-central.vercel.app` |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | *(optional)* Google Drive SA key JSON |
| `PORT` | `5000` (Railway may override) |

### Build & start commands

Railway should auto-detect the Dockerfile. If using Nixpacks instead:

- **Build**: `npm run build:server`
- **Start**: `npm run start`

### Push the database schema

After the first deploy, run:

```bash
DATABASE_URL=<your-railway-pg-url> npx drizzle-kit push
```

Or from the Railway CLI:

```bash
railway run npx drizzle-kit push
```

---

## 2. Vercel (Frontend)

### Connect your repo

1. Import the GitHub repo on [Vercel](https://vercel.com)
2. Vercel will detect Vite and use the settings from `vercel.json`

### Environment variables

Set these in the Vercel dashboard (Settings → Environment Variables):

| Variable | Value |
|---|---|
| `RAILWAY_API_URL` | Your Railway public URL, e.g. `https://brand-central-api.up.railway.app` |

This is used in `vercel.json` rewrites so the frontend can proxy API requests to Railway.

### Build settings (auto-detected from vercel.json)

- **Build command**: `npm run build:client`
- **Output directory**: `dist/public`
- **Framework**: Vite

---

## 3. Local Development

Run both frontend and API together (like the original Replit setup):

```bash
# Install deps
pnpm install

# Push DB schema to a local or cloud Postgres
DATABASE_URL=postgresql://... pnpm run db:push

# Start dev server (Express + Vite HMR on :5000)
DATABASE_URL=postgresql://... ANTHROPIC_API_KEY=sk-ant-... pnpm run dev
```

Or run them split:

```bash
# Terminal 1 — API server on :5000
DATABASE_URL=postgresql://... ANTHROPIC_API_KEY=sk-ant-... pnpm run dev

# Terminal 2 — Vite dev server on :5173 (proxies /api to :5000)
pnpm run dev:client
```

---

## What changed from Replit

| Before (Replit) | After |
|---|---|
| `@replit/vite-plugin-*` dev plugins | Removed |
| `@replit/connectors-sdk` for Google Drive | Replaced with direct `googleapis` service account auth |
| `AI_INTEGRATIONS_ANTHROPIC_API_KEY` env var | `ANTHROPIC_API_KEY` |
| `AI_INTEGRATIONS_ANTHROPIC_BASE_URL` env var | Removed (uses default Anthropic URL) |
| In-memory `MemStorage` for users | `PgStorage` backed by Drizzle + PostgreSQL |
| `artifacts/` directory with Replit proxy | Removed — brand-assets copied to `client/public/` |
| `replit.md` | Removed |
| `server/replit_integrations/` | Removed (chat feature was Replit-specific) |
| Single deploy on Replit | Split: Vercel (frontend) + Railway (API + PG) |

---

## Data files

The server reads JSON data files at runtime from `server/data/`. These are bundled into `dist/data/` during the build. If you need to update trends, competitors, etc., edit the files and redeploy.

The `content/` directory (file library) is also bundled into the Railway build as `dist/content/`.
