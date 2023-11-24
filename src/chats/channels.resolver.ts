import { HttpException, HttpStatus } from '@nestjs/common';
import { Resolver, ResolveField, Parent } from '@nestjs/graphql';

import { Public } from 'src/auth/decorators/public';
import { Channel } from './entities/channel.entity';
import { UsersService } from 'src/users/users.service';
import { getErrorCodeAndMessage } from 'src/utils/helpers';

@Resolver('Channel')
export class ChannelsResolver {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @ResolveField()
  async createdBy(@Parent() parent: Channel) {
    try {
      return this.usersService.findOne({ id: parent.createdBy });
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
