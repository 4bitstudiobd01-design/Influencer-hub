import { Column, Entity, PrimaryColumn } from 'typeorm';
import type { BrandDealStage, PaymentStatus } from '@creator-hub/types';

@Entity({ name: 'brand_deals' })
export class DealEntity {
  @PrimaryColumn('varchar')
  id!: string;

  @Column('varchar')
  brandName!: string;

  @Column('varchar', { nullable: true })
  brandLogoUrl?: string;

  @Column('varchar')
  contactPerson!: string;

  @Column('text')
  deliverables!: string;

  @Column('int')
  agreedRate!: number;

  @Column('date')
  dueDate!: string;

  @Column('varchar')
  stage!: BrandDealStage;

  @Column('varchar')
  paymentStatus!: PaymentStatus;

  @Column('varchar', { nullable: true })
  contractFileUrl?: string;
}
