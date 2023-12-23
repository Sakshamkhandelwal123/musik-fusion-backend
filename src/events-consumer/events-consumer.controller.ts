import * as dayjs from 'dayjs';
import { Controller, Logger } from '@nestjs/common';

import { KafkaTopic } from 'src/utils/constants';
import { EventInput } from './dto/create-event.input';
import { Ctx, KafkaContext } from '@nestjs/microservices';
import { EventsConsumerService } from './events-consumer.service';
import { MessageTopic, MessageValue } from 'src/common/kafka/decorators/kafka';

@Controller()
export class EventsConsumerController {
  constructor(private readonly eventsConsumerService: EventsConsumerService) {}

  @MessageTopic(KafkaTopic.MUSIK_FUSION_CHANNEL_EVENTS)
  async musikFusionChannelEvents(
    @MessageValue() value: EventInput,
    @Ctx() context: KafkaContext,
  ) {
    try {
      const time = context.getMessage().timestamp;
      const timestamp = dayjs(Number(time)).format();
      const eventTimestamp = new Date(timestamp);

      const obj = {
        eventType: value.eventName,
        performerId: value.performerId,
        performerType: value.performerType,
        entityId: value.entityId,
        entityType: value.entityType,
        referenceId: null,
        referenceType: null,
        timestamp: eventTimestamp,
        metadata: value.eventJson,
      };

      await this.eventsConsumerService.create({
        ...obj,
      });
    } catch (error) {
      Logger.error(error);
    }
  }

  @MessageTopic(KafkaTopic.MUSIK_FUSION_USER_EVENTS)
  async musikFusionUserEvents(
    @MessageValue() value: EventInput,
    @Ctx() context: KafkaContext,
  ) {
    try {
      const time = context.getMessage().timestamp;
      const timestamp = dayjs(Number(time)).format();
      const eventTimestamp = new Date(timestamp);

      const obj = {
        eventType: value.eventName,
        performerId: value.performerId,
        performerType: value.performerType,
        entityId: value.entityId,
        entityType: value.entityType,
        referenceId: null,
        referenceType: null,
        timestamp: eventTimestamp,
        metadata: value.eventJson,
      };

      await this.eventsConsumerService.create({
        ...obj,
      });
    } catch (error) {
      Logger.error(error);
    }
  }
}
