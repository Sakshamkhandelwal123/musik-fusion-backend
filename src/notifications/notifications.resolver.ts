import { HttpException, HttpStatus } from '@nestjs/common';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';

import { getErrorCodeAndMessage } from 'src/utils/helpers';
import { NotificationsService } from './notifications.service';
import { GetNotificationsDto } from './dto/get-notification.input';
import { NotificationMetasService } from './notification-metas.service';

@Resolver('Notification')
export class NotificationsResolver {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly notificationMetasService: NotificationMetasService,
  ) {}

  @Query('getNotificationData')
  getNotificationData(
    @Args('getNotificationsInput') getNotificationsInput: GetNotificationsDto,
  ) {
    try {
      return this.notificationsService.findAll(
        { userId: getNotificationsInput.userId },
        {
          limit: getNotificationsInput.limit,
          offset: getNotificationsInput.offset,
        },
      );
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Query('getUnreadNotificationCount')
  getUnreadNotificationCount(@Args('userId') userId: string) {
    try {
      return this.notificationsService.findUnreadNotificationsCount({ userId });
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Query('getNotificationMetadata')
  getNotificationMetadata(@Args('notificationId') notificationId: string) {
    try {
      return this.notificationMetasService.findAll(
        { notificationId },
        { order: [['createdAt', 'DESC']] },
      );
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Mutation('markNotificationRead')
  async markNotificationRead(@Args('userId') userId: string) {
    try {
      await this.notificationsService.update({ isRead: true }, { userId });

      return 'Successfully Marked All Notifications As Read!';
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
