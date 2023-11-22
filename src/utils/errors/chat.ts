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
