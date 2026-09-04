# Creator Hub

All-in-one influencer dashboard. Next.js (App Router) frontend + NestJS backend on
Postgres, sharing typed DTOs via an npm workspaces monorepo. See
[docs/creator-hub-dashboard-design-prompt.md](docs/creator-hub-dashboard-design-prompt.md)
for the full product/design spec this scaffold implements.

## Structure

```
apps/api        NestJS backend — REST API at /api/v1, Postgres-backed via TypeORM
apps/web        Next.js frontend — sidebar IA, dashboard pages, TanStack Query hooks
packages/types  Shared TypeScript DTOs (type-only, no build step needed)
```

## Option A — run locally (no Docker)

Requires a local Postgres with a `bit_fluencer` database (the `apps/api/.env` defaults
assume `postgres` / `admin` on `localhost:5432` — edit it if yours differs).

```bash
npm install

# terminal 1
npm run dev:api    # http://localhost:4000/api/v1 — creates/updates tables and seeds
                    # demo rows into Postgres on first boot (TypeORM synchronize)

# terminal 2
npm run dev:web    # http://localhost:3000
```

## Option B — run everything in Docker

```bash
docker compose up --build
```

This starts three containers: `db` (Postgres 16, seeded with the same `bit_fluencer` /
`admin` credentials), `api` (port 4000), and `web` (port **3001** by default — see the
note below). Data persists in the `bit_fluencer_db-data` volume across restarts; wipe it
with `docker compose down -v` if you want a clean slate.

`docker compose down` stops everything; add `-v` to also drop the Postgres volume.

**Port note:** `web` publishes on host port **3001**, not 3000, so the containerized
stack can run alongside a local `npm run dev` (Option A) still on 3000. If you aren't
running the local dev server, edit `docker-compose.yml`: change `web`'s port mapping
back to `'3000:3000'` and `api`'s `WEB_ORIGIN` env to `http://localhost:3000` (they have
to match, since the API's CORS check compares against `WEB_ORIGIN`).

**Why the DB container is on host port 5433:** to avoid clashing with a Postgres already
listening on your machine's 5432. The `api` container still talks to it internally at
`db:5432` regardless of the host-side port.

`NEXT_PUBLIC_API_URL` (passed as a build arg to the `web` image) is baked into the
client bundle at build time, since the dashboard fetches client-side from the browser —
it must be a URL the browser can reach (`http://localhost:4000/...`), never the
Docker-internal `http://api:4000`.

## Database

Postgres, via TypeORM (`apps/api/src/database/database.module.ts`). Currently
persisted: Brand Deals (the kanban), Payouts, and Affiliate programs/links — these are
first-party CRM data with no external API, per §4 of the design spec. Each of those
services seeds a handful of demo rows on first boot only (when its table is empty), so
the dashboard isn't blank on a fresh database; after that, all reads/writes (including
dragging a deal card between kanban stages) go straight to Postgres.

`synchronize: true` auto-creates/updates tables from the TypeORM entities — a scaffold
convenience, not something to keep once this holds real data. Swap it for TypeORM
migrations before that happens.

Analytics (YouTube/Instagram/Facebook/TikTok) and the Overview's platform-breakdown/
earnings-over-time numbers are still deterministic mock data — those depend on OAuth
connections to each platform that haven't been wired up yet (see below).

## Status

- Fully wired: Overview (with real Brand Deals data for the "Active Brand Deals" cards),
  per-platform Analytics (mock), Cross-Platform Comparison (mock), Monetization —
  Revenue (mock trend, real deals total), Brand Deals kanban (Postgres), Affiliate
  (Postgres programs/links, mock KPI trends), Payouts (Postgres) — and the unified
  Inbox (mock).
- Placeholder pages (nav wired, no data yet): Audience, Content Calendar, Media Kit.
- Real platform OAuth and scheduled sync jobs are not yet implemented — see §4 of the
  design spec for the integration notes each platform module
  (`apps/api/src/modules/{youtube,meta,tiktok,whatsapp}`) is stubbed against.
