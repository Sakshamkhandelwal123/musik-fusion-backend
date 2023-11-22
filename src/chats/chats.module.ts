import { Module, forwardRef } from '@nestjs/common';

import { ChatsService } from './chats.service';
import { ChatsResolver } from './chats.resolver';
import { Channel } from './entities/channel.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from 'src/users/users.module';
import { ChannelsService } from './channels.service';
import { FriendsModule } from 'src/friends/friends.module';
import { ChannelMember } from './entities/channel-member.entity';
import { ChannelMembersService } from './channel-members.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Channel, ChannelMember]),
    FriendsModule,
    forwardRef(() => UsersModule),
  ],
  providers: [
    ChatsResolver,
    ChatsService,
    ChannelsService,
    ChannelMembersService,
  ],
  exports: [ChatsService, ChannelsService, ChannelMembersService],
})
export class ChatsModule {}
