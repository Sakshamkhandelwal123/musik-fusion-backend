import { IsEnum, IsOptional, IsString } from 'class-validator';

import { FriendRequestStatus } from '../entities/friend-request.entity';

export class CreateFriendRequestInput {
  @IsString()
  userId: string;

  @IsString()
  followingUserId: string;

  @IsEnum(FriendRequestStatus)
  @IsOptional()
  friendRequestStatus?: FriendRequestStatus;
}
