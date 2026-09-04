import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ContentItemEntity } from './content-item.entity';

@Entity({ name: 'content_daily_stats' })
@Index(['contentItemId', 'date'], { unique: true })
export class ContentDailyStatEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar')
  contentItemId!: string;

  @ManyToOne(() => ContentItemEntity, (item) => item.stats, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'contentItemId' })
  contentItem!: ContentItemEntity;

  @Column('date')
  date!: string;

  @Column('int')
  views!: number;

  @Column('int')
  likes!: number;

  @Column('int')
  comments!: number;

  @Column('int')
  shares!: number;

  @Column('int')
  saves!: number;

  @Column('int')
  revenue!: number;
}
