import { InjectModel } from '@nestjs/sequelize';
import { Injectable, Logger } from '@nestjs/common';

import { EventName } from 'src/utils/constants';
import { isNotificationValid } from 'src/utils/helpers';
import { Notification } from './entities/notification.entity';
import { CreateNotificationInput } from './dto/create-notification.input';
import { UpdateNotificationInput } from './dto/update-notification.input';
import { NotificationAudiencesService } from 'src/notification-audiences/notification-audiences.service';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification)
    private readonly notificationModel: typeof Notification,

    private readonly notificationAudiencesService: NotificationAudiencesService,
  ) {}
  async create(createNotificationInput: CreateNotificationInput) {
    try {
      const { eventType, entityType, entityId, metadata, performerId } =
        createNotificationInput;

      if (isNotificationValid(eventType as EventName)) {
        const notifications = await this.notificationAudiencesService.findAll(
          {},
        );

        console.log(notifications);
      }
    } catch (error) {
      Logger.error(error);
    }
  }

  findAll(payload = {}, options = {}) {
    return this.notificationModel.findAll({
      where: payload,
      ...options,
    });
  }

  findOne(payload = {}, options = {}) {
    return this.notificationModel.findOne({
      where: payload,
      ...options,
    });
  }

  update(id: number, updateNotificationInput: UpdateNotificationInput) {
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
