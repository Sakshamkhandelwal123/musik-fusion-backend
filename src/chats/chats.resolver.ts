import { get } from 'lodash';
import { Op } from 'sequelize';
import { HttpException, HttpStatus } from '@nestjs/common';
import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';

import { PaginationFilter } from 'src/types';
import { Chat } from './entities/chat.entity';
import { ChatsService } from './chats.service';
import { Channel } from './entities/channel.entity';
import { Public } from 'src/auth/decorators/public';
import { ChannelsService } from './channels.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { InvalidUserError } from 'src/utils/errors/user';
import { getErrorCodeAndMessage } from 'src/utils/helpers';
import { FriendsService } from 'src/friends/friends.service';
import { CreateMessageInput } from './dto/create-chat.input';
import { CurrentUser } from 'src/auth/decorators/currentUser';
import { KafkaService } from 'src/common/kafka/kafka.service';
import { ChannelMembersService } from './channel-members.service';
import { UserAlreadyNotFriendError } from 'src/utils/errors/friend';
import { CentrifugoService } from 'src/common/centrifugo/centrifugo.service';
import {
  CannotDeleteOthersChatError,
  ChannelNotFoundError,
  MessageNotFoundError,
  SelfChannelNotAllowedError,
  UserAlreadyMemberOfChannelError,
} from 'src/utils/errors/chat';
import {
  EntityType,
  EventName,
  EventPerformer,
  kafkaTopics,
} from 'src/utils/constants';

@Resolver('Chat')
export class ChatsResolver {
  constructor(
    private readonly chatsService: ChatsService,
    private readonly friendsService: FriendsService,
    private readonly usersService: UsersService,
    private readonly channelMembersService: ChannelMembersService,
    private readonly channelsService: ChannelsService,
    private readonly centrifugoService: CentrifugoService,
    private readonly kafkaService: KafkaService,
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

      client
        .newSubscription(channel.name, {
          token: await this.centrifugoService.generateChannelToken({
            id: channel.id,
          }),
        })
        .subscribe();

      const channelMember = await this.channelMembersService.create({
        userId: currentUser.id,
        channelId: channel.id,
      });

      await this.kafkaService.prepareAndSendMessage({
        messageValue: {
          eventName: EventName.CHANNEL_JOINED,
          entityId: channel.id,
          performerId: currentUser.id,
          entityType: EntityType.CHANNEL,
          performerType: EventPerformer.USER,
          eventJson: { channel, channelMember },
          eventTimestamp: channelMember.createdAt,
        },
        topic: kafkaTopics.topic.MUSIK_FUSION_CHANNEL_EVENTS,
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
      const { channel } = await this.channelsService.isChannelMember(
        createMessageInput.channelId,
        currentUser.id,
      );

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

      const chat = await this.chatsService.create({
        userId: currentUser.id,
        ...createMessageInput,
      });

      await this.channelsService.update(
        {
          lastMessageTimestamp: chat.createdAt,
        },
        { id: channel.id },
      );

      return chat;
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Mutation('leaveChannel')
  async leaveChannel(
    @CurrentUser() currentUser: User,
    @Args('channelId') channelId: string,
  ): Promise<string> {
    try {
      const { channel, member } = await this.channelsService.isChannelMember(
        channelId,
        currentUser.id,
      );

      await this.channelMembersService.remove({
        userId: currentUser.id,
        channelId,
      });

      await this.kafkaService.prepareAndSendMessage({
        messageValue: {
          eventName: EventName.CHANNEL_LEFT,
          entityId: channelId,
          performerId: currentUser.id,
          entityType: EntityType.CHANNEL,
          performerType: EventPerformer.USER,
          eventJson: { channel, member },
          eventTimestamp: new Date(),
        },
        topic: kafkaTopics.topic.MUSIK_FUSION_CHANNEL_EVENTS,
      });

      return 'Channel left successfully';
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Mutation('deleteChat')
  async deleteChat(
    @CurrentUser() currentUser: User,
    @Args('chatId') chatId: string,
  ): Promise<string> {
    try {
      const chat = await this.chatsService.findOne({
        id: chatId,
        userId: currentUser.id,
      });

      if (!chat) {
        throw new MessageNotFoundError();
      }

      await this.chatsService.remove({ id: chatId });

      return 'Message deleted successfully';
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Mutation('deleteBulkChats')
  async deleteBulkChats(
    @CurrentUser() currentUser: User,
    @Args('chatIds') chatIds: string[],
  ) {
    try {
      const chats = await this.chatsService.findAll({
        id: chatIds,
        userId: currentUser.id,
      });

      if (chatIds.length !== chats.length) {
        throw new CannotDeleteOthersChatError();
      }

      await this.chatsService.remove({ id: chatIds });

      return 'Messages deleted successfully';
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Mutation('deleteAllChats')
  async deleteAllChats(
    @CurrentUser() currentUser: User,
    @Args('channelId') channelId: string,
  ) {
    try {
      await this.channelsService.isChannelMember(channelId, currentUser.id);

      await this.chatsService.remove({ id: channelId });

      return 'Messages deleted successfully';
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

      const { channel } = await this.channelsService.isChannelMember(
        channelId,
        currentUser.id,
      );

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

  @Public()
  @ResolveField()
  async user(@Parent() parent: Chat) {
    try {
      return this.usersService.findOne({ id: parent.userId });
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Public()
  @ResolveField()
  async channel(@Parent() parent: Chat) {
    try {
      return this.channelsService.findOne({ id: parent.channelId });
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
