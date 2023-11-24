import { IsString } from 'class-validator';

export class CreateChannelMemberInput {
  @IsString()
  userId: string;

  @IsString()
  channelId: string;
}
