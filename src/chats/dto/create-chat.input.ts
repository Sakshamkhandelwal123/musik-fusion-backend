import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateMessageInput {
  @IsString()
  message: string;

  @IsString()
  channelId: string;
}

export class CreateChatInput {
  @IsString()
  message: string;

  @IsString()
  channelId: string;

  @IsString()
  userId: string;

  @IsOptional()
  @IsBoolean()
  isWatched?: boolean;
}
