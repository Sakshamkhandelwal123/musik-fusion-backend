import { HttpException, HttpStatus } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';

import { ChatsService } from './chats.service';
import { Public } from 'src/auth/decorators/public';
import { User } from 'src/users/entities/user.entity';
import { CreateChatInput } from './dto/create-chat.input';
import { getErrorCodeAndMessage } from 'src/utils/helpers';
import { FriendsService } from 'src/friends/friends.service';
import { CurrentUser } from 'src/auth/decorators/currentUser';
import { CentrifugoService } from 'src/common/centrifugo/centrifugo.service';

@Resolver('Chat')
export class ChatsResolver {
  constructor(
    private readonly chatsService: ChatsService,
    private readonly friendsService: FriendsService,
    private readonly centrifugoService: CentrifugoService,
  ) {}

  @Public()
  @Mutation('createChat')
  async create(
    @CurrentUser() currentUser: User,
    @Args('createChatInput') createChatInput: CreateChatInput,
  ) {
    try {
      const client = await this.centrifugoService.connectToCentrifugo(
        currentUser.id,
      );

      // client.newSubscription(createChatInput.channelId, {
      //   token: await this.centrifugoService.generateChannelToken({
      //     id: createChatInput.channelId,
      //   }),
      // });

      await client.publish(currentUser.id, {
        input: 'hi',
      });

      return this.chatsService.create(createChatInput);
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Query('getAllFriendsChannel')
  async getAllFriendsChannel(@CurrentUser() currentUser: User) {
    try {
      const friend = await this.friendsService.findAll({
        userId: currentUser.id,
        isFriend: true,
      });

      return friend;
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
