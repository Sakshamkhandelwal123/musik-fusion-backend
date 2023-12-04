import { Job } from 'bullmq';
import { Op } from 'sequelize';
import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';

import { User } from 'src/users/entities/user.entity';
import { ChatsService } from 'src/chats/chats.service';
import { getErrorCodeAndMessage } from 'src/utils/helpers';
import { Channel } from 'src/chats/entities/channel.entity';
import { FriendsService } from 'src/friends/friends.service';
import { ChannelsService } from 'src/chats/channels.service';
import { deleteEntity, queueNames } from 'src/utils/constants';
import { ChannelMembersService } from 'src/chats/channel-members.service';
import { FriendRequestsService } from 'src/friends/friend-requests.service';

@Processor(queueNames.DATA_CLEANUP_QUEUE)
export class DataCleanupQueueProcessor extends WorkerHost {
  constructor(
    private readonly friendsService: FriendsService,
    private readonly chatsService: ChatsService,
    private readonly channelsService: ChannelsService,
    private readonly channelMembersService: ChannelMembersService,
    private readonly friendRequestsService: FriendRequestsService,
  ) {
    super();
  }

  async process(job: Job<unknown>): Promise<void> {
    try {
      const actionName = job.data['actionName'];
      const actionData = job.data['actionData'];

      switch (actionName) {
        case deleteEntity.USER:
          await this.deleteUserData(actionData);
          break;
        case deleteEntity.CHANNEL:
          await this.deleteChannelData(actionData);
          break;
      }
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @OnWorkerEvent('active')
  onActive(job: Job) {
    Logger.log(`Processing job ${job.id}`);
  }

  @OnWorkerEvent('completed')
  onComplete(job: Job) {
    Logger.log(`Completed job of id ${job.id}`);
  }

  @OnWorkerEvent('failed')
  async onError(job: Job, error: Error) {
    Logger.error(`Failed job of id ${job.id} ${error}`);
  }

  async deleteUserData(data: User) {
    await this.friendsService.remove({
      [Op.or]: [{ userId: data.id }, { followingUserId: data.id }],
    });

    await this.friendRequestsService.remove({
      [Op.or]: [{ userId: data.id }, { followingUserId: data.id }],
    });

    await this.channelsService.remove({ createdBy: data.id });

    await this.channelMembersService.remove({ userId: data.id });

    await this.chatsService.remove({ userId: data.id });
  }

  async deleteChannelData(data: Channel) {
    await this.channelMembersService.remove({ channelId: data.id });

    await this.chatsService.remove({ channelId: data.id });
  }
}
