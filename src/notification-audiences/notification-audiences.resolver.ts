import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { NotificationAudiencesService } from './notification-audiences.service';
import { CreateNotificationAudienceInput } from './dto/create-notification-audience.input';
import { UpdateNotificationAudienceInput } from './dto/update-notification-audience.input';

@Resolver('NotificationAudience')
export class NotificationAudiencesResolver {
  constructor(private readonly notificationAudiencesService: NotificationAudiencesService) {}

  @Mutation('createNotificationAudience')
  create(@Args('createNotificationAudienceInput') createNotificationAudienceInput: CreateNotificationAudienceInput) {
    return this.notificationAudiencesService.create(createNotificationAudienceInput);
  }

  @Query('notificationAudiences')
  findAll() {
    return this.notificationAudiencesService.findAll();
  }

  @Query('notificationAudience')
  findOne(@Args('id') id: number) {
    return this.notificationAudiencesService.findOne(id);
  }

  @Mutation('updateNotificationAudience')
  update(@Args('updateNotificationAudienceInput') updateNotificationAudienceInput: UpdateNotificationAudienceInput) {
    return this.notificationAudiencesService.update(updateNotificationAudienceInput.id, updateNotificationAudienceInput);
  }

  @Mutation('removeNotificationAudience')
  remove(@Args('id') id: number) {
    return this.notificationAudiencesService.remove(id);
  }
}
