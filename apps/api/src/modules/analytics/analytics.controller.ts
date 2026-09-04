import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import type { AnalyticsPlatform, AnalyticsResponse } from '@creator-hub/types';
import { YoutubeService } from '../youtube/youtube.service';
import { MetaService } from '../meta/meta.service';
import { TiktokService } from '../tiktok/tiktok.service';

const VALID_PLATFORMS: AnalyticsPlatform[] = ['youtube', 'instagram', 'facebook_page', 'tiktok'];

@Controller('analytics')
export class AnalyticsController {
  constructor(
    private readonly youtube: YoutubeService,
    private readonly meta: MetaService,
    private readonly tiktok: TiktokService,
  ) {}

  @Get(':platform')
  getAnalytics(@Param('platform') platform: string): AnalyticsResponse {
    if (!VALID_PLATFORMS.includes(platform as AnalyticsPlatform)) {
      throw new BadRequestException(`Unknown platform "${platform}"`);
    }
    const typedPlatform = platform as AnalyticsPlatform;
    switch (typedPlatform) {
      case 'youtube':
        return this.youtube.getAnalytics();
      case 'instagram':
      case 'facebook_page':
        return this.meta.getAnalytics(typedPlatform);
      case 'tiktok':
        return this.tiktok.getAnalytics();
    }
  }
}
