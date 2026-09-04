import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { ContentItemEntity } from './content-item.entity';
import { ContentDailyStatEntity } from './content-daily-stat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContentItemEntity, ContentDailyStatEntity])],
  controllers: [ContentController],
  providers: [ContentService],
  exports: [ContentService],
})
export class ContentModule {}
