import { Injectable } from '@nestjs/common';
import type { BrandDealStage, OverviewResponse } from '@creator-hub/types';
import { isoDaysAgo, kpi, seededSeries } from '../../common/mock.util';
import { DealsService } from '../monetization/deals/deals.service';

const STAGE_LABEL: Record<BrandDealStage, string> = {
  prospecting: 'Prospecting',
  negotiating: 'Negotiating',
  contract_sent: 'Contract sent',
  in_production: 'In production',
  delivered: 'Delivered',
  paid: 'Paid',
};

@Injectable()
export class OverviewService {
  constructor(private readonly deals: DealsService) {}

  async getOverview(): Promise<OverviewResponse> {
    const deals = await this.deals.findAll();
    const featuredDeals = deals
      .filter((d) => d.stage !== 'paid')
      .slice(0, 2)
      .map((d) => ({
        id: d.id,
        brandName: d.brandName,
        dealName: d.deliverables,
        deliverableStatus: STAGE_LABEL[d.stage],
        payoutAmount: d.agreedRate,
      }));

    return {
      creatorName: 'Alex Rivera',
      kpis: {
        totalRevenue: kpi('Total Revenue', 18_420, 'currency', 6.4, seededSeries(31, 12, 60, 100)),
        totalReach: kpi('Total Reach', 6_420_000, 'number', 4.9, seededSeries(32, 12, 70, 110)),
        newFollowers: kpi('New Followers', 14_280, 'number', 3.1, seededSeries(33, 12, 60, 120)),
        engagementRate: kpi('Engagement Rate', 7.2, 'percent', 0.5, seededSeries(34, 12, 40, 90)),
      },
      platformBreakdown: [
        { platform: 'youtube', clicks: 14_732, cvr: 7.2, revenue: 9_135, engagementRate: 6.8 },
        { platform: 'instagram', clicks: 9_864, cvr: 6.5, revenue: 7_890, engagementRate: 5.4 },
        { platform: 'tiktok', clicks: 13_587, cvr: 6.9, revenue: 9_420, engagementRate: 9.1 },
        { platform: 'facebook', clicks: 4_210, cvr: 3.1, revenue: 2_150, engagementRate: 2.1 },
        { platform: 'whatsapp', clicks: 1_980, cvr: 11.4, revenue: 640, engagementRate: 0 },
        { platform: 'website', clicks: 11_209, cvr: 7.0, revenue: 8_765, engagementRate: 0 },
        { platform: 'email', clicks: 10_421, cvr: 7.1, revenue: 7_650, engagementRate: 0 },
      ],
      earningsOverTime: Array.from({ length: 14 }, (_, i) => ({
        date: isoDaysAgo(13 - i),
        earnings: 40 + seededSeries(40 + i, 1, 0, 60)[0],
        clicks: 280 + seededSeries(60 + i, 1, 0, 200)[0],
      })),
      recentActivity: [
        {
          id: 'act-1',
          type: 'sponsorship_signed',
          message: 'Signed a new sponsorship with LumaDesign Studio',
          amount: 2_400,
          timestamp: isoDaysAgo(0),
        },
        {
          id: 'act-2',
          type: 'milestone',
          message: 'Hit 100K subscribers on YouTube',
          timestamp: isoDaysAgo(1),
        },
        {
          id: 'act-3',
          type: 'payout_received',
          message: 'Payout received from TikTok Creator Rewards',
          amount: 640,
          timestamp: isoDaysAgo(2),
        },
        {
          id: 'act-4',
          type: 'flagged_message',
          message: 'DM flagged as a potential brand partnership',
          timestamp: isoDaysAgo(3),
        },
      ],
      featuredDeals,
    };
  }
}
