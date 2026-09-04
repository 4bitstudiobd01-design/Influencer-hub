import { Controller, Get } from '@nestjs/common';
import type { Payout } from '@creator-hub/types';
import { PayoutsService } from './payouts.service';

@Controller('monetization/payouts')
export class PayoutsController {
  constructor(private readonly payouts: PayoutsService) {}

  @Get()
  findAll(): Promise<Payout[]> {
    return this.payouts.findAll();
  }
}
