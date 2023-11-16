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

export class UserAlreadyFriendError extends HttpException {
  constructor() {
    super(
      {
        message: 'You are already a friend of this user',
        code: 'USER_ALREADY_FRIEND',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class UserAlreadyNotFriendError extends HttpException {
  constructor() {
    super(
      {
        message: 'You are already not a friend of this user',
        code: 'USER_ALREADY_NOT_FRIEND',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class FriendRequestStatusError extends HttpException {
  constructor(status = '') {
    super(
      {
        message: `Friend request already ${status}`,
        code: 'FRIEND_REQUEST_STATUS',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class NoFriendRequestFoundError extends HttpException {
  constructor() {
    super(
      {
        message: 'No friend request found',
        code: 'NO_FRIEND_REQUEST_FOUND',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
