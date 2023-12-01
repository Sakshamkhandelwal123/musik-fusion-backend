import { Job } from 'bullmq';
import { Op } from 'sequelize';
import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';

import { User } from 'src/users/entities/user.entity';
import { ChatsService } from 'src/chats/chats.service';
import { getErrorCodeAndMessage } from 'src/utils/helpers';
import { Friend } from 'src/friends/entities/friend.entity';
import { FriendsService } from 'src/friends/friends.service';
import { deleteEntity, queueNames } from 'src/utils/constants';

@Processor(queueNames.DATA_CLEANUP_QUEUE)
export class DataCleanupQueueProcessor extends WorkerHost {
  constructor(
    private readonly friendsService: FriendsService,
    private readonly chatsService: ChatsService,
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
        case deleteEntity.FRIEND:
          await this.deleteFriendData(actionData);
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

    await this.chatsService.remove({ userId: data.id });
  }

  async deleteFriendData(data: Friend) {}
}
