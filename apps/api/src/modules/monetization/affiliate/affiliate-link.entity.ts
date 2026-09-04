import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'affiliate_links' })
export class AffiliateLinkEntity {
  @PrimaryColumn('varchar')
  id!: string;

  @Column('varchar')
  url!: string;

  @Column('int')
  clicks!: number;

  @Column('float')
  cvr!: number;

  @Column('int')
  revenue!: number;
}
