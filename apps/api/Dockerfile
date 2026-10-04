# syntax=docker/dockerfile:1

# Base images are pinned by digest so a rebuild cannot silently change them.
FROM oven/bun:1.4.2@sha256:9114c058aeae42162ee16dd5084b95fe9473970bb6bcb5b232ab1630f0546895 AS build
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
# The server, plus the migration, project-init and GitHub-sync scripts bundled
# into single files that plain Node runs, so the runtime image needs neither
# Bun nor the source tree.
RUN bun run build && bun run build:scripts

FROM node:24-alpine@sha256:ebfe2f90462722a7a4de65e91990e97fe0d401c70e0e762c5b53302f905ec1c1 AS runner

# The server never installs packages, so drop the package managers: less to
# ship, and fewer advisories to track.
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/lib/node_modules/corepack \
      /usr/local/bin/npm /usr/local/bin/npx /usr/local/bin/corepack \
      /usr/local/bin/yarn /usr/local/bin/yarnpkg /opt/yarn-*

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
ENV STORAGE_DIR=/app/storage

RUN mkdir -p /app/storage && chown node:node /app/storage

# Standalone output does not include public/ or .next/static; the UI needs both
# (client bundles, stylesheets, images), so they are copied explicitly.
COPY --from=build --chown=node:node /repo/apps/api/.next/standalone/ /app/
COPY --from=build --chown=node:node /repo/apps/api/.next/static /app/apps/api/.next/static
COPY --from=build --chown=node:node /repo/apps/api/public /app/apps/api/public
COPY --from=build --chown=node:node /repo/apps/api/drizzle /app/apps/api/drizzle
COPY --from=build --chown=node:node /repo/apps/api/dist/scripts /app/apps/api/scripts

WORKDIR /app/apps/api
USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/health || exit 1

CMD ["node", "server.js"]
