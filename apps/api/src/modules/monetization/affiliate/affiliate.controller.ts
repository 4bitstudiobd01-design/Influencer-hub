import { Controller, Get } from '@nestjs/common';
import type { AffiliateSummary } from '@creator-hub/types';
import { AffiliateService } from './affiliate.service';

@Controller('monetization/affiliate')
export class AffiliateController {
  constructor(private readonly affiliate: AffiliateService) {}

  @Get()
  getSummary(): Promise<AffiliateSummary> {
    return this.affiliate.getSummary();
  }
}
