import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Notification } from './entities/notification.entity';
import { NotificationsService } from './notifications.service';
import { NotificationsResolver } from './notifications.resolver';
import { NotificationMeta } from './entities/notification-meta.entity';
import { NotificationMetasService } from './notification-metas.service';
import { NotificationAudiencesModule } from 'src/notification-audiences/notification-audiences.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Notification, NotificationMeta]),
    NotificationAudiencesModule,
  ],
  providers: [
    NotificationsResolver,
    NotificationsService,
    NotificationMetasService,
  ],
  exports: [NotificationsService, NotificationMetasService],
})
export class NotificationsModule {}
