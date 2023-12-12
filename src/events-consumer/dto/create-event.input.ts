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

export class EventInput {
  eventName?: string;
  performerId?: string;
  performerType?: EventPerformer;
  entityId?: string;
  eventId?: string;
  entityType?: string;
  referenceId?: string;
  referenceType?: string;
  eventTimestamp: Date;
  eventJson?: object;
}
