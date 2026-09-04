import { Module } from '@nestjs/common';
import { OverviewController } from './overview.controller';
import { OverviewService } from './overview.service';
import { MonetizationModule } from '../monetization/monetization.module';

@Module({
  imports: [MonetizationModule],
  controllers: [OverviewController],
  providers: [OverviewService],
})
export class OverviewModule {}
