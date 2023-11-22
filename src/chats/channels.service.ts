import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Channel } from './entities/channel.entity';
import { UpdateChatInput } from './dto/update-chat.input';
import { CreateChannelInput } from './dto/create-channel.input';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectModel(Channel)
    private readonly channelModel: typeof Channel,
  ) {}

  create(createChannelInput: CreateChannelInput) {
    return this.channelModel.create({ ...createChannelInput });
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

  update(id: number, updateChatInput: UpdateChatInput) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
