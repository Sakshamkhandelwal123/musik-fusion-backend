import { InjectModel } from '@nestjs/sequelize';
import { Injectable, Logger } from '@nestjs/common';

import { paginationQuery } from 'src/utils/pagination';
import { EntityType, EventName } from 'src/utils/constants';
import { Notification } from './entities/notification.entity';
import { isNotificationValid, isPresent } from 'src/utils/helpers';
import { NotificationMeta } from './entities/notification-meta.entity';
import { NotificationMetasService } from './notification-metas.service';
import { CreateNotificationInput } from './dto/create-notification.input';
import { NotificationAudiencesService } from 'src/notification-audiences/notification-audiences.service';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification)
    private readonly notificationModel: typeof Notification,

    @InjectModel(NotificationMeta)
    private readonly notificationMetaModel: typeof NotificationMeta,

    private readonly notificationAudiencesService: NotificationAudiencesService,

    private readonly notificationMetasService: NotificationMetasService,
  ) {}
  async create(createNotificationInput: CreateNotificationInput) {
    try {
      const { eventType, entityType, entityId, performerId } =
        createNotificationInput;

      if (isNotificationValid(eventType as EventName)) {
        const audienceData = await this.notificationAudiencesService.findAll({
          entityId,
        });

        audienceData.map(async (audience) => {
          if (performerId !== audience.userId) {
            const isNotificationExists = await this.findOne({
              userId: audience.userId,
              isRead: false,
              notificationType: eventType,
              entityId,
              entityType,
            });

            let id = isNotificationExists ? isNotificationExists.id : null;

            if (!isNotificationExists) {
              const notification = await this.notificationModel.create({
                userId: audience.userId,
                notificationType: eventType,
                entityId,
                entityType: eventType,
              });

              id = notification.id;
            }

            const notificationMeta =
              await this.notificationMetasService.findAll({
                notificationId: id,
                entityId: performerId,
                referenceType: entityType,
              });

            if (!isPresent(notificationMeta)) {
              await this.notificationMetasService.create({
                notificationId: id,
                entityId: performerId,
                entityType: EntityType.USER,
              });
            }
          }
        });
      }
    } catch (error) {
      Logger.error(error);
    }
  }

  async findAll(payload = {}, options: { limit?: number; offset?: number }) {
    const { limit, offset } = options;

    const query = {
      where: payload,
      include: {
        model: this.notificationMetaModel,
        as: 'metaData',
        order: [['updatedAt', 'DESC']],
      },
    };

    const notificationsData = await paginationQuery(
      this.notificationModel,
      offset,
      limit,
      query,
      [['updatedAt', 'DESC']],
    );

    const notificationCount = await this.notificationModel.count({
      where: payload,
    });

    return {
      total: notificationCount,
      limit: notificationsData.limit,
      offset: notificationsData.offset,
      data: notificationsData.data,
    };
  }

  findOne(payload = {}, options = {}) {
    return this.notificationModel.findOne({
      where: payload,
      ...options,
    });
  }

  findUnreadNotificationsCount(payload = {}) {
    return this.notificationModel.count({
      where: { ...payload, isRead: false },
    });
  }

  update(payload = {}, condition = {}, options = {}) {
    return this.notificationModel.update(payload, {
      where: condition,
      ...options,
    });
  }
}
