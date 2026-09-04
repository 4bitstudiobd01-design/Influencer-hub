import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { YoutubeModule } from '../youtube/youtube.module';
import { MetaModule } from '../meta/meta.module';
import { TiktokModule } from '../tiktok/tiktok.module';

@Module({
  imports: [YoutubeModule, MetaModule, TiktokModule],
  controllers: [AnalyticsController],
})
export class AnalyticsModule {}
