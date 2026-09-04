import { BadRequestException, Controller, Get, Param, Query } from '@nestjs/common';
import type {
  AnalyticsPlatform,
  ContentDetail,
  ContentListResponse,
  ContentPeriod,
  ContentPerformanceRow,
} from '@creator-hub/types';
import { ContentService } from './content.service';

const VALID_PLATFORMS: AnalyticsPlatform[] = ['youtube', 'instagram', 'facebook_page', 'tiktok'];
const VALID_PERIODS: ContentPeriod[] = ['week', 'month', 'all'];
const VALID_SORT = ['views', 'likes', 'comments', 'shares', 'saves', 'revenue'] as const;

@Controller('content')
export class ContentController {
  constructor(private readonly content: ContentService) {}

  @Get('top')
  top(
    @Query('period') period?: string,
    @Query('limit') limit?: string,
  ): Promise<ContentPerformanceRow[]> {
    const safePeriod = this.parsePeriod(period);
    return this.content.top({ period: safePeriod, limit: limit ? Number(limit) : undefined });
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ContentDetail> {
    return this.content.findOne(id);
  }

  @Get()
  list(
    @Query('platform') platform?: string,
    @Query('period') period?: string,
    @Query('sortBy') sortBy?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<ContentListResponse> {
    let safePlatform: AnalyticsPlatform | undefined;
    if (platform) {
      if (!VALID_PLATFORMS.includes(platform as AnalyticsPlatform)) {
        throw new BadRequestException(`Unknown platform "${platform}"`);
      }
      safePlatform = platform as AnalyticsPlatform;
    }

    const safeSortBy = sortBy && (VALID_SORT as readonly string[]).includes(sortBy)
      ? (sortBy as (typeof VALID_SORT)[number])
      : undefined;

    return this.content.list({
      platform: safePlatform,
      period: this.parsePeriod(period),
      sortBy: safeSortBy,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
    });
  }

  private parsePeriod(period?: string): ContentPeriod | undefined {
    if (!period) return undefined;
    if (!VALID_PERIODS.includes(period as ContentPeriod)) {
      throw new BadRequestException(`Unknown period "${period}"`);
    }
    return period as ContentPeriod;
  }
}
