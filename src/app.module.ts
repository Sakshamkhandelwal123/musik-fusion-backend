import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Dialect } from 'sequelize';
import { applicationConfig } from 'config';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

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
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
