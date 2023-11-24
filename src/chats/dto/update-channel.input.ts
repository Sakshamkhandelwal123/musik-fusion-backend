import { IsDate, IsOptional } from 'class-validator';

export class UpdateChannelInput {
  @IsOptional()
  @IsDate()
  lastMessageTimestamp: Date;
}
