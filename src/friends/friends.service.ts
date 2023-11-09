import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Friend } from './entities/friend.entity';
import { CreateFollowerInput } from './dto/follow-user.input';

@Injectable()
export class FriendsService {
  constructor(
    @InjectModel(Friend)
    private readonly friendModel: typeof Friend,
  ) {}

  create(createFollowerInput: CreateFollowerInput) {
    return this.friendModel.create({ ...createFollowerInput });
  }

  findAll() {
    return `This action returns all friends`;
  }

  findOne(condition = {}, options = {}) {
    return this.friendModel.findOne({
      where: condition,
      ...options,
    });
  }

  update(payload = {}, condition = {}) {}

  remove(condition = {}) {
    return this.friendModel.destroy({
      where: condition,
    });
  }
}
