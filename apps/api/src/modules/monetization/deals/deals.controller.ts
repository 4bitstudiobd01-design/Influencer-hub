import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import type { BrandDeal, BrandDealStage } from '@creator-hub/types';
import { DealsService } from './deals.service';

@Controller('monetization/deals')
export class DealsController {
  constructor(private readonly deals: DealsService) {}

  @Get()
  findAll(): Promise<BrandDeal[]> {
    return this.deals.findAll();
  }

  @Patch(':id')
  updateStage(@Param('id') id: string, @Body('stage') stage: BrandDealStage): Promise<BrandDeal> {
    return this.deals.updateStage(id, stage);
  }
}
