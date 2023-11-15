import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ChatsService } from './chats.service';
import { CreateChatInput } from './dto/create-chat.input';
import { UpdateChatInput } from './dto/update-chat.input';

@Resolver('Chat')
export class ChatsResolver {
  constructor(private readonly chatsService: ChatsService) {}

  @Mutation('createChat')
  create(@Args('createChatInput') createChatInput: CreateChatInput) {
    return this.chatsService.create(createChatInput);
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
