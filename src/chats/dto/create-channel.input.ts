import { IsString } from 'class-validator';

export class CreateChannelInput {
  @IsString()
  name: string;

  @IsString()
  createdBy: string;
}
