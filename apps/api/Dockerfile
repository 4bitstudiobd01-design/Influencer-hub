# Build context is the repo root (npm workspaces monorepo) — see docker-compose.yml.
FROM node:20-alpine AS builder
WORKDIR /repo

COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/types/package.json packages/types/package.json
RUN npm ci
# npm workspaces can nest a dep under a workspace's own node_modules instead of
# hoisting it to the root (version conflicts across workspaces). Guarantee the path
# exists — possibly empty — so the runtime COPY below never fails either way.
RUN mkdir -p apps/api/node_modules

COPY packages/types packages/types
COPY apps/api apps/api
RUN npm run build --workspace apps/api

FROM node:20-alpine AS runner
WORKDIR /repo
ENV NODE_ENV=production

COPY --from=builder /repo/node_modules ./node_modules
COPY --from=builder /repo/package.json ./package.json
COPY --from=builder /repo/packages/types ./packages/types
COPY --from=builder /repo/apps/api/dist ./apps/api/dist
COPY --from=builder /repo/apps/api/package.json ./apps/api/package.json
COPY --from=builder /repo/apps/api/node_modules ./apps/api/node_modules

EXPOSE 4000
CMD ["node", "apps/api/dist/main.js"]
