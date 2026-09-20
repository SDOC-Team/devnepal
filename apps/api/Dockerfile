# syntax=docker/dockerfile:1

FROM oven/bun:1.4.2 AS build
WORKDIR /repo

# Workspace manifests first so dependency installation is cached.
COPY package.json bun.lock ./
COPY apps/api/package.json apps/api/package.json
COPY packages/api-client/package.json packages/api-client/package.json
COPY packages/api-contract/package.json packages/api-contract/package.json
COPY packages/shared/package.json packages/shared/package.json
RUN bun install --frozen-lockfile

COPY packages/api-client packages/api-client
COPY packages/shared packages/shared
COPY apps/api apps/api

WORKDIR /repo/apps/api
RUN bun run build

# Migration runner: the same repo with dev tooling (drizzle-kit) available.
# Used as `docker compose run --rm migrate` before starting a new image.
FROM build AS migrate
WORKDIR /repo/apps/api
CMD ["bun", "run", "db:migrate"]

FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
ENV STORAGE_DIR=/app/storage

RUN mkdir -p /app/storage && chown node:node /app/storage

# Standalone output does not include public/ or static/; both are required for
# the UI (design CSS, fonts, emblem) and must be copied explicitly.
COPY --from=build --chown=node:node /repo/apps/api/.next/standalone/ ./
COPY --from=build --chown=node:node /repo/apps/api/.next/static ./apps/api/.next/static
COPY --from=build --chown=node:node /repo/apps/api/public ./apps/api/public

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/health || exit 1

CMD ["node", "apps/api/server.js"]
