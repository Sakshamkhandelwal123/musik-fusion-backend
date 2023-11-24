import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Channel } from './entities/channel.entity';
import { UpdateChannelInput } from './dto/update-channel.input';
import { CreateChannelInput } from './dto/create-channel.input';
import { ChannelMembersService } from './channel-members.service';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectModel(Channel)
    private readonly channelModel: typeof Channel,

    private readonly channelMembersService: ChannelMembersService,
  ) {}

  async create(createChannelInput: CreateChannelInput) {
    const channel = await this.channelModel.create({ ...createChannelInput });

    await this.channelMembersService.create({
      userId: createChannelInput.createdBy,
      channelId: channel.id,
    });

    return channel;
  }

  findAll() {
    return `This action returns all chats`;
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

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
