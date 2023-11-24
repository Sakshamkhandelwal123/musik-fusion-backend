import { HttpException, HttpStatus } from '@nestjs/common';

export class ChannelNotFoundError extends HttpException {
  constructor() {
    super(
      {
        message: 'Channel not found',
        code: 'CHANNEL_NOT_FOUND',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class UserAlreadyMemberOfChannelError extends HttpException {
  constructor() {
    super(
      {
        message: 'You are already a member of this channel',
        code: 'USER_ALREADY_MEMBER_OF_CHANNEL',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class UserNotMemberOfChannelError extends HttpException {
  constructor() {
    super(
      {
        message: 'You are not a member of this channel',
        code: 'USER_NOT_MEMBER_OF_CHANNEL',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class SelfChannelNotAllowedError extends HttpException {
  constructor() {
    super(
      {
        message: 'You can not make or join personal channel',
        code: 'SELF_CHANNEL_NOT_ALLOWED',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class MessageNotFoundError extends HttpException {
  constructor() {
    super(
      {
        message: 'Message not found',
        code: 'MESSAGE_NOT_FOUND',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
