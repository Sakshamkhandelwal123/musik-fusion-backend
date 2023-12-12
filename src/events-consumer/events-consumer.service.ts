import { InjectModel } from '@nestjs/sequelize';
import { Injectable, Logger } from '@nestjs/common';

import { CreateEventInput } from './dto/create-event.input';
import { MusikFusionEvents } from './entities/musik-fusion-events.entity';

@Injectable()
export class EventsConsumerService {
  constructor(
    @InjectModel(MusikFusionEvents)
    private musikFusionEventModel: typeof MusikFusionEvents,
  ) {}

  async create(createEventInput: CreateEventInput) {
    Logger.log(`Event ${createEventInput.eventType} Created`);

    await this.musikFusionEventModel.create({ ...createEventInput });
  }
}
