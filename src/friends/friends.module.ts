import { SequelizeModule } from '@nestjs/sequelize';
import { Module, forwardRef } from '@nestjs/common';

import { Friend } from './entities/friend.entity';
import { FriendsService } from './friends.service';
import { FriendsResolver } from './friends.resolver';
import { UsersModule } from 'src/users/users.module';
import { FriendRequest } from './entities/friend-request.entity';
import { FriendRequestsService } from './friend-requests.service';
import { FriendRequestsResolver } from './friend-requests.resolver';

@Module({
  imports: [
    SequelizeModule.forFeature([Friend, FriendRequest]),
    forwardRef(() => UsersModule),
  ],
  providers: [
    FriendsResolver,
    FriendRequestsResolver,
    FriendsService,
    FriendRequestsService,
  ],
  exports: [FriendsService, FriendRequestsService],
})
export class FriendsModule {}
