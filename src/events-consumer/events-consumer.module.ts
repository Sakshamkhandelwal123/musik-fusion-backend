import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { EventsConsumerService } from './events-consumer.service';
import { EventsConsumerController } from './events-consumer.controller';
import { MusikFusionEvents } from './entities/musik-fusion-events.entity';

@Module({
  imports: [SequelizeModule.forFeature([MusikFusionEvents])],
  providers: [EventsConsumerService],
  controllers: [EventsConsumerController],
  exports: [EventsConsumerService],
})
export class EventsConsumerModule {}
