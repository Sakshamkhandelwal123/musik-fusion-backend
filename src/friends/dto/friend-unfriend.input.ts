import { IsBoolean, IsString } from 'class-validator';

export class FriendUnfriendInput {
  @IsString()
  followingUserId: string;

  @IsBoolean()
  isFriend: boolean;
}
