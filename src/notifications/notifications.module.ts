import { Module } from '@nestjs/common';

import { NotificationsService } from './notifications.service';
import { NotificationsResolver } from './notifications.resolver';
import { SequelizeModule } from '@nestjs/sequelize';
import { Notification } from './entities/notification.entity';
import { NotificationMeta } from './entities/notification-meta.entity';
import { NotificationAudiencesModule } from 'src/notification-audiences/notification-audiences.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Notification, NotificationMeta]),
    NotificationAudiencesModule,
  ],
  providers: [NotificationsResolver, NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
