import { Column, Entity, PrimaryColumn } from 'typeorm';
import type { PayoutStatus } from '@creator-hub/types';

@Entity({ name: 'payouts' })
export class PayoutEntity {
  @PrimaryColumn('varchar')
  id!: string;

  @Column('date')
  date!: string;

  @Column('varchar')
  source!: string;

  @Column('int')
  amount!: number;

  @Column('varchar')
  status!: PayoutStatus;

  @Column('varchar')
  payoutMethod!: string;
}
