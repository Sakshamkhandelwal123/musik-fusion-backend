import { applyDecorators } from '@nestjs/common';
import { MessagePattern, Payload, Transport } from '@nestjs/microservices';

import { applicationConfig } from 'config';
import { environment } from 'src/utils/constants';

export function MessageTopic(topic: string): any {
  let kafkaTopic: string;

  switch (applicationConfig.app.env) {
    case environment.MAIN:
      kafkaTopic = `${topic}`;
      break;
    case environment.DEVELOPMENT:
      kafkaTopic = `${topic}-${environment.DEVELOPMENT}`;
      break;
  }

  return applyDecorators(MessagePattern(kafkaTopic, Transport.KAFKA));
}

export const MessageValue = Payload;
