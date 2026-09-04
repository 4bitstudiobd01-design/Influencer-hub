import { Controller, Get } from '@nestjs/common';
import type { MonetizationOverview } from '@creator-hub/types';
import { DealsService } from './deals/deals.service';
import { AffiliateService } from './affiliate/affiliate.service';
import { PayoutsService } from './payouts/payouts.service';
import { isoDaysAgo } from '../../common/mock.util';

@Controller('monetization')
export class MonetizationController {
  constructor(
    private readonly deals: DealsService,
    private readonly affiliate: AffiliateService,
    private readonly payouts: PayoutsService,
  ) {}

  @Get()
  async getOverview(): Promise<MonetizationOverview> {
    const [deals, affiliate, payouts] = await Promise.all([
      this.deals.findAll(),
      this.affiliate.getSummary(),
      this.payouts.findAll(),
    ]);

    return {
      revenueBySource: [
        { platform: 'youtube', sourceLabel: 'AdSense', amount: 6_200 },
        { platform: 'youtube', sourceLabel: 'Memberships & Super Chat', amount: 1_100 },
        { platform: 'tiktok', sourceLabel: 'Creator Rewards', amount: 3_400 },
        { platform: 'facebook', sourceLabel: 'In-stream Ads & Stars', amount: 780 },
        { platform: 'instagram', sourceLabel: 'Bonuses', amount: 640 },
      ],
      revenueTrend: Array.from({ length: 6 }, (_, i) => ({
        date: isoDaysAgo((5 - i) * 30),
        earnings: 2_400 + i * 380,
        clicks: 0,
      })),
      deals,
      affiliate,
      payouts,
    };
  }
}
