import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';

import { ChatsService } from './chats.service';
import { CreateChatInput } from './dto/create-chat.input';
import { UpdateChatInput } from './dto/update-chat.input';
import { CentrifugoService } from 'src/common/centrifugo/centrifugo.service';
import { Public } from 'src/auth/decorators/public';
import { getErrorCodeAndMessage } from 'src/utils/helpers';
import { HttpException, HttpStatus } from '@nestjs/common';

@Resolver('Chat')
export class ChatsResolver {
  constructor(
    private readonly chatsService: ChatsService,
    private readonly centrifugoService: CentrifugoService,
  ) {}

  @Public()
  @Mutation('createChat')
  async create(@Args('createChatInput') createChatInput: CreateChatInput) {
    try {
      const client = await this.centrifugoService.connectToCentrifugo(
        '1844108a-8df4-4189-8168-c0a3f3d0959a',
      );

      console.log(client);

      const sub = client.newSubscription('hello');

      sub.subscribe();

      await client.publish('hello', { input: 'hello' });

      return this.chatsService.create(createChatInput);
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Query('chats')
  findAll() {
    return this.chatsService.findAll();
  }

  @Query('chat')
  findOne(@Args('id') id: number) {
    return this.chatsService.findOne(id);
  }

  @Mutation('updateChat')
  update(@Args('updateChatInput') updateChatInput: UpdateChatInput) {
    return this.chatsService.update(updateChatInput.id, updateChatInput);
  }

  @Mutation('removeChat')
  remove(@Args('id') id: number) {
    return this.chatsService.remove(id);
  }
}
