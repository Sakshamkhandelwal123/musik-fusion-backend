import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Chat } from './entities/chat.entity';
import { paginationQuery } from 'src/utils/pagination';
import { CreateChatInput } from './dto/create-chat.input';

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(Chat)
    private readonly chatModel: typeof Chat,
  ) {}

  create(createChatInput: CreateChatInput) {
    return this.chatModel.create({ ...createChatInput });
  }

  findAll(condition = {}, options = {}) {
    return this.chatModel.findAll({
      where: condition,
      ...options,
    });
  }

  findAllPaginated(condition = {}, limit?: number, offset?: number) {
    const query = {
      where: condition,
    };

    return paginationQuery(this.chatModel, offset, limit, query, [
      ['createdAt', 'DESC'],
    ]);
  }

  findOne(condition = {}, options = {}) {
    return this.chatModel.findOne({
      where: condition,
      ...options,
    });
  }

  remove(condition = {}) {
    return this.chatModel.destroy({
      where: condition,
    });
  }
}
