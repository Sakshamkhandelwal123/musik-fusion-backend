import helmet from 'helmet';
import * as morgan from 'morgan';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';
import { applicationConfig } from 'config';
import { isPresent } from './utils/helpers';
import { kafkaClientId, kafkaConsumerGroupId } from './utils/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
    allowedHeaders: ['Authorization', 'Content-Type'],
  });

  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe());

  app.use(morgan('combined'));

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: [`'self'`],
          styleSrc: [`'self'`, `'unsafe-inline'`],
          imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
        },
      },
      crossOriginEmbedderPolicy: false,
    }),
  );

  const kafkaBrokers = applicationConfig.kafka.brokers.split(',');
  const kafkaSaslMechanisms = 'scram-sha-256';
  const kafkaSaslUsername = applicationConfig.kafka.username;
  const kafkaSaslPassword = applicationConfig.kafka.password;

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: kafkaClientId.clientId,
        brokers: kafkaBrokers,
        ...(isPresent(kafkaSaslMechanisms) &&
        isPresent(kafkaSaslUsername) &&
        isPresent(kafkaSaslPassword)
          ? {
              ssl: true,
              sasl: {
                mechanism: kafkaSaslMechanisms,
                username: kafkaSaslUsername,
                password: kafkaSaslPassword,
              },
            }
          : {
              ssl: false,
            }),
      },
      consumer: {
        groupId: kafkaConsumerGroupId.consumerGroupId,
      },
    },
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Musik Fusion Apis')
    .setDescription('These are musik fusion apis')
    .setVersion('1.0')
    .addTag('MusikFusionApis')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api-docs', app, swaggerDocument);

  const response = await app.listen(applicationConfig.app.port, '0.0.0.0');
  const serverAddress = response.address();

  await app.startAllMicroservices();

  console.log('🎶 Started Microservices');

  console.log(
    `🎶 Server is listening 🎧 at http://${serverAddress.address}:${serverAddress.port}`,
  );
  console.log(
    `🎶 Checkout Documentation 🧾 at http://${serverAddress.address}:${serverAddress.port}/api-docs`,
  );
}

bootstrap();
