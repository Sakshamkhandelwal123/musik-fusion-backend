import { Logger } from '@nestjs/common';
import { customAlphabet } from 'nanoid';
import { get, isEmpty, isNaN, isNil, isNull, isUndefined } from 'lodash';

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

export const generateRandomString = (length: number) => {
  const randomString = customAlphabet(
    'abcdefghijklmnopqrstuvwxyz0123456789',
    length,
  )();

  return randomString;
};
