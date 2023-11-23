import { get } from 'lodash';
import { Op } from 'sequelize';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';

import { PaginationFilter } from 'src/types';
import { Chat } from './entities/chat.entity';
import { ChatsService } from './chats.service';
import { Channel } from './entities/channel.entity';
import { ChannelsService } from './channels.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { InvalidUserError } from 'src/utils/errors/user';
import { getErrorCodeAndMessage } from 'src/utils/helpers';
import { FriendsService } from 'src/friends/friends.service';
import { CreateMessageInput } from './dto/create-chat.input';
import { CurrentUser } from 'src/auth/decorators/currentUser';
import { ChannelMembersService } from './channel-members.service';
import { UserAlreadyNotFriendError } from 'src/utils/errors/friend';
import { CentrifugoService } from 'src/common/centrifugo/centrifugo.service';
import {
  ChannelNotFoundError,
  SelfChannelNotAllowedError,
  UserAlreadyMemberOfChannelError,
  UserNotMemberOfChannelError,
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
  ): Promise<Channel> {
    try {
      // for 1v1 chat only

      if (currentUser.id === friendUserId) {
        throw new SelfChannelNotAllowedError();
      }

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
    @Args('createMessageInput') createMessageInput: CreateMessageInput,
  ): Promise<Chat> {
    try {
      const channel = await this.channelsService.findOne({
        id: createMessageInput.channelId,
      });

      if (!channel) {
        throw new ChannelNotFoundError();
      }

      const member = await this.channelMembersService.findOne({
        userId: currentUser.id,
        channelId: createMessageInput.channelId,
      });

      if (!member) {
        throw new UserNotMemberOfChannelError();
      }

      const client = await this.centrifugoService.connectToCentrifugo(
        currentUser.id,
      );

      client
        .newSubscription(channel.name, {
          token: await this.centrifugoService.generateChannelToken({
            id: channel.id,
          }),
        })
        .subscribe();

      await client.publish(channel.name, {
        input: createMessageInput.message,
      });

      return this.chatsService.create({
        userId: currentUser.id,
        ...createMessageInput,
      });
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Query('getMySubscribedChannels')
  async getMySubscribedChannels(
    @CurrentUser() currentUser: User,
  ): Promise<Channel[]> {
    try {
      const channelMembers = await this.channelMembersService.findAll({
        userId: currentUser.id,
      });

      const channels = await Promise.all(
        channelMembers.map(async (member) => {
          return await this.channelsService.findOne({ id: member.channelId });
        }),
      );

      return channels;
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Query('getAllChatsByChannel')
  async getAllChatsByChannel(
    @CurrentUser() currentUser: User,
    @Args('channelId') channelId: string,
    @Args('filter') filter: PaginationFilter,
  ): Promise<{
    total: number;
    limit: number;
    offset: number;
    chats: Chat[];
  }> {
    try {
      const offset = get(filter, 'offset');
      const limit = get(filter, 'limit');

      const channel = await this.channelsService.findOne({ id: channelId });

      if (!channel) {
        throw new ChannelNotFoundError();
      }

      const member = await this.channelMembersService.findOne({
        userId: currentUser.id,
        channelId,
      });

      if (!member) {
        throw new UserNotMemberOfChannelError();
      }

      const chats = await this.chatsService.findAllPaginated(
        { channelId },
        limit,
        offset,
      );

      return {
        total: chats.total,
        limit: chats.limit,
        offset: chats.offset,
        chats: chats.data,
      };
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
