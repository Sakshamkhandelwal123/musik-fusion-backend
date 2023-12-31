import { HttpException, HttpStatus } from '@nestjs/common';

export class WrongInputValueError extends HttpException {
  constructor() {
    super(
      {
        message: 'Wrong input value',
        code: 'WRONG_INPUT_VALUE',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class ImageNotFoundError extends HttpException {
  constructor() {
    super(
      {
        message: 'Please upload a valid image file',
        code: 'IMAGE_NOT_FOUND',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class InvalidStateError extends HttpException {
  constructor() {
    super(
      {
        message: 'State is invalid',
        code: 'INVALID_STATE',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class RefreshTokenNotFoundError extends HttpException {
  constructor() {
    super(
      {
        message: 'No refresh token found',
        code: 'REFRESH_TOKEN_NOT_FOUND',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
