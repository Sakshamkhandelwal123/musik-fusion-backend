import { Global, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/entities/user.entity';

@Global()
@Module({
  imports: [SequelizeModule.forFeature([User]), UsersModule],
})
export class AuthModule {}
