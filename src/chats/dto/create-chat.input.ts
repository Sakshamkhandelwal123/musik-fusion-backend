import { IsString } from 'class-validator';

export class CreateChatInput {
  @IsString()
  message: string;

  @IsString()
  channelId: string;
}
