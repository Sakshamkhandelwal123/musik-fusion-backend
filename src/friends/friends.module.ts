import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Friend } from './entities/friend.entity';
import { FriendsService } from './friends.service';
import { FriendsResolver } from './friends.resolver';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [SequelizeModule.forFeature([Friend]), UsersModule],
  providers: [FriendsResolver, FriendsService],
  exports: [FriendsService],
})
export class FriendsModule {}
