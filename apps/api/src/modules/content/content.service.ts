import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type {
  AnalyticsPlatform,
  ContentDetail,
  ContentListResponse,
  ContentPeriod,
  ContentPerformanceRow,
} from '@creator-hub/types';
import { isoDaysAgo } from '../../common/mock.util';
import { ContentItemEntity } from './content-item.entity';
import { ContentDailyStatEntity } from './content-daily-stat.entity';
import { buildContentSeed } from './content.seed';

type SumKey = 'views' | 'likes' | 'comments' | 'shares' | 'saves' | 'revenue';

function periodStart(period: ContentPeriod): string | null {
  if (period === 'all') return null;
  return isoDaysAgo(period === 'week' ? 6 : 29);
}

@Injectable()
export class ContentService implements OnModuleInit {
  constructor(
    @InjectRepository(ContentItemEntity) private readonly items: Repository<ContentItemEntity>,
    @InjectRepository(ContentDailyStatEntity) private readonly dailyStats: Repository<ContentDailyStatEntity>,
  ) {}

  async onModuleInit() {
    if ((await this.items.count()) > 0) return;
    const { items, stats } = buildContentSeed();
    await this.items.save(items, { chunk: 100 });
    await this.dailyStats.save(stats, { chunk: 250 });
  }

  private summarize(item: ContentItemEntity, period: ContentPeriod): ContentPerformanceRow {
    const from = periodStart(period);
    const relevant = from ? item.stats.filter((s) => s.date >= from) : item.stats;
    const sum = (key: SumKey) => relevant.reduce((acc, s) => acc + s[key], 0);

    return {
      id: item.id,
      platform: item.platform,
      contentType: item.contentType,
      thumbnailUrl: item.thumbnailUrl,
      mediaUrl: item.mediaUrl,
      durationSeconds: item.durationSeconds,
      title: item.title,
      publishedAt: item.publishedAt,
      retentionPct: item.retentionPct,
      views: sum('views'),
      likes: sum('likes'),
      comments: sum('comments'),
      shares: sum('shares'),
      saves: sum('saves'),
      revenue: sum('revenue'),
    };
  }

  async list(params: {
    platform?: AnalyticsPlatform;
    period?: ContentPeriod;
    sortBy?: SumKey;
    page?: number;
    pageSize?: number;
  }): Promise<ContentListResponse> {
    const { platform, period = 'all', sortBy = 'views', page = 1, pageSize = 8 } = params;
    const items = await this.items.find({
      where: platform ? { platform } : {},
      relations: { stats: true },
    });

    const rows = items
      .map((item) => this.summarize(item, period))
      .sort((a, b) => b[sortBy] - a[sortBy]);

    const total = rows.length;
    const pageCount = Math.max(1, Math.ceil(total / pageSize));
    const safePage = Math.min(Math.max(1, page), pageCount);
    const start = (safePage - 1) * pageSize;

    return { rows: rows.slice(start, start + pageSize), total, page: safePage, pageCount };
  }

  async top(params: { period?: ContentPeriod; limit?: number } = {}): Promise<ContentPerformanceRow[]> {
    const { period = 'week', limit = 5 } = params;
    const items = await this.items.find({ relations: { stats: true } });
    return items
      .map((item) => this.summarize(item, period))
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);
  }

  async findOne(id: string): Promise<ContentDetail> {
    const item = await this.items.findOne({ where: { id }, relations: { stats: true } });
    if (!item) throw new NotFoundException(`Content item "${id}" not found`);

    const dailyStats = [...item.stats]
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((s) => ({
        date: s.date,
        views: s.views,
        likes: s.likes,
        comments: s.comments,
        shares: s.shares,
        revenue: s.revenue,
      }));

    return { ...this.summarize(item, 'all'), dailyStats };
  }
}
