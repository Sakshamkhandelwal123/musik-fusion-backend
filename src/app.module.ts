import * as Joi from 'joi';
import { join } from 'path';
import { Dialect } from 'sequelize';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { ApolloDriver } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { SequelizeModule } from '@nestjs/sequelize';

import { applicationConfig } from 'config';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { AuthGuard } from './auth/guards/auth.guard';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DB_DIALECT: Joi.string(),
        DB_HOST: Joi.string(),
        DB_PORT: Joi.number().default(5432),
        DB_USERNAME: Joi.string(),
        DB_PASSWORD: Joi.string().allow(''),
        DB_NAME: Joi.string(),
        APP_ENV: Joi.string()
          .valid('development', 'main')
          .default('development'),
      }),
    }),
    SequelizeModule.forRoot({
      dialect: applicationConfig.database.dialect as Dialect,
      host: applicationConfig.database.host,
      username: applicationConfig.database.username,
      password: applicationConfig.database.password,
      port: parseInt(applicationConfig.database.port, 10),
      database: applicationConfig.database.name,
      logging: false,
      autoLoadModels: true,
      synchronize: false,
    }),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      debug: false,
      playground: !applicationConfig.app.isProduction,
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
      },
      synchronize: true,
      fieldResolverEnhancers: ['guards'],
    }),
    AuthModule,
    UsersModule,
    CommonModule,
  ],
  providers: [
    AppService,
    JwtService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [AppController],
})
export class AppModule {}
