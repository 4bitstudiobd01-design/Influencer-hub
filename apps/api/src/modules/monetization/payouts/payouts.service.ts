import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { Payout, PayoutStatus } from '@creator-hub/types';
import { isoDaysAgo, seededSeries } from '../../../common/mock.util';
import { PayoutEntity } from './payout.entity';

const SOURCES = [
  'TikTok Creator Rewards',
  'YouTube AdSense',
  'PixelCraft Pro (brand deal)',
  'Instagram Bonuses',
  'LumaDesign Studio (brand deal)',
  'YouTube Memberships',
  'Affiliate — SkillBridge',
  'Facebook In-stream Ads',
  'Affiliate — EduConnect',
  'TikTok LIVE Gifts',
  'YouTube Super Thanks',
  'SponsorKit — EduConnect',
];

const METHODS = ['Bank Transfer', 'PayPal', 'Wise'];

function buildSeed(): PayoutEntity[] {
  return Array.from({ length: 16 }, (_, i) => {
    const statusRoll = seededSeries(700 + i, 1, 0, 9)[0];
    const status: PayoutStatus = statusRoll < 7 ? 'paid' : 'pending';
    return {
      id: `po-${i + 1}`,
      date: isoDaysAgo(i * 4 + (status === 'pending' ? 0 : 2)),
      source: SOURCES[i % SOURCES.length],
      amount: seededSeries(750 + i, 1, 90, 2_400)[0],
      status,
      payoutMethod: METHODS[i % METHODS.length],
    };
  }) as PayoutEntity[];
}

/** First-party ledger data, Postgres-backed. Seeds demo rows once when the table is empty. */
@Injectable()
export class PayoutsService implements OnModuleInit {
  constructor(@InjectRepository(PayoutEntity) private readonly repo: Repository<PayoutEntity>) {}

  async onModuleInit() {
    const count = await this.repo.count();
    if (count === 0) {
      await this.repo.save(buildSeed());
    }
  }

  findAll(): Promise<Payout[]> {
    return this.repo.find({ order: { date: 'DESC' } });
  }
}
