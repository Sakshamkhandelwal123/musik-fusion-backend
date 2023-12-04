import { HttpException, HttpStatus } from '@nestjs/common';
import { Resolver, ResolveField, Parent } from '@nestjs/graphql';

import { Public } from 'src/auth/decorators/public';
import { UsersService } from 'src/users/users.service';
import { getErrorCodeAndMessage } from 'src/utils/helpers';
import { FriendRequest } from './entities/friend-request.entity';

@Resolver('FriendRequest')
export class FriendRequestsResolver {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @ResolveField()
  async user(@Parent() parent: FriendRequest) {
    try {
      return this.usersService.findOne({ id: parent.userId });
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Public()
  @ResolveField()
  async followingUser(@Parent() parent: FriendRequest) {
    try {
      return this.usersService.findOne({ id: parent.followingUserId });
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
