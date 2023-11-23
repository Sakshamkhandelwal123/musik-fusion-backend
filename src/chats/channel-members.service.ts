import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { UpdateChatInput } from './dto/update-chat.input';
import { ChannelMember } from './entities/channel-member.entity';
import { CreateChannelMemberInput } from './dto/create-channel-member.input';

@Injectable()
export class ChannelMembersService {
  constructor(
    @InjectModel(ChannelMember)
    private readonly channelMemberModel: typeof ChannelMember,
  ) {}

  create(createChannelMemberInput: CreateChannelMemberInput) {
    return this.channelMemberModel.create({ ...createChannelMemberInput });
  }

  findAll(condition = {}, options = {}) {
    return this.channelMemberModel.findAll({
      where: condition,
      ...options,
    });
  }

  findOne(condition = {}, options = {}) {
    return this.channelMemberModel.findOne({
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
