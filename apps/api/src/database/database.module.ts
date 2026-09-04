import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DealEntity } from '../modules/monetization/deals/deal.entity';
import { PayoutEntity } from '../modules/monetization/payouts/payout.entity';
import { AffiliateProgramEntity } from '../modules/monetization/affiliate/affiliate-program.entity';
import { AffiliateLinkEntity } from '../modules/monetization/affiliate/affiliate-link.entity';
import { ContentItemEntity } from '../modules/content/content-item.entity';
import { ContentDailyStatEntity } from '../modules/content/content-daily-stat.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USER', 'postgres'),
        password: config.get<string>('DB_PASSWORD', 'admin'),
        database: config.get<string>('DB_NAME', 'bit_fluencer'),
        // Render/most managed Postgres hosts require SSL with a self-signed chain;
        // local Postgres and the docker-compose db don't use SSL at all, so this is
        // opt-in via DB_SSL rather than always-on.
        ssl: config.get<string>('DB_SSL') === 'true' ? { rejectUnauthorized: false } : false,
        entities: [
          DealEntity,
          PayoutEntity,
          AffiliateProgramEntity,
          AffiliateLinkEntity,
          ContentItemEntity,
          ContentDailyStatEntity,
        ],
        // Scaffold convenience: auto-creates/updates tables from entities. Swap for
        // TypeORM migrations before this goes anywhere near production data.
        synchronize: true,
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
