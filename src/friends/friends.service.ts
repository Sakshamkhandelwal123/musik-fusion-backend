import { Queue } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { InjectModel } from '@nestjs/sequelize';

import { queueNames } from 'src/utils/constants';
import { Friend } from './entities/friend.entity';
import { CreateFollowerInput } from './dto/follow-user.input';

@Injectable()
export class FriendsService {
  constructor(
    @InjectModel(Friend)
    private readonly friendModel: typeof Friend,

    @InjectQueue(queueNames.DATA_CLEANUP_QUEUE)
    private readonly dataCleanupQueue: Queue,
  ) {}

  create(createFollowerInput: CreateFollowerInput) {
    return this.friendModel.create({ ...createFollowerInput });
  }

  findAll(condition = {}, options = {}) {
    return this.friendModel.findAll({
      where: condition,
      ...options,
    });
  }

  findAndCountAll(condition = {}, options = {}) {
    return this.friendModel.findAndCountAll({
      where: condition,
      ...options,
    });
  }

  findOne(condition = {}, options = {}) {
    return this.friendModel.findOne({
      where: condition,
      ...options,
    });
  }

  update(payload = {}, condition = {}, options = {}) {
    return this.friendModel.update(payload, {
      where: condition,
      ...options,
      returning: true,
    });
  }

  async remove(condition = {}) {
    return this.friendModel.destroy({
      where: condition,
    });
  }
}
