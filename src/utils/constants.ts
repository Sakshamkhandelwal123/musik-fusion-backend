import 'dotenv/config';

import { applicationConfig } from 'config';

export const environment = {
  DEVELOPMENT: 'development',
  MAIN: 'main',
};

export const emailTemplates = {
  EMAIL_VERIFICATION: 'd-2a9a26bd36964f0abf20cbd6431b666d',
  PASSWORD_VERIFICATION: 'd-084a8aac86cb4e43bf39e73febe73720',
};

export const recoveryOption = {
  RESET: 'Reset',
  RECOVER: 'Recover',
};

export const queueNames = {
  DATA_CLEANUP_QUEUE: 'DATA_CLEANUP_QUEUE',
};

export const deleteEntity = {
  USER: 'USER',
  CHANNEL: 'CHANNEL',
};

export const kafkaClientId = {
  clientId:
    process.env.APP_ENV === environment.MAIN
      ? 'mf-events-process'
      : `mf-events-process-${process.env.APP_ENV}`,
};

export const kafkaTopics = {
  topic:
    process.env.APP_ENV === environment.MAIN
      ? {
          MUSIK_FUSION_USER_EVENTS: 'musik-fusion-user-events',
        }
      : {
          MUSIK_FUSION_USER_EVENTS: `musik-fusion-user-events-${process.env.APP_ENV}`,
        },
};

export const eventPerformers = {
  USER: 'USER',
};

export const entityTypes = {
  USER: 'USER',
};

export const eventNames = {
  USER_SIGN_IN: 'USER_SIGN_IN',
};
