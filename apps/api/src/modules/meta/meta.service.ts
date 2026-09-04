import { Injectable } from '@nestjs/common';
import type { AnalyticsPlatform, AnalyticsResponse } from '@creator-hub/types';
import { isoDaysAgo, kpi, seededSeries } from '../../common/mock.util';

/**
 * Owns the Meta Graph API connection (Instagram + Facebook Page insights, App-Review gated).
 * Personal Facebook profiles have no API access at all — those are handled as manual entries
 * in IntegrationsModule, never through this service. Content performance itself lives in
 * ContentModule (Postgres-backed).
 */
@Injectable()
export class MetaService {
  getAnalytics(platform: AnalyticsPlatform): AnalyticsResponse {
    const isInstagram = platform === 'instagram';
    return {
      platform,
      kpis: {
        followers: kpi(
          'Followers',
          isInstagram ? 84_200 : 41_600,
          'number',
          isInstagram ? 2.6 : 0.8,
          seededSeries(11, 12, 80, 120),
        ),
        views: kpi('Views', isInstagram ? 640_000 : 210_000, 'number', 3.9, seededSeries(12, 12, 90, 160)),
        reach: kpi('Reach', isInstagram ? 910_000 : 340_000, 'number', 4.2, seededSeries(13, 12, 90, 180)),
        engagementRate: kpi(
          'Engagement Rate',
          isInstagram ? 5.4 : 2.1,
          'percent',
          isInstagram ? 0.6 : -0.2,
          seededSeries(14, 12, 30, 70),
        ),
      },
      growth: Array.from({ length: 12 }, (_, i) => ({
        date: isoDaysAgo((11 - i) * 7),
        followers: (isInstagram ? 78_000 : 40_000) + i * (isInstagram ? 520 : 130),
      })),
      audience: {
        ageGroups: [
          { label: '18-24', pct: 29 },
          { label: '25-34', pct: 44 },
          { label: '35-44', pct: 18 },
          { label: '45+', pct: 9 },
        ],
        genderSplit: [
          { label: 'Female', pct: 53 },
          { label: 'Male', pct: 45 },
          { label: 'Other', pct: 2 },
        ],
        topGeographies: [
          { label: 'United States', pct: 33 },
          { label: 'Brazil', pct: 12 },
          { label: 'Canada', pct: 8 },
        ],
      },
    };
  }
}
