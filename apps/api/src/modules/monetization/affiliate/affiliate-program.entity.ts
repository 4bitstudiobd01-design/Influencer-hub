import { Column, Entity, PrimaryColumn } from 'typeorm';
import type { Platform } from '@creator-hub/types';

@Entity({ name: 'affiliate_programs' })
export class AffiliateProgramEntity {
  @PrimaryColumn('varchar')
  id!: string;

  @Column('varchar')
  name!: string;

  @Column('varchar')
  platform!: Platform;

  @Column('int')
  commissionRate!: number;

  @Column('varchar', { nullable: true })
  thumbnailUrl?: string;
}
