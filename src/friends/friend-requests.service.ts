import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { FriendRequest } from './entities/freind-request.entity';
import { CreateFriendRequestInput } from './dto/friend-request.input';

@Injectable()
export class FriendRequestsService {
  constructor(
    @InjectModel(FriendRequest)
    private readonly friendRequestModel: typeof FriendRequest,
  ) {}

  create(createFriendRequestInput: CreateFriendRequestInput) {
    return this.friendRequestModel.create({ ...createFriendRequestInput });
  }

  findAll(condition = {}, options = {}) {
    return this.friendRequestModel.findAll({
      where: condition,
      ...options,
    });
  }

  findOne(condition = {}, options = {}) {
    return this.friendRequestModel.findOne({
      where: condition,
      ...options,
    });
  }

  update(payload = {}, condition = {}, options = {}) {
    return this.friendRequestModel.update(payload, {
      where: condition,
      ...options,
      returning: true,
    });
  }

  remove(condition = {}) {
    return this.friendRequestModel.destroy({
      where: condition,
    });
  }
}
