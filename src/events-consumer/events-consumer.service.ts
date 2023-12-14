import { InjectModel } from '@nestjs/sequelize';
import { Injectable, Logger } from '@nestjs/common';

import { CreateEventInput } from './dto/create-event.input';
import { MusikFusionEvents } from './entities/musik-fusion-events.entity';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationAudiencesService } from 'src/notification-audiences/notification-audiences.service';

@Injectable()
export class EventsConsumerService {
  constructor(
    @InjectModel(MusikFusionEvents)
    private musikFusionEventModel: typeof MusikFusionEvents,

    private readonly notificationsService: NotificationsService,

    private readonly notificationAudiencesService: NotificationAudiencesService,
  ) {}

  async create(createEventInput: CreateEventInput) {
    Logger.log(`Event ${createEventInput.eventType} Created`);

    const notificationInput = {
      eventType: createEventInput.eventType,
      performerId: createEventInput.performerId,
      entityId: createEventInput.entityId,
      entityType: createEventInput.entityType,
      metadata: createEventInput.metadata,
    };

    await this.notificationsService.create(notificationInput);

    await this.notificationAudiencesService.create(notificationInput);

    return this.musikFusionEventModel.create({ ...createEventInput });
  }
}
