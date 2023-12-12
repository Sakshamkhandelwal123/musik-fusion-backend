import { HttpException, HttpStatus } from '@nestjs/common';
import {
  Resolver,
  Mutation,
  Args,
  Query,
  ResolveField,
  Parent,
} from '@nestjs/graphql';

import { Friend } from './entities/friend.entity';
import { FriendsService } from './friends.service';
import { Public } from 'src/auth/decorators/public';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { InvalidUserError } from 'src/utils/errors/user';
import { FollowUserInput } from './dto/follow-user.input';
import { getErrorCodeAndMessage } from 'src/utils/helpers';
import { UnFollowUserInput } from './dto/unfollow-user.input';
import { CurrentUser } from 'src/auth/decorators/currentUser';
import { KafkaService } from 'src/common/kafka/kafka.service';
import { FriendUnfriendInput } from './dto/friend-unfriend.input';
import { FriendRequestsService } from './friend-requests.service';
import {
  FriendRequest,
  FriendRequestStatus,
} from './entities/friend-request.entity';
import {
  CannotFollowYourselfError,
  CannotFriendUnfriendYourselfError,
  CannotUnfollowYourselfError,
  FriendRequestStatusError,
  NoFriendRequestFoundError,
  UserAlreadyFollowedError,
  UserAlreadyFriendError,
  UserAlreadyNotFriendError,
  UserAlreadyUnFollowedError,
} from 'src/utils/errors/friend';
import {
  EntityType,
  EventName,
  EventPerformer,
  kafkaTopics,
} from 'src/utils/constants';

@Resolver('Friend')
export class FriendsResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly friendsService: FriendsService,
    private readonly friendRequestsService: FriendRequestsService,
    private readonly kafkaService: KafkaService,
  ) {}

  @Mutation('friendUnfriendAUser')
  async friendUnfriendAUser(
    @CurrentUser() currentUser: User,
    @Args('friendUnfriendInput') friendUnfriendInput: FriendUnfriendInput,
  ): Promise<string> {
    try {
      if (currentUser.id === friendUnfriendInput.followingUserId) {
        throw new CannotFriendUnfriendYourselfError();
      }

      const friendUser = await this.usersService.findOne({
        id: friendUnfriendInput.followingUserId,
      });

      if (!friendUser) {
        throw new InvalidUserError();
      }

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

        const friendRequest = await this.friendRequestsService.create({
          userId: currentUser.id,
          followingUserId: friendUnfriendInput.followingUserId,
        });

        await this.kafkaService.prepareAndSendMessage({
          messageValue: {
            eventName: EventName.FRIEND_REQUEST_SENT,
            entityId: friendRequest.id,
            eventId: friendRequest.id,
            performerId: friendRequest.id,
            entityType: EntityType.USER,
            performerType: EventPerformer.USER,
            eventJson: friendRequest,
            eventTimestamp: new Date(),
          },
          topic: kafkaTopics.topic.MUSIK_FUSION_USER_EVENTS,
        });

        return 'Friend request sent';
      }

      if (follower && !follower.isFriend) {
        throw new UserAlreadyNotFriendError();
      }

      const updatedFriend = await this.friendsService.update(
        { isFriend: false },
        {
          userId: currentUser.id,
          followingUserId: friendUnfriendInput.followingUserId,
        },
      );

      await this.kafkaService.prepareAndSendMessage({
        messageValue: {
          eventName: EventName.FRIEND_REMOVED,
          entityId: updatedFriend[1][0].id,
          eventId: updatedFriend[1][0].id,
          performerId: updatedFriend[1][0].id,
          entityType: EntityType.USER,
          performerType: EventPerformer.USER,
          eventJson: updatedFriend[1][0],
          eventTimestamp: updatedFriend[1][0].updatedAt,
        },
        topic: kafkaTopics.topic.MUSIK_FUSION_USER_EVENTS,
      });

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
        if (status === FriendRequestStatus.ACCEPTED) {
          await this.kafkaService.prepareAndSendMessage({
            messageValue: {
              eventName: EventName.FRIEND_REQUEST_ACCEPTED,
              entityId: request.id,
              eventId: request.id,
              performerId: request.id,
              entityType: EntityType.USER,
              performerType: EventPerformer.USER,
              eventJson: request,
              eventTimestamp: new Date(),
            },
            topic: kafkaTopics.topic.MUSIK_FUSION_USER_EVENTS,
          });
        } else if (status === FriendRequestStatus.REJECTED) {
          await this.kafkaService.prepareAndSendMessage({
            messageValue: {
              eventName: EventName.FRIEND_REQUEST_REJECTED,
              entityId: request.id,
              eventId: request.id,
              performerId: request.id,
              entityType: EntityType.USER,
              performerType: EventPerformer.USER,
              eventJson: request,
              eventTimestamp: new Date(),
            },
            topic: kafkaTopics.topic.MUSIK_FUSION_USER_EVENTS,
          });
        }

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

      await this.kafkaService.prepareAndSendMessage({
        messageValue: {
          eventName: EventName.FRIEND_REQUEST_WITHDRAWN,
          entityId: request.id,
          eventId: request.id,
          performerId: request.id,
          entityType: EntityType.USER,
          performerType: EventPerformer.USER,
          eventJson: request,
          eventTimestamp: new Date(),
        },
        topic: kafkaTopics.topic.MUSIK_FUSION_USER_EVENTS,
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
      if (currentUser.id === followUserInput.followingUserId) {
        throw new CannotFollowYourselfError();
      }

      const followUser = await this.usersService.findOne({
        id: followUserInput.followingUserId,
      });

      if (!followUser) {
        throw new InvalidUserError();
      }

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

      const followedUser =
        await this.friendsService.create(createFollowerInput);

      await this.kafkaService.prepareAndSendMessage({
        messageValue: {
          eventName: EventName.USER_FOLLOWED,
          entityId: followedUser.id,
          eventId: followedUser.id,
          performerId: followedUser.id,
          entityType: EntityType.USER,
          performerType: EventPerformer.USER,
          eventJson: followedUser,
          eventTimestamp: followedUser.createdAt,
        },
        topic: kafkaTopics.topic.MUSIK_FUSION_USER_EVENTS,
      });

      return 'User followed successfully';
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
      if (currentUser.id === unFollowUserInput.followingUserId) {
        throw new CannotUnfollowYourselfError();
      }

      const unfollowUser = await this.usersService.findOne({
        id: unFollowUserInput.followingUserId,
      });

      if (!unfollowUser) {
        throw new InvalidUserError();
      }

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

      await this.kafkaService.prepareAndSendMessage({
        messageValue: {
          eventName: EventName.USER_UNFOLLOWED,
          entityId: follower.id,
          eventId: follower.id,
          performerId: follower.id,
          entityType: EntityType.USER,
          performerType: EventPerformer.USER,
          eventJson: follower,
          eventTimestamp: new Date(),
        },
        topic: kafkaTopics.topic.MUSIK_FUSION_USER_EVENTS,
      });

      return 'User unfollowed successfully';
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Public()
  @Query('getUserFollowers')
  async getUserFollowers(
    @Args('username') username: string,
  ): Promise<{ total: number; followers: Friend[] }> {
    try {
      const user = await this.usersService.findOne({ username });

      if (!user) {
        throw new InvalidUserError();
      }

      const { count, rows } = await this.friendsService.findAndCountAll({
        followingUserId: user.id,
      });

      return { total: count, followers: rows };
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Public()
  @Query('getUserFollowing')
  async getUserFollowing(
    @Args('username') username: string,
  ): Promise<{ total: number; following: Friend[] }> {
    try {
      const user = await this.usersService.findOne({ username });

      if (!user) {
        throw new InvalidUserError();
      }

      const { count, rows } = await this.friendsService.findAndCountAll({
        userId: user.id,
      });

      return { total: count, following: rows };
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Query('getUserFriends')
  async getUserFriends(
    @Args('username') username: string,
  ): Promise<{ total: number; friends: Friend[] }> {
    try {
      const user = await this.usersService.findOne({ username });

      if (!user) {
        throw new InvalidUserError();
      }

      const { count, rows } = await this.friendsService.findAndCountAll({
        userId: user.id,
        isFriend: true,
      });

      return { total: count, friends: rows };
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Query('getFriendRequests')
  async getFriendRequests(
    @CurrentUser() currentUser: User,
  ): Promise<{ total: number; requests: FriendRequest[] }> {
    try {
      const { count, rows } = await this.friendRequestsService.findAndCountAll({
        userId: currentUser.id,
      });

      return { total: count, requests: rows };
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Public()
  @ResolveField()
  async user(@Parent() parent: Friend) {
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
  async followingUser(@Parent() parent: Friend) {
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
