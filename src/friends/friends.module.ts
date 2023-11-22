import { SequelizeModule } from '@nestjs/sequelize';
import { Module, forwardRef } from '@nestjs/common';

import { Friend } from './entities/friend.entity';
import { FriendsService } from './friends.service';
import { FriendsResolver } from './friends.resolver';
import { UsersModule } from 'src/users/users.module';
import { FriendRequest } from './entities/freind-request.entity';
import { FriendRequestsService } from './friend-requests.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Friend, FriendRequest]),
    forwardRef(() => UsersModule),
  ],
  providers: [FriendsResolver, FriendsService, FriendRequestsService],
  exports: [FriendsService, FriendRequestsService],
})
export class FriendsModule {}
