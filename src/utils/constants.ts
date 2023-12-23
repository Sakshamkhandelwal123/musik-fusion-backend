import 'dotenv/config';

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

export const kafkaConsumerGroupId = {
  consumerGroupId:
    process.env.APP_ENV === environment.MAIN
      ? 'mf-events-consumer'
      : `mf-events-consumer-${process.env.APP_ENV}`,
};

export const kafkaTopics = {
  topic:
    process.env.APP_ENV === environment.MAIN
      ? {
          MUSIK_FUSION_USER_EVENTS: 'musik-fusion-user-events',
          MUSIK_FUSION_CHANNEL_EVENTS: 'musik-fusion-channel-events',
        }
      : {
          MUSIK_FUSION_USER_EVENTS: `musik-fusion-user-events-${process.env.APP_ENV}`,
          MUSIK_FUSION_CHANNEL_EVENTS: `musik-fusion-channel-events-${process.env.APP_ENV}`,
        },
};

export enum KafkaTopic {
  MUSIK_FUSION_USER_EVENTS = 'musik-fusion-user-events',
  MUSIK_FUSION_CHANNEL_EVENTS = 'musik-fusion-channel-events',
}

export enum EventPerformer {
  USER = 'USER',
  SYSTEM = 'SYSTEM',
}

export enum EntityType {
  USER = 'USER',
  CHANNEL = 'CHANNEL',
}

export enum ActionType {
  CREATED = 'CREATED',
}

export enum EventName {
  USER_SIGN_IN = 'USER_SIGN_IN',
  USER_SIGN_UP = 'USER_SIGN_UP',
  USER_PROFILE_UPDATED = 'USER_PROFILE_UPDATED',
  USER_DELETED = 'USER_DELETED',
  USER_FOLLOWED = 'USER_FOLLOWED',
  USER_UNFOLLOWED = 'USER_UNFOLLOWED',

  FRIEND_REQUEST_SENT = 'FRIEND_REQUEST_SENT',
  FRIEND_REMOVED = 'FRIEND_REMOVED',
  FRIEND_REQUEST_WITHDRAWN = 'FRIEND_REQUEST_WITHDRAWN',
  FRIEND_REQUEST_ACCEPTED = 'FRIEND_REQUEST_ACCEPTED',
  FRIEND_REQUEST_REJECTED = 'FRIEND_REQUEST_REJECTED',

  CHANNEL_CREATED = 'CHANNEL_CREATED',
  CHANNEL_JOINED = 'CHANNEL_JOINED',
  CHANNEL_LEFT = 'CHANNEL_LEFT',
}
