import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidUserError extends HttpException {
  constructor() {
    super(
      {
        message: 'User does not exist',
        code: 'INVALID_USER',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class EmailNotVerifiedError extends HttpException {
  constructor() {
    super(
      {
        message: 'Email is not verified',
        code: 'EMAIL_NOT_VERIFIED',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
