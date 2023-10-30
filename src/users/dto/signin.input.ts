import { IsString, IsEmail } from 'class-validator';

export class SignInInput {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
