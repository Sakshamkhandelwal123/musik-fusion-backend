import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { EventsConsumerService } from './events-consumer.service';
import { EventsConsumerController } from './events-consumer.controller';
import { MusikFusionEvents } from './entities/musik-fusion-events.entity';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { NotificationAudiencesModule } from 'src/notification-audiences/notification-audiences.module';

@Module({
  imports: [
    SequelizeModule.forFeature([MusikFusionEvents]),
    NotificationsModule,
    NotificationAudiencesModule,
  ],
  providers: [EventsConsumerService],
  controllers: [EventsConsumerController],
  exports: [EventsConsumerService],
})
export class EventsConsumerModule {}
