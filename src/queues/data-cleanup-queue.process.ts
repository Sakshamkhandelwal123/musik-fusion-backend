import { Job } from 'bullmq';
import { Processor, WorkerHost } from '@nestjs/bullmq';

import { queueNames } from 'src/utils/constants';

@Processor(queueNames.DATA_CLEANUP_QUEUE)
export class DataCleanupQueueProcessor extends WorkerHost {
  constructor() {
    super();
  }

  async process(job: Job<unknown>): Promise<void> {}
}
