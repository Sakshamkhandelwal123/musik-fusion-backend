import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { UserController } from './users.controller';
import { ChatsModule } from 'src/chats/chats.module';

@Module({
  imports: [SequelizeModule.forFeature([User]), ChatsModule],
  providers: [UsersResolver, UsersService],
  controllers: [UserController],
  exports: [UsersService],
})
export class UsersModule {}
