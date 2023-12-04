import { Queue } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { InjectModel } from '@nestjs/sequelize';

import { queueNames } from 'src/utils/constants';
import { Channel } from './entities/channel.entity';
import { setGlobalQueueValue } from 'src/utils/helpers';
import { UpdateChannelInput } from './dto/update-channel.input';
import { CreateChannelInput } from './dto/create-channel.input';
import { ChannelMembersService } from './channel-members.service';
import {
  ChannelNotFoundError,
  UserNotMemberOfChannelError,
} from 'src/utils/errors/chat';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectModel(Channel)
    private readonly channelModel: typeof Channel,

    private readonly channelMembersService: ChannelMembersService,

    @InjectQueue(queueNames.DATA_CLEANUP_QUEUE)
    private readonly dataCleanupQueue: Queue,
  ) {}

  async create(createChannelInput: CreateChannelInput) {
    const channel = await this.channelModel.create({ ...createChannelInput });

    await this.channelMembersService.create({
      userId: createChannelInput.createdBy,
      channelId: channel.id,
    });

    return channel;
  }

  findOne(condition = {}, options = {}) {
    return this.channelModel.findOne({
      where: condition,
      ...options,
    });
  }

  async update(payload: UpdateChannelInput, condition = {}, options = {}) {
    return this.channelModel.update(payload, {
      where: condition,
      ...options,
      returning: true,
    });
  }

  async isChannelMember(channelId: string, userId: string) {
    const channel = await this.findOne({
      id: channelId,
    });

    if (!channel) {
      throw new ChannelNotFoundError();
    }

    const member = await this.channelMembersService.findOne({
      userId,
      channelId,
    });

    if (!member) {
      throw new UserNotMemberOfChannelError();
    }

    return { channel, member };
  }

  async remove(condition = {}) {
    await setGlobalQueueValue(this.dataCleanupQueue);

    return this.channelModel.destroy({
      where: condition,
      individualHooks: true,
    });
  }
}
