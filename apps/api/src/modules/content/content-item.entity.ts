import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import type { AnalyticsPlatform, ContentType } from '@creator-hub/types';
import { ContentDailyStatEntity } from './content-daily-stat.entity';

@Entity({ name: 'content_items' })
export class ContentItemEntity {
  @PrimaryColumn('varchar')
  id!: string;

  @Column('varchar')
  platform!: AnalyticsPlatform;

  @Column('varchar')
  contentType!: ContentType;

  @Column('varchar')
  title!: string;

  @Column('varchar')
  thumbnailUrl!: string;

  @Column('varchar', { nullable: true })
  mediaUrl?: string;

  @Column('date')
  publishedAt!: string;

  @Column('int', { nullable: true })
  durationSeconds?: number;

  /** Static, representative average — not aggregated per period like the daily stats. */
  @Column('int')
  retentionPct!: number;

  @OneToMany(() => ContentDailyStatEntity, (stat) => stat.contentItem)
  stats!: ContentDailyStatEntity[];
}
