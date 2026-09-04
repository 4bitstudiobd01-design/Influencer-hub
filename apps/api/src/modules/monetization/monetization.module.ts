import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonetizationController } from './monetization.controller';
import { DealsController } from './deals/deals.controller';
import { DealsService } from './deals/deals.service';
import { DealEntity } from './deals/deal.entity';
import { AffiliateController } from './affiliate/affiliate.controller';
import { AffiliateService } from './affiliate/affiliate.service';
import { AffiliateProgramEntity } from './affiliate/affiliate-program.entity';
import { AffiliateLinkEntity } from './affiliate/affiliate-link.entity';
import { PayoutsController } from './payouts/payouts.controller';
import { PayoutsService } from './payouts/payouts.service';
import { PayoutEntity } from './payouts/payout.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DealEntity, PayoutEntity, AffiliateProgramEntity, AffiliateLinkEntity]),
  ],
  controllers: [MonetizationController, DealsController, AffiliateController, PayoutsController],
  providers: [DealsService, AffiliateService, PayoutsService],
  exports: [DealsService],
})
export class MonetizationModule {}
