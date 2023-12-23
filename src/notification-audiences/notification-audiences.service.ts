import { InjectModel } from '@nestjs/sequelize';
import { Injectable, Logger } from '@nestjs/common';

import { ActionType, EventName } from 'src/utils/constants';
import { isNotificationAudienceValid } from 'src/utils/helpers';
import { NotificationAudience } from './entities/notification-audience.entity';
import { CreateNotificationAudienceInput } from './dto/create-notification-audience.input';

@Injectable()
export class NotificationAudiencesService {
  constructor(
    @InjectModel(NotificationAudience)
    private readonly notificationAudienceModel: typeof NotificationAudience,
  ) {}

  create(createNotificationAudienceInput: CreateNotificationAudienceInput) {
    try {
      const { eventType, entityType, entityId, performerId } =
        createNotificationAudienceInput;

      if (isNotificationAudienceValid(eventType as EventName)) {
        return this.notificationAudienceModel.create({
          userId: performerId,
          entityId,
          entityType,
          action: ActionType.CREATED,
        });
      }
    } catch (error) {
      Logger.error(error);
    }
  }

  findAll(payload = {}, options = {}) {
    return this.notificationAudienceModel.findAll({
      where: payload,
      ...options,
    });
  }

  findOne(payload = {}, options = {}) {
    return this.notificationAudienceModel.findOne({
      where: payload,
      ...options,
    });
  }
}
