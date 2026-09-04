import { Injectable } from '@nestjs/common';
import type { AnalyticsResponse } from '@creator-hub/types';
import { isoDaysAgo, kpi, seededSeries } from '../../common/mock.util';

/**
 * Owns the TikTok Display + Content Posting API connection. New/unaudited apps default to
 * sandbox with private-only visibility and 24h token expiry — the sync job (see SyncModule,
 * not yet wired) must refresh tokens well inside that window. Content performance itself
 * lives in ContentModule (Postgres-backed).
 */
@Injectable()
export class TiktokService {
  getAnalytics(): AnalyticsResponse {
    return {
      platform: 'tiktok',
      kpis: {
        followers: kpi('Followers', 96_800, 'number', 6.7, seededSeries(21, 12, 90, 150)),
        views: kpi('Views', 1_820_000, 'number', 8.3, seededSeries(22, 12, 100, 220)),
        reach: kpi('Reach', 2_240_000, 'number', 7.9, seededSeries(23, 12, 100, 240)),
        engagementRate: kpi('Engagement Rate', 9.1, 'percent', 1.2, seededSeries(24, 12, 50, 100)),
        avgViewDuration: kpi('Avg. View Duration (s)', 18.4, 'number', 0.6, seededSeries(25, 12, 10, 25)),
      },
      growth: Array.from({ length: 12 }, (_, i) => ({
        date: isoDaysAgo((11 - i) * 7),
        followers: 88_000 + i * 780,
      })),
      audience: {
        ageGroups: [
          { label: '13-17', pct: 8 },
          { label: '18-24', pct: 47 },
          { label: '25-34', pct: 33 },
          { label: '35+', pct: 12 },
        ],
        genderSplit: [
          { label: 'Female', pct: 49 },
          { label: 'Male', pct: 49 },
          { label: 'Other', pct: 2 },
        ],
        topGeographies: [
          { label: 'United States', pct: 41 },
          { label: 'Philippines', pct: 10 },
          { label: 'United Kingdom', pct: 7 },
        ],
      },
    };
  }
}
