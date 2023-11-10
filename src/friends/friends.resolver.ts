import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { HttpException, HttpStatus } from '@nestjs/common';

import { FriendsService } from './friends.service';
import { User } from 'src/users/entities/user.entity';
import { FollowUserInput } from './dto/follow-user.input';
import { getErrorCodeAndMessage } from 'src/utils/helpers';
import { UnFollowUserInput } from './dto/unfollow-user.input';
import { CurrentUser } from 'src/auth/decorators/currentUser';
import { FriendUnfriendInput } from './dto/friend-unfriend.input';
import {
  UserAlreadyFollowedError,
  UserAlreadyFriendError,
  UserAlreadyNotFriendError,
  UserAlreadyUnFollowedError,
} from 'src/utils/errors/friend';

@Resolver('Friend')
export class FriendsResolver {
  constructor(private readonly friendsService: FriendsService) {}

  @Mutation('friendUnfriendAUser')
  async friendUnfriendAUser(
    @CurrentUser() currentUser: User,
    @Args('friendUnfriendInput') friendUnfriendInput: FriendUnfriendInput,
  ) {
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

        if (follower && !follower.isFriend) {
          await this.friendsService.update(
            { isFriend },
            {
              userId: currentUser.id,
              followingUserId: friendUnfriendInput.followingUserId,
            },
          );
        } else {
          const createFriendInput = {
            userId: currentUser.id,
            ...friendUnfriendInput,
          };

          await this.friendsService.create(createFriendInput);
        }

        return 'You become friend of each other';
      }

      if (follower) {
        throw new UserAlreadyNotFriendError();
      }
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
  ) {
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
  ) {
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
}
