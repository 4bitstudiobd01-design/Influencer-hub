/**
 * Shared DTOs between the NestJS API (apps/api) and the Next.js frontend (apps/web).
 * Type-only — no runtime code — so it can be imported with `import type` from either
 * a CommonJS (Nest) or ESM (Next) build without a separate compile step.
 */

export type Platform =
  | 'youtube'
  | 'instagram'
  | 'facebook'
  | 'tiktok'
  | 'whatsapp'
  | 'website'
  | 'email';

export type AnalyticsPlatform = 'youtube' | 'instagram' | 'facebook_page' | 'tiktok';

export type TrendUnit = 'currency' | 'number' | 'percent';

export interface KpiTrend {
  label: string;
  value: number;
  unit: TrendUnit;
  changePct: number;
  sparkline: number[];
}

export interface PlatformBreakdownRow {
  platform: Platform;
  clicks: number;
  cvr: number;
  revenue: number;
  engagementRate: number;
}

export interface EarningsPoint {
  date: string;
  earnings: number;
  clicks: number;
}

export type ActivityType =
  | 'sponsorship_signed'
  | 'milestone'
  | 'payout_received'
  | 'flagged_message'
  | 'brand_payment';

export interface ActivityItem {
  id: string;
  type: ActivityType;
  message: string;
  amount?: number;
  timestamp: string;
}

export type BrandDealStage =
  | 'prospecting'
  | 'negotiating'
  | 'contract_sent'
  | 'in_production'
  | 'delivered'
  | 'paid';

export type PaymentStatus = 'pending' | 'paid' | 'overdue';

export interface BrandDeal {
  id: string;
  brandName: string;
  brandLogoUrl?: string;
  contactPerson: string;
  deliverables: string;
  agreedRate: number;
  dueDate: string;
  stage: BrandDealStage;
  paymentStatus: PaymentStatus;
  contractFileUrl?: string;
}

export interface BrandDealSummary {
  id: string;
  brandName: string;
  brandLogoUrl?: string;
  dealName: string;
  deliverableStatus: string;
  payoutAmount: number;
}

export interface AffiliateProgram {
  id: string;
  name: string;
  platform: Platform;
  commissionRate: number;
  thumbnailUrl?: string;
}

export interface AffiliateLink {
  id: string;
  url: string;
  clicks: number;
  cvr: number;
  revenue: number;
}

export interface AffiliateSummary {
  referralEarnings: KpiTrend;
  pendingCommissions: KpiTrend;
  linkClicks: KpiTrend;
  affiliateRank: string;
  nextTierAmount?: number;
  programs: AffiliateProgram[];
  links: AffiliateLink[];
}

export type PayoutStatus = 'pending' | 'paid';

export interface Payout {
  id: string;
  date: string;
  source: string;
  amount: number;
  status: PayoutStatus;
  payoutMethod: string;
}

export interface PlatformRevenueSource {
  platform: Platform;
  sourceLabel: string;
  amount: number;
}

export interface MonetizationOverview {
  revenueBySource: PlatformRevenueSource[];
  revenueTrend: EarningsPoint[];
  deals: BrandDeal[];
  affiliate: AffiliateSummary;
  payouts: Payout[];
}

export interface OverviewResponse {
  creatorName: string;
  kpis: {
    totalRevenue: KpiTrend;
    totalReach: KpiTrend;
    newFollowers: KpiTrend;
    engagementRate: KpiTrend;
  };
  platformBreakdown: PlatformBreakdownRow[];
  earningsOverTime: EarningsPoint[];
  recentActivity: ActivityItem[];
  featuredDeals: BrandDealSummary[];
}

export type ContentType = 'video' | 'short' | 'reel' | 'post' | 'story' | 'image';

/** Aggregation window for content metrics — sums the underlying daily stats. */
export type ContentPeriod = 'week' | 'month' | 'all';

export interface ContentPerformanceRow {
  id: string;
  platform: AnalyticsPlatform;
  contentType: ContentType;
  thumbnailUrl: string;
  mediaUrl?: string;
  durationSeconds?: number;
  title: string;
  publishedAt: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  retentionPct: number;
  revenue: number;
}

export interface ContentListResponse {
  rows: ContentPerformanceRow[];
  total: number;
  page: number;
  pageCount: number;
}

export interface ContentDailyPoint {
  date: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  revenue: number;
}

export interface ContentDetail extends ContentPerformanceRow {
  dailyStats: ContentDailyPoint[];
}

export interface AnalyticsKpis {
  followers: KpiTrend;
  views: KpiTrend;
  reach: KpiTrend;
  engagementRate: KpiTrend;
  watchTime?: KpiTrend;
  avgViewDuration?: KpiTrend;
}

export interface AudienceDemographics {
  ageGroups: { label: string; pct: number }[];
  genderSplit: { label: string; pct: number }[];
  topGeographies: { label: string; pct: number }[];
}

export interface AnalyticsResponse {
  platform: AnalyticsPlatform;
  kpis: AnalyticsKpis;
  growth: { date: string; followers: number }[];
  audience: AudienceDemographics;
}

export type InboxChannel = 'comments' | 'dms' | 'whatsapp' | 'brand_email';

export interface InboxMessage {
  id: string;
  channel: InboxChannel;
  platform?: Platform;
  sender: string;
  preview: string;
  unread: boolean;
  priorityTag?: 'collab' | 'sponsor' | 'partnership';
  timestamp: string;
}

export interface IntegrationStatus {
  platform: Platform;
  connected: boolean;
  lastSyncedAt?: string;
  quotaUsed?: number;
  quotaLimit?: number;
}
