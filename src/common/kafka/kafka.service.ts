import { HttpException, HttpStatus } from '@nestjs/common';
import { Kafka, Producer, Message, CompressionTypes } from 'kafkajs';

import { applicationConfig } from 'config';
import { kafkaClientId } from 'src/utils/constants';
import { getErrorCodeAndMessage, isPresent } from 'src/utils/helpers';

export class KafkaService {
  kafkaClient: Kafka;
  kafkaProducer: Producer;

  isConnected = false;

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

    try {
      this.connectToKafka();
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async connectToKafka() {
    try {
      this.kafkaProducer = this.kafkaClient.producer();

      await this.kafkaProducer.connect();

      this.isConnected = true;

      console.log('Connected To Kafka!');
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async sendMessage({
    messages,
    topic,
    eventType,
  }: {
    messages: Message[];
    topic: string;
    eventType: string;
  }) {
    await this.kafkaProducer.send({
      topic,
      messages,
      compression: CompressionTypes.GZIP,
      timeout: 1000,
    });

    console.log(
      `[pushAnalyticsData] push analytics - key: ${eventType}, topic: ${topic}`,
    );
  }

  prepareKafkaPublishRecord(
    messageValue: any,
    partitionKey: string = undefined,
    creationDate: string = undefined,
  ): Message {
    let messageString: string = null;

    if (isPresent(messageValue) && typeof messageValue === 'object') {
      messageString = JSON.stringify(messageValue);
    }

    return {
      key: partitionKey,
      value: messageString,
      timestamp: creationDate,
      headers: {
        service: kafkaClientId.clientId,
      },
    };
  }

  async prepareAndSendMessage({
    topic,
    messageValue,
    creationDate,
    partitionKey,
  }: {
    topic: string;
    messageValue: any;
    partitionKey?: string;
    creationDate?: any;
  }) {
    const msg = [
      {
        key: messageValue.eventType,
        value: messageValue,
      },
    ];

    const message = this.prepareKafkaPublishRecord(
      msg,
      partitionKey,
      creationDate,
    );

    await this.sendMessage({
      topic,
      messages: [message],
      eventType: messageValue.eventType,
    });
  }
}
