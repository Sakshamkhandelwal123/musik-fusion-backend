import { Module } from '@nestjs/common';
import { NotificationAudiencesService } from './notification-audiences.service';
import { NotificationAudiencesResolver } from './notification-audiences.resolver';
import { SequelizeModule } from '@nestjs/sequelize';
import { NotificationAudience } from './entities/notification-audience.entity';

@Module({
  imports: [SequelizeModule.forFeature([NotificationAudience])],
  providers: [NotificationAudiencesResolver, NotificationAudiencesService],
  exports: [NotificationAudiencesService],
})
export class NotificationAudiencesModule {}
