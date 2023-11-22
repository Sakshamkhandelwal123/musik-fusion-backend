import { WebSocket } from 'ws';
import * as jwt from 'jsonwebtoken';
import { Centrifuge } from 'centrifuge';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { applicationConfig } from 'config';
import { UsersService } from 'src/users/users.service';
import { getErrorCodeAndMessage } from 'src/utils/helpers';
import { ChannelsService } from 'src/chats/channels.service';

@Injectable()
export class CentrifugoService {
  constructor(
    private readonly usersService: UsersService,
    private readonly channelsService: ChannelsService,
  ) {}

  async connectToCentrifugo(userId: string) {
    const centrifuge = new Centrifuge(
      'ws://localhost:8000/connection/websocket',
      {
        token: await this.generateUserToken({ id: userId }),
        websocket: WebSocket,
      },
    );

    centrifuge
      .on('connecting', function (ctx) {
        console.log(`connecting: ${ctx.code}, ${ctx.reason}`);
      })
      .on('connected', function (ctx) {
        console.log(`connected over ${ctx.transport}`);
      })
      .on('disconnected', function (ctx) {
        console.log(`disconnected: ${ctx.code}, ${ctx.reason}`);
      })
      .connect();

    return centrifuge;
  }

  async generateUserToken(payload: any) {
    try {
      const user = await this.usersService.findOne(payload);

      if (!user) {
        return null;
      }

      const token = jwt.sign(
        { sub: user.id, info: { username: user.username } },
        applicationConfig.centrifugo.hmacSecretKey,
        { expiresIn: 5 * 60 * 60 },
      );

      return token;
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async generateChannelToken(payload: any) {
    try {
      const channel = await this.channelsService.findOne(payload);

      if (!channel) {
        return null;
      }

      const token = jwt.sign(
        { sub: channel.id, info: { channel: channel.name } },
        applicationConfig.centrifugo.hmacSecretKey,
        { expiresIn: 5 * 60 * 60 },
      );

      return token;
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
