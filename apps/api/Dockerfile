# syntax=docker/dockerfile:1

FROM oven/bun:1.4.2 AS build
WORKDIR /repo

# Workspace manifests first so dependency installation is cached.
COPY package.json bun.lock ./
COPY apps/api/package.json apps/api/package.json
COPY packages/shared/package.json packages/shared/package.json
RUN bun install --frozen-lockfile

COPY packages/shared packages/shared
COPY apps/api apps/api

WORKDIR /repo/apps/api
RUN bun run build

FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
ENV STORAGE_DIR=/app/storage

RUN mkdir -p /app/storage && chown node:node /app/storage

COPY --from=build --chown=node:node /repo/apps/api/.next/standalone/ ./
COPY --from=build --chown=node:node /repo/apps/api/.next/static ./apps/api/.next/static

USER node
EXPOSE 3000

CMD ["node", "apps/api/server.js"]
