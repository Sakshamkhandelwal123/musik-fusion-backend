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
