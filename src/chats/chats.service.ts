import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Chat } from './entities/chat.entity';
import { CreateChatInput } from './dto/create-chat.input';
import { UpdateChatInput } from './dto/update-chat.input';

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(Chat)
    private readonly chatModel: typeof Chat,
  ) {}

  create(createChatInput: CreateChatInput) {
    return this.chatModel.create({ ...createChatInput });
  }

  findAll() {
    return `This action returns all chats`;
  }

  findOne(condition = {}, options = {}) {
    return this.chatModel.findOne({
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
