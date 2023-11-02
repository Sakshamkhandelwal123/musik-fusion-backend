import { Global, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { User } from 'src/users/entities/user.entity';

@Global()
@Module({
  imports: [SequelizeModule.forFeature([User])],
})
export class AuthModule {}
