# ── Railway API Server ────────────────────────────────────────────────
FROM node:20-slim AS base
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy dependency manifests
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY lib/db/package.json lib/db/package.json

# Install all deps (including dev for build step)
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Build server only (no Vite client build — Vercel handles that)
RUN pnpm run build:server

# ── Production stage ──────────────────────────────────────────────────
FROM node:20-slim AS production
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY lib/db/package.json lib/db/package.json

# Production deps only
RUN pnpm install --frozen-lockfile --prod

# Copy built output + runtime data
COPY --from=base /app/dist ./dist

EXPOSE 5000
ENV PORT=5000
ENV NODE_ENV=production

CMD ["node", "dist/index.cjs"]
