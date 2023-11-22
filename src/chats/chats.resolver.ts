import { Op } from 'sequelize';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';

import { ChatsService } from './chats.service';
import { ChannelsService } from './channels.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { InvalidUserError } from 'src/utils/errors/user';
import { CreateChatInput } from './dto/create-chat.input';
import { getErrorCodeAndMessage } from 'src/utils/helpers';
import { FriendsService } from 'src/friends/friends.service';
import { CurrentUser } from 'src/auth/decorators/currentUser';
import { ChannelMembersService } from './channel-members.service';
import { UserAlreadyNotFriendError } from 'src/utils/errors/friend';
import { CentrifugoService } from 'src/common/centrifugo/centrifugo.service';
import {
  ChannelNotFoundError,
  UserAlreadyMemberOfChannelError,
} from 'src/utils/errors/chat';

@Resolver('Chat')
export class ChatsResolver {
  constructor(
    private readonly chatsService: ChatsService,
    private readonly friendsService: FriendsService,
    private readonly usersService: UsersService,
    private readonly channelMembersService: ChannelMembersService,
    private readonly channelsService: ChannelsService,
    private readonly centrifugoService: CentrifugoService,
  ) {}

  @Mutation('joinChannel')
  async joinChannel(
    @CurrentUser() currentUser: User,
    @Args('friendUserId') friendUserId: string,
  ) {
    try {
      // for 1v1 chat only

      const friend = await this.usersService.findOne({ id: friendUserId });

      if (!friend) {
        throw new InvalidUserError();
      }

      const isFriend = await this.friendsService.findOne({
        userId: {
          [Op.or]: [currentUser.id, friendUserId],
        },
        followingUserId: {
          [Op.or]: [currentUser.id, friendUserId],
        },
        isFriend: true,
      });

      if (!isFriend) {
        throw new UserAlreadyNotFriendError();
      }

      const channel = await this.channelsService.findOne({ name: friend.id });

      if (!channel) {
        throw new ChannelNotFoundError();
      }

      const member = await this.channelMembersService.findOne({
        userId: currentUser.id,
        channelId: friend.id,
      });

      if (member) {
        throw new UserAlreadyMemberOfChannelError();
      }

      const client = await this.centrifugoService.connectToCentrifugo(
        currentUser.id,
      );

      client.newSubscription(channel.name, {
        token: await this.centrifugoService.generateChannelToken({
          id: channel.id,
        }),
      });

      await this.channelMembersService.create({
        userId: currentUser.id,
        channelId: channel.id,
      });

      return channel;
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Mutation('sendMessage')
  async sendMessage(
    @CurrentUser() currentUser: User,
    @Args('createChatInput') createChatInput: CreateChatInput,
  ) {
    try {
      const client = await this.centrifugoService.connectToCentrifugo(
        currentUser.id,
      );

      client.newSubscription(createChatInput.channelId, {
        token: await this.centrifugoService.generateChannelToken({
          id: createChatInput.channelId,
        }),
      });

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
