import { IsString } from 'class-validator';

export class UnFollowUserInput {
  @IsString()
  followingUserId: string;
}
