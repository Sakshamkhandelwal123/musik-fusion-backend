import { compare } from 'bcryptjs';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';

import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { SignInInput } from './dto/signin.input';
import { SignUpInput } from './dto/signup.input';
import { getErrorCodeAndMessage } from 'src/utils/helpers';
import {
  EmailNotVerifiedError,
  InvalidUserError,
  UserAlreadyExistError,
  WrongPasswordError,
} from 'src/utils/errors/user';

@Resolver('User')
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation('signUp')
  async signUp(@Args('signUpInput') signUpInput: SignUpInput): Promise<string> {
    try {
      const { email } = signUpInput;

      const user = await this.usersService.findOne({ email });

      if (user) {
        throw new UserAlreadyExistError();
      }

      await this.usersService.createUser(signUpInput);

      return 'We have send a verification email. Please verify you email to continue!!!';
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Mutation('signIn')
  async signIn(
    @Args('signInInput') signInInput: SignInInput,
  ): Promise<{ user: User; accessToken: string; expiresIn: number }> {
    try {
      const { email, password } = signInInput;

      console.log(email, password);

      const user = await this.usersService.findOne({ email });

      if (!user) {
        throw new InvalidUserError();
      }

      console.log(user);

      if (user && !user.isEmailVerified) {
        throw new EmailNotVerifiedError();
      }

      const isValidPassword = await compare(password, user.password);

      if (!isValidPassword) {
        throw new WrongPasswordError();
      }

      const jwtToken = this.usersService.generateToken({
        id: user.id,
        email: user.email,
      });

      const response = {
        user,
        accessToken: jwtToken.token,
        expiresIn: jwtToken.expiresIn,
      };

      return response;
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Query('me')
  async me() {
    try {
      return '1';
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
