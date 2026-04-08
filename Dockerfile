# ── Railway API Server ────────────────────────────────────────────────
FROM node:20-slim AS base
WORKDIR /app

# Install pnpm via corepack
RUN corepack enable && corepack prepare pnpm@9 --activate

# Copy all source (esbuild bundles everything, so we need full source)
COPY . .

# Install deps (no frozen lockfile since lock may not exist)
RUN pnpm install --no-frozen-lockfile

# Build server only (no Vite client build — Vercel handles that)
RUN pnpm run build:server

# ── Production stage ──────────────────────────────────────────────────
FROM node:20-slim AS production
WORKDIR /app

# Copy built output + package.json for native deps
COPY --from=base /app/dist ./dist
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./

# Copy data files (brand guidelines, trends, competitors, etc.)
COPY --from=base /app/data ./data
COPY --from=base /app/server/data ./server/data

EXPOSE 3000
ENV PORT=3000
ENV NODE_ENV=production

CMD ["node", "dist/index.cjs"]
