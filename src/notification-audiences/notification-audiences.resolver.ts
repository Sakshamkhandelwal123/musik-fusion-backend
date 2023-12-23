import { Resolver, Query, Args } from '@nestjs/graphql';
import { HttpException, HttpStatus } from '@nestjs/common';

import { getErrorCodeAndMessage } from 'src/utils/helpers';
import { NotificationAudiencesService } from './notification-audiences.service';

@Resolver('NotificationAudience')
export class NotificationAudiencesResolver {
  constructor(
    private readonly notificationAudiencesService: NotificationAudiencesService,
  ) {}

  @Query('notificationAudiences')
  findAll() {
    try {
      return this.notificationAudiencesService.findAll();
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Query('notificationAudience')
  findOne(@Args('id') id: number) {
    try {
      return this.notificationAudiencesService.findOne(id);
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
