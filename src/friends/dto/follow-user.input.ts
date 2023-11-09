import { IsString } from 'class-validator';

export class FollowUserInput {
  @IsString()
  followingUserId: string;
}

export class CreateFollowerInput {
  @IsString()
  userId: string;

  @IsString()
  followingUserId: string;
}
