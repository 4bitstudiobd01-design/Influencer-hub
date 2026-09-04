# Master Build Prompt: "Creator Hub" — All-in-One Influencer Dashboard
*A design + content specification, ready to hand to a designer, or paste into an AI app builder (Lovable, v0, Figma Make, Cursor, etc.)*

**Tech stack:** Frontend — **Next.js (App Router) + TypeScript**. Backend — **NestJS** (TypeScript), exposing a REST/GraphQL API that the Next.js frontend consumes; NestJS also owns the OAuth connections to each platform, scheduled data-sync jobs, and the revenue/CRM database layer.

---

## 0. Reference synthesis (what we're combining)

| Reference | What we're taking from it |
|---|---|
| **Porter Metrics — Community Manager Dashboard** (Looker Studio template) | The **analytics/reporting layer**: clean cross-platform engagement dashboards for Instagram, Facebook, LinkedIn, Google Business Profile, Pinterest, TikTok — audience demographics, post performance, reach/impressions, filterable by date/platform/campaign. |
| **TrendTrack — Influencer Analytics Admin Template** (React admin, ThemeForest, by seller "paicode") | The **product UI/UX shell**: warm hero banner with headline, top nav (Home / Affiliate Management / Analytics / Payouts), stat cards (Referral Earnings, Pending Commissions, Link Clicks, Affiliate Rank), donut "Traffic Source" chart, "Featured Programs" cards, "Recent Activity" feed, "Earnings Over Time" bar chart, and a per-platform traffic/revenue table (YouTube, Instagram, TikTok, Blog, Email). |
| **Earlier research (creator-tools/monetization report)** | The gaps to fill in: YouTube AdSense revenue vs. content-owner API restriction, brand-deal/sponsorship CRM, WhatsApp as a fan-comms channel, unified inbox, content calendar. |

**Product name (placeholder):** Creator Hub
**One-line pitch:** A single command center where a YouTuber/influencer tracks every platform's performance, every dollar of revenue, and every fan conversation — without switching tabs.

---

## 1. Information Architecture (Sidebar Navigation)

```
Overview (Home)
Analytics
  — YouTube
  — Instagram
  — Facebook (Page)
  — Facebook (Personal reach — manual/estimated)
  — TikTok
  — Cross-Platform Comparison
Monetization
  — Platform Revenue (AdSense, Memberships, Stars/Bonuses)
  — Brand Deals & Sponsorships (CRM/pipeline)
  — Affiliate & Referral Earnings
  — Payouts & Invoices
Audience
  — Demographics (age, gender, geo)
  — Growth & Retention
Content Calendar
Inbox (unified: comments + DMs + WhatsApp)
Media Kit (auto-generated, shareable)
Settings & Integrations (connect accounts, API keys, team roles)
```

See the full specification (pages 2-5: visual design system, page-by-page content spec,
data/integration notes per platform, and the AI-builder prompt) as shared with the team —
this file captures the IA and IA-driven build decisions that the `apps/api` and `apps/web`
scaffold in this repo follows directly. Ask in the project channel for the complete doc if
you need the visual design system or per-page copy details reproduced here.

## Where this repo picks it up

- `packages/types` — shared DTOs (`OverviewResponse`, `AnalyticsResponse`, `BrandDeal`,
  `AffiliateSummary`, `Payout`, `InboxMessage`, `IntegrationStatus`, …) consumed as
  type-only imports by both apps.
- `apps/api` — NestJS backend with one module per platform (`youtube`, `meta`, `tiktok`,
  `whatsapp`) plus `overview`, `monetization` (deals/affiliate/payouts), `inbox`, and
  `integrations`. Currently serves deterministic mock data shaped exactly like the DTOs,
  so the frontend is fully wired end-to-end before real OAuth/CSV-import/CRM persistence
  is added per §4 of the original spec.
- `apps/web` — Next.js App Router frontend implementing the sidebar IA above. Overview,
  per-platform Analytics, Cross-Platform Comparison, all four Monetization sub-pages, and
  the unified Inbox are fully built against the API. Audience, Content Calendar, and
  Media Kit are routed placeholders ("coming soon") pending further scope.
