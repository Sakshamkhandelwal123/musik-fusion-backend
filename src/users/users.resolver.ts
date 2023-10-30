import { HttpException, HttpStatus } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';

import { UsersService } from './users.service';
import { SignInInput } from './dto/signin.input';
import { UpdateUserInput } from './dto/update-user.input';
import { getErrorCodeAndMessage } from 'src/utils/helpers';
import { EmailNotVerifiedError, InvalidUserError } from 'src/utils/errors/user';

@Resolver('User')
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation('signIn')
  async signIn(@Args('signInInput') signInInput: SignInInput) {
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

      return this.usersService.create(signInInput);
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Query('users')
  findAll() {
    return this.usersService.findAll();
  }

  @Query('user')
  findOne(@Args('id') id: number) {
    return this.usersService.findOne(id);
  }

  @Mutation('updateUser')
  update(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation('removeUser')
  remove(@Args('id') id: number) {
    return this.usersService.remove(id);
  }
}
