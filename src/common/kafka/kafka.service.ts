import { Kafka } from 'kafkajs';

import { applicationConfig } from 'config';
import { kafkaClientId } from 'src/utils/constants';

export class KafkaService {
  kafkaClient: Kafka;

  constructor() {
    const brokersString: string = applicationConfig.kafka.brokers;

    const brokers: Array<string> = brokersString.split(',');

    const saslUsername = applicationConfig.kafka.username;
    const saslPassword = applicationConfig.kafka.password;

    this.kafkaClient = new Kafka({
      clientId: kafkaClientId.clientId,
      brokers,
      retry: {
        initialRetryTime: 1000,
        retries: 3,
      },
      ...(saslUsername && saslPassword
        ? {
            ssl: true,
            sasl: {
              mechanism: 'scram-sha-256',
              username: saslUsername,
              password: saslPassword,
            },
          }
        : {
            ssl: false,
          }),
    });
  }
}
