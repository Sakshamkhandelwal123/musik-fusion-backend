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

export class WrongPasswordError extends HttpException {
  constructor() {
    super(
      {
        message: 'Password is incorrect',
        code: 'WRONG_PASSWORD',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class UserAlreadyExistError extends HttpException {
  constructor() {
    super(
      {
        message: 'User already exist',
        code: 'USER_ALREADY_EXIST',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class PhoneNumberInvalidError extends HttpException {
  constructor() {
    super(
      {
        message: 'Invalid phone number',
        code: 'PHONE_NUMBER_INVALID',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class WeakPasswordError extends HttpException {
  constructor() {
    super(
      {
        message: 'Password is weak',
        code: 'WEAK_PASSWORD',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class BreachOfPasswordPolicyError extends HttpException {
  constructor() {
    super(
      {
        message: 'Password policy not met',
        code: 'BREACH_OF_PASSWORD_POLICY',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class InvalidOTPError extends HttpException {
  constructor() {
    super(
      {
        message: 'Invalid OTP',
        code: 'INVALID_OTP',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
