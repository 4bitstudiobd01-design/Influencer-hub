import { Injectable } from '@nestjs/common';
import type { AnalyticsResponse } from '@creator-hub/types';
import { isoDaysAgo, kpi, seededSeries } from '../../common/mock.util';

/**
 * Owns the YouTube Data/Analytics API OAuth connection and normalizes responses.
 * Revenue is only available via Content Owner (CMS) access — for a standard
 * single-channel connection this falls back to manual/CSV-imported figures
 * (see IntegrationsModule for the connection-health + manual-entry surface).
 * Content performance itself lives in ContentModule (Postgres-backed).
 */
@Injectable()
export class YoutubeService {
  getAnalytics(): AnalyticsResponse {
    return {
      platform: 'youtube',
      kpis: {
        followers: kpi('Subscribers', 128_400, 'number', 3.2, seededSeries(1, 12, 100, 140)),
        views: kpi('Views', 2_140_000, 'number', 5.1, seededSeries(2, 12, 100, 200)),
        reach: kpi('Reach', 3_020_000, 'number', 4.4, seededSeries(3, 12, 100, 220)),
        engagementRate: kpi('Engagement Rate', 6.8, 'percent', 0.4, seededSeries(4, 12, 40, 80)),
        watchTime: kpi('Watch Time (hrs)', 84_200, 'number', 2.1, seededSeries(5, 12, 60, 100)),
      },
      growth: Array.from({ length: 12 }, (_, i) => ({
        date: isoDaysAgo((11 - i) * 7),
        followers: 120_000 + i * 700 + seededSeries(6 + i, 1, 0, 400)[0],
      })),
      audience: {
        ageGroups: [
          { label: '18-24', pct: 34 },
          { label: '25-34', pct: 41 },
          { label: '35-44', pct: 16 },
          { label: '45+', pct: 9 },
        ],
        genderSplit: [
          { label: 'Male', pct: 58 },
          { label: 'Female', pct: 40 },
          { label: 'Other', pct: 2 },
        ],
        topGeographies: [
          { label: 'United States', pct: 38 },
          { label: 'India', pct: 17 },
          { label: 'United Kingdom', pct: 9 },
        ],
      },
    };
  }
}
