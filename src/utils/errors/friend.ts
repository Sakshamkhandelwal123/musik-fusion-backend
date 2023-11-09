import { HttpException, HttpStatus } from '@nestjs/common';

export class UserAlreadyFollowedError extends HttpException {
  constructor() {
    super(
      {
        message: 'User already followed',
        code: 'USER_ALREADY_FOLLOWED',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class UserAlreadyUnFollowedError extends HttpException {
  constructor() {
    super(
      {
        message: 'User already unfollowed',
        code: 'USER_ALREADY_UNFOLLOWED',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
