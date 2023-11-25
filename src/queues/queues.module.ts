import { Module } from '@nestjs/common';
import { DataCleanupQueueProcessor } from './data-cleanup-queue.process';
import { QueuesService } from './queues.service';

@Module({
  providers: [DataCleanupQueueProcessor, QueuesService],
  exports: [QueuesService],
})
export class QueuesModule {}
