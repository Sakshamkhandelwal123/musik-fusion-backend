import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { NotificationsService } from './notifications.service';
import { CreateNotificationInput } from './dto/create-notification.input';
import { UpdateNotificationInput } from './dto/update-notification.input';

@Resolver('Notification')
export class NotificationsResolver {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Mutation('createNotification')
  create(@Args('createNotificationInput') createNotificationInput: CreateNotificationInput) {
    return this.notificationsService.create(createNotificationInput);
  }

  @Query('notifications')
  findAll() {
    return this.notificationsService.findAll();
  }

  @Query('notification')
  findOne(@Args('id') id: number) {
    return this.notificationsService.findOne(id);
  }

  @Mutation('updateNotification')
  update(@Args('updateNotificationInput') updateNotificationInput: UpdateNotificationInput) {
    return this.notificationsService.update(updateNotificationInput.id, updateNotificationInput);
  }

  @Mutation('removeNotification')
  remove(@Args('id') id: number) {
    return this.notificationsService.remove(id);
  }
}
