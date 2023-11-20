import { Module } from '@nestjs/common';

import { ChatsService } from './chats.service';
import { ChatsResolver } from './chats.resolver';
import { FriendsModule } from 'src/friends/friends.module';

@Module({
  imports: [FriendsModule],
  providers: [ChatsResolver, ChatsService],
})
export class ChatsModule {}
