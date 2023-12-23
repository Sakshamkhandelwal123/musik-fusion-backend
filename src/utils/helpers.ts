import { Queue } from 'bullmq';
import { Logger } from '@nestjs/common';
import { customAlphabet } from 'nanoid';
import { get, isEmpty, isNaN, isNil, isNull, isUndefined } from 'lodash';

import { EventName } from './constants';

let queueName: any;

export const isNilOrEmpty = (value: any) =>
  isNil(value) ||
  isEmpty(value) ||
  isNull(value) ||
  isNaN(value) ||
  isUndefined(value);

export const isPresent = (value: any) => !isNilOrEmpty(value);

export const getErrorCodeAndMessage = (
  error: unknown,
  { log }: { log: boolean } = { log: true },
): { code: string; message: string } => {
  if (log) {
    Logger.error(error);
  }

  return {
    code: get(error, 'code', get(error, 'response.code', 'SYSTEM_ERROR')),
    message: get(
      error,
      'message',
      get(error, 'response.message', 'Internal Server Error'),
    ),
  };
};

export const setGlobalQueueValue = async (dataCleanupQueue?: Queue) => {
  queueName = dataCleanupQueue;
};

export const getQueueValue = async () => {
  return queueName;
};

export const getDataCleanupJobId = (actionName: string, id: string) =>
  `DATA_CLEANUP_${actionName}_${id}`;

export const generateRandomString = (length: number) => {
  const randomString = customAlphabet(
    'abcdefghijklmnopqrstuvwxyz0123456789',
    length,
  )();

  return randomString;
};

export const isNotificationValid = (notificationType: EventName) =>
  [
    EventName.FRIEND_REQUEST_ACCEPTED,
    EventName.FRIEND_REQUEST_REJECTED,
    EventName.USER_FOLLOWED,
    EventName.CHANNEL_JOINED,
    EventName.CHANNEL_LEFT,
  ].includes(notificationType);

export const isNotificationAudienceValid = (notificationType: EventName) =>
  [EventName.USER_SIGN_UP, EventName.CHANNEL_CREATED].includes(
    notificationType,
  );
