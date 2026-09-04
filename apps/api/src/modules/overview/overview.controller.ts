import { Controller, Get } from '@nestjs/common';
import type { OverviewResponse } from '@creator-hub/types';
import { OverviewService } from './overview.service';

@Controller('overview')
export class OverviewController {
  constructor(private readonly overview: OverviewService) {}

  @Get()
  getOverview(): Promise<OverviewResponse> {
    return this.overview.getOverview();
  }
}
