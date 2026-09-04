import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { AffiliateSummary } from '@creator-hub/types';
import { kpi, seededSeries } from '../../../common/mock.util';
import { AffiliateProgramEntity } from './affiliate-program.entity';
import { AffiliateLinkEntity } from './affiliate-link.entity';

const PROGRAM_SEED: AffiliateProgramEntity[] = [
  { id: 'prog-1', name: 'PixelCraft Pro', platform: 'youtube', commissionRate: 12 },
  { id: 'prog-2', name: 'LumaDesign Studio', platform: 'tiktok', commissionRate: 24 },
  { id: 'prog-3', name: 'StreamGear HQ', platform: 'instagram', commissionRate: 18 },
  { id: 'prog-4', name: 'FitFuel', platform: 'youtube', commissionRate: 15 },
] as AffiliateProgramEntity[];

const LINK_SLUGS = [
  'cecillia',
  'skillbridge',
  'lumadesign',
  'pixelcraft',
  'educonnect',
  'brightgear',
  'novaskincare',
  'fitfuel',
  'wanderpack',
  'studiogear',
  'streamhq',
  'creatorkit',
];

function buildLinkSeed(): AffiliateLinkEntity[] {
  return LINK_SLUGS.map((slug, i) => ({
    id: `link-${i + 1}`,
    url: `platform.io/ref/${slug}`,
    clicks: seededSeries(800 + i, 1, 900, 15_000)[0],
    cvr: Number((seededSeries(850 + i, 1, 30, 115)[0] / 10).toFixed(1)),
    revenue: seededSeries(900 + i, 1, 300, 9_800)[0],
  })) as AffiliateLinkEntity[];
}

/**
 * Programs and links are first-party CRM data, Postgres-backed and seeded once.
 * The KPI trend figures (earnings, clicks, rank) stay mock until real affiliate-network
 * analytics are wired in — they aren't something this app owns the source of truth for.
 */
@Injectable()
export class AffiliateService implements OnModuleInit {
  constructor(
    @InjectRepository(AffiliateProgramEntity) private readonly programs: Repository<AffiliateProgramEntity>,
    @InjectRepository(AffiliateLinkEntity) private readonly links: Repository<AffiliateLinkEntity>,
  ) {}

  async onModuleInit() {
    if ((await this.programs.count()) === 0) await this.programs.save(PROGRAM_SEED);
    if ((await this.links.count()) === 0) await this.links.save(buildLinkSeed());
  }

  async getSummary(): Promise<AffiliateSummary> {
    const [programs, links] = await Promise.all([this.programs.find(), this.links.find({ order: { revenue: 'DESC' } })]);

    return {
      referralEarnings: kpi('Referral Earnings', 4_041, 'currency', -6.4, seededSeries(51, 8, 30, 60)),
      pendingCommissions: kpi('Pending Commissions', 2_804, 'currency', 1.2, seededSeries(52, 8, 20, 50)),
      linkClicks: kpi('Link Clicks', 3_041, 'number', -0.02, seededSeries(53, 8, 20, 60)),
      affiliateRank: 'Platinum',
      nextTierAmount: 1_200,
      programs,
      links,
    };
  }
}
