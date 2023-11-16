import { HttpException, HttpStatus } from '@nestjs/common';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';

import { FriendsService } from './friends.service';
import { Public } from 'src/auth/decorators/public';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { InvalidUserError } from 'src/utils/errors/user';
import { FollowUserInput } from './dto/follow-user.input';
import { getErrorCodeAndMessage } from 'src/utils/helpers';
import { UnFollowUserInput } from './dto/unfollow-user.input';
import { CurrentUser } from 'src/auth/decorators/currentUser';
import { FriendUnfriendInput } from './dto/friend-unfriend.input';
import { FriendRequestsService } from './friend-requests.service';
import { FriendRequestStatus } from './entities/freind-request.entity';
import {
  FriendRequestStatusError,
  NoFriendRequestFoundError,
  UserAlreadyFollowedError,
  UserAlreadyFriendError,
  UserAlreadyNotFriendError,
  UserAlreadyUnFollowedError,
} from 'src/utils/errors/friend';

@Resolver('Friend')
export class FriendsResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly friendsService: FriendsService,
    private readonly friendRequestsService: FriendRequestsService,
  ) {}

  @Mutation('friendUnfriendAUser')
  async friendUnfriendAUser(
    @CurrentUser() currentUser: User,
    @Args('friendUnfriendInput') friendUnfriendInput: FriendUnfriendInput,
  ): Promise<string> {
    try {
      const { isFriend } = friendUnfriendInput;

      const follower = await this.friendsService.findOne({
        userId: currentUser.id,
        followingUserId: friendUnfriendInput.followingUserId,
      });

      if (isFriend) {
        if (follower && follower.isFriend) {
          throw new UserAlreadyFriendError();
        }

        const followerRequest = await this.friendRequestsService.findOne({
          userId: currentUser.id,
          followingUserId: friendUnfriendInput.followingUserId,
          friendRequestStatus: FriendRequestStatus.PENDING,
        });

        if (followerRequest) {
          throw new FriendRequestStatusError(
            FriendRequestStatus.PENDING.toLowerCase(),
          );
        }

        if (!follower) {
          await this.friendsService.create({
            userId: currentUser.id,
            followingUserId: friendUnfriendInput.followingUserId,
          });
        }

        await this.friendRequestsService.create({
          userId: currentUser.id,
          followingUserId: friendUnfriendInput.followingUserId,
        });

        return 'Friend request sent';
      }

      if (follower && !follower.isFriend) {
        throw new UserAlreadyNotFriendError();
      }

      await this.friendsService.update(
        { isFriend: false },
        {
          userId: currentUser.id,
          followingUserId: friendUnfriendInput.followingUserId,
        },
      );

      return 'Friend removed';
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Mutation('handleFriendRequest')
  async handleFriendRequest(
    @CurrentUser() currentUser: User,
    @Args('friendUserId') friendUserId: string,
    @Args('status') status: FriendRequestStatus,
  ): Promise<string> {
    try {
      const request = await this.friendRequestsService.findOne({
        userId: friendUserId,
        followingUserId: currentUser.id,
      });

      if (!request) {
        throw new NoFriendRequestFoundError();
      }

      if (request.friendRequestStatus === FriendRequestStatus.PENDING) {
        await this.friendRequestsService.update(
          { friendRequestStatus: status },
          { userId: friendUserId, followingUserId: currentUser.id },
        );
      }

      if (status === FriendRequestStatus.ACCEPTED) {
        await this.friendsService.update(
          { isFriend: true },
          { userId: friendUserId, followingUserId: currentUser.id },
        );
      }

      await this.friendRequestsService.remove({
        userId: friendUserId,
        followingUserId: currentUser.id,
      });

      return `Friend request ${status.toLowerCase()}`;
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Mutation('withdrawFriendRequest')
  async withdrawFriendRequest(
    @CurrentUser() currentUser: User,
    @Args('friendUserId') friendUserId: string,
  ): Promise<string> {
    try {
      const request = await this.friendRequestsService.findOne({
        userId: currentUser.id,
        followingUserId: friendUserId,
      });

      if (!request) {
        throw new NoFriendRequestFoundError();
      }

      await this.friendRequestsService.remove({
        userId: currentUser.id,
        followingUserId: friendUserId,
      });

      return `Friend request withdrawn`;
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Mutation('followUser')
  async followUser(
    @CurrentUser() currentUser: User,
    @Args('followUserInput') followUserInput: FollowUserInput,
  ): Promise<string> {
    try {
      const follower = await this.friendsService.findOne({
        userId: currentUser.id,
        followingUserId: followUserInput.followingUserId,
      });

      if (follower) {
        throw new UserAlreadyFollowedError();
      }

      const createFollowerInput = {
        userId: currentUser.id,
        ...followUserInput,
      };

      await this.friendsService.create(createFollowerInput);

      return 'User followed successfully!!!';
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Mutation('unFollowUser')
  async unFollowUser(
    @CurrentUser() currentUser: User,
    @Args('unFollowUserInput') unFollowUserInput: UnFollowUserInput,
  ): Promise<string> {
    try {
      const follower = await this.friendsService.findOne({
        userId: currentUser.id,
        followingUserId: unFollowUserInput.followingUserId,
      });

      if (!follower) {
        throw new UserAlreadyUnFollowedError();
      }

      const removeFollowerInput = {
        userId: currentUser.id,
        ...unFollowUserInput,
      };

      await this.friendsService.remove(removeFollowerInput);

      return 'User unfollowed successfully!!!';
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Public()
  @Query('getUserFollowers')
  async getUserFollowers(@Args('username') username: string): Promise<User[]> {
    try {
      const user = await this.usersService.findOne({ username });

      if (!user) {
        throw new InvalidUserError();
      }

      const followers = await this.friendsService.findAll({
        followingUserId: user.id,
      });

      const users = await Promise.all(
        followers.map(async (follower) => {
          return this.usersService.findOne({ id: follower.userId });
        }),
      );

      return users;
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Public()
  @Query('getUserFollowing')
  async getUserFollowing(@Args('username') username: string): Promise<User[]> {
    try {
      const user = await this.usersService.findOne({ username });

      if (!user) {
        throw new InvalidUserError();
      }

      const followings = await this.friendsService.findAll({
        userId: user.id,
      });

      const users = await Promise.all(
        followings.map(async (follower) => {
          return this.usersService.findOne({ id: follower.followingUserId });
        }),
      );

      return users;
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Public()
  @Query('getUserFriends')
  async getUserFriends(@Args('username') username: string): Promise<User[]> {
    try {
      const user = await this.usersService.findOne({ username });

      if (!user) {
        throw new InvalidUserError();
      }

      const friends = await this.friendsService.findAll({
        userId: user.id,
        isFriend: true,
      });

      const users = await Promise.all(
        friends.map(async (follower) => {
          return this.usersService.findOne({ id: follower.followingUserId });
        }),
      );

      return users;
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
