import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { BrandDeal, BrandDealStage } from '@creator-hub/types';
import { DealEntity } from './deal.entity';

const SEED: DealEntity[] = [
  {
    id: 'deal-1',
    brandName: 'SkillBridge',
    contactPerson: 'Priya Nair',
    deliverables: '1 dedicated YouTube video + 3 Instagram Stories',
    agreedRate: 1_200,
    dueDate: new Date(Date.now() + 12 * 86_400_000).toISOString().slice(0, 10),
    stage: 'in_production',
    paymentStatus: 'pending',
  },
  {
    id: 'deal-2',
    brandName: 'EduConnect',
    contactPerson: 'Marcus Webb',
    deliverables: '2 TikTok videos',
    agreedRate: 2_400,
    dueDate: new Date(Date.now() + 5 * 86_400_000).toISOString().slice(0, 10),
    stage: 'contract_sent',
    paymentStatus: 'pending',
  },
  {
    id: 'deal-3',
    brandName: 'PixelCraft Pro',
    contactPerson: 'Dana Lin',
    deliverables: 'Long-form review video',
    agreedRate: 900,
    dueDate: new Date(Date.now() - 3 * 86_400_000).toISOString().slice(0, 10),
    stage: 'delivered',
    paymentStatus: 'overdue',
  },
  {
    id: 'deal-4',
    brandName: 'LumaDesign Studio',
    contactPerson: 'Jordan Kim',
    deliverables: 'Brand ambassador — 3 month retainer',
    agreedRate: 3_600,
    dueDate: new Date(Date.now() + 30 * 86_400_000).toISOString().slice(0, 10),
    stage: 'negotiating',
    paymentStatus: 'pending',
  },
  {
    id: 'deal-5',
    brandName: 'FitFuel',
    contactPerson: 'Sam Torres',
    deliverables: '1 YouTube Short + 2 Instagram Stories',
    agreedRate: 800,
    dueDate: new Date(Date.now() + 21 * 86_400_000).toISOString().slice(0, 10),
    stage: 'prospecting',
    paymentStatus: 'pending',
  },
  {
    id: 'deal-6',
    brandName: 'WanderPack',
    contactPerson: 'Ines Duarte',
    deliverables: 'Travel vlog integration — 60s mid-roll',
    agreedRate: 1_500,
    dueDate: new Date(Date.now() + 45 * 86_400_000).toISOString().slice(0, 10),
    stage: 'prospecting',
    paymentStatus: 'pending',
  },
  {
    id: 'deal-7',
    brandName: 'BrightGear',
    contactPerson: 'Leo Bianchi',
    deliverables: 'Unboxing + honest review video',
    agreedRate: 1_100,
    dueDate: new Date(Date.now() - 10 * 86_400_000).toISOString().slice(0, 10),
    stage: 'paid',
    paymentStatus: 'paid',
  },
  {
    id: 'deal-8',
    brandName: 'StreamGear HQ',
    contactPerson: 'Priya Nair',
    deliverables: 'Studio setup feature + affiliate code',
    agreedRate: 2_000,
    dueDate: new Date(Date.now() - 20 * 86_400_000).toISOString().slice(0, 10),
    stage: 'paid',
    paymentStatus: 'paid',
  },
] as DealEntity[];

/**
 * First-party CRM data — no external API — backed by Postgres. Seeds demo rows on
 * first boot only (when the table is empty) so the kanban isn't blank on a fresh DB.
 */
@Injectable()
export class DealsService implements OnModuleInit {
  constructor(@InjectRepository(DealEntity) private readonly repo: Repository<DealEntity>) {}

  async onModuleInit() {
    const count = await this.repo.count();
    if (count === 0) {
      await this.repo.save(SEED);
    }
  }

  findAll(): Promise<BrandDeal[]> {
    return this.repo.find({ order: { dueDate: 'ASC' } });
  }

  async updateStage(id: string, stage: BrandDealStage): Promise<BrandDeal> {
    const deal = await this.repo.findOneBy({ id });
    if (!deal) throw new NotFoundException(`Deal "${id}" not found`);
    deal.stage = stage;
    return this.repo.save(deal);
  }
}
