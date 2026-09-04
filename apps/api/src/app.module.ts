import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { OverviewModule } from './modules/overview/overview.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { MonetizationModule } from './modules/monetization/monetization.module';
import { InboxModule } from './modules/inbox/inbox.module';
import { IntegrationsModule } from './modules/integrations/integrations.module';
import { ContentModule } from './modules/content/content.module';

@Module({
  imports: [
    DatabaseModule,
    OverviewModule,
    AnalyticsModule,
    MonetizationModule,
    InboxModule,
    IntegrationsModule,
    ContentModule,
  ],
})
export class AppModule {}
