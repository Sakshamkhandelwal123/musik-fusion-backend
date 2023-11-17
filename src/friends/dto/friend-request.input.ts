import { IsEnum, IsOptional, IsString } from 'class-validator';

import { FriendRequestStatus } from '../entities/freind-request.entity';

export class CreateFriendRequestInput {
  @IsString()
  userId: string;

  @IsString()
  followingUserId: string;

  @IsEnum(FriendRequestStatus)
  @IsOptional()
  friendRequestStatus?: FriendRequestStatus;
}
