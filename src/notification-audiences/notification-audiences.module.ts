import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { NotificationAudience } from './entities/notification-audience.entity';
import { NotificationAudiencesService } from './notification-audiences.service';
import { NotificationAudiencesResolver } from './notification-audiences.resolver';

@Module({
  imports: [SequelizeModule.forFeature([NotificationAudience])],
  providers: [NotificationAudiencesResolver, NotificationAudiencesService],
  exports: [NotificationAudiencesService],
})
export class NotificationAudiencesModule {}
