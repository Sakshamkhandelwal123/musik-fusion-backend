import { Module } from '@nestjs/common';

import { QueuesService } from './queues.service';
import { ChatsModule } from 'src/chats/chats.module';
import { FriendsModule } from 'src/friends/friends.module';
import { DataCleanupQueueProcessor } from './data-cleanup-queue.process';

@Module({
  imports: [FriendsModule, ChatsModule],
  providers: [DataCleanupQueueProcessor, QueuesService],
  exports: [QueuesService],
})
export class QueuesModule {}
