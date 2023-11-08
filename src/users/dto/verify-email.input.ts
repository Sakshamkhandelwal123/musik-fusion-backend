import { IsString, IsEmail, IsNumber } from 'class-validator';

export class VerifyEmailInput {
  @IsString()
  @IsEmail()
  email: string;

  @IsNumber()
  otp: number;
}
