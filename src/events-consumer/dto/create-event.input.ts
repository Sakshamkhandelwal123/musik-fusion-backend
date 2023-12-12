import { EventPerformer } from 'src/utils/constants';

export class CreateEventInput {
  eventType?: string;
  performerId?: string;
  performerType?: EventPerformer;
  entityId?: string;
  entityType?: string;
  referenceId?: string;
  referenceType?: string;
  timestamp: Date;
  metadata?: object;
}
