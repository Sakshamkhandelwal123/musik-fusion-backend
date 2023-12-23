import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { NotificationMeta } from './entities/notification-meta.entity';

@Injectable()
export class NotificationMetasService {
  constructor(
    @InjectModel(NotificationMeta)
    private readonly notificationMetaModel: typeof NotificationMeta,
  ) {}

  create(payload = {}) {
    return this.notificationMetaModel.create({ ...payload });
  }

  findAll(payload = {}, options = {}) {
    return this.notificationMetaModel.findAll({
      where: payload,
      ...options,
    });
  }
}
