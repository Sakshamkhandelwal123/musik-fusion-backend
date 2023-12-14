import { Injectable } from '@nestjs/common';
import { CreateNotificationAudienceInput } from './dto/create-notification-audience.input';
import { UpdateNotificationAudienceInput } from './dto/update-notification-audience.input';
import { InjectModel } from '@nestjs/sequelize';
import { NotificationAudience } from './entities/notification-audience.entity';

@Injectable()
export class NotificationAudiencesService {
  constructor(
    @InjectModel(NotificationAudience)
    private readonly notificationAudienceModel: typeof NotificationAudience,
  ) {}

  create(createNotificationAudienceInput: CreateNotificationAudienceInput) {
    return this.notificationAudienceModel.create({
      ...createNotificationAudienceInput,
    });
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

  update(
    id: number,
    updateNotificationAudienceInput: UpdateNotificationAudienceInput,
  ) {
    return `This action updates a #${id} notificationAudience`;
  }

  remove(id: number) {
    return `This action removes a #${id} notificationAudience`;
  }
}
