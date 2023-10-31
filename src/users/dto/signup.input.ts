import { IsString, IsEmail } from 'class-validator';

export class SignUpInput {
  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
