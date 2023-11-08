import { IsString, IsEmail, IsNumber } from 'class-validator';

export class VerifyNewPasswordInput {
  @IsString()
  @IsEmail()
  email: string;

  @IsNumber()
  otp: number;

  @IsString()
  newPassword: string;
}
