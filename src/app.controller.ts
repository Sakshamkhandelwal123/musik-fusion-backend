import axios, { Axios } from 'axios';
import { AES, enc } from 'crypto-js';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import {
  Controller,
  Get,
  Query,
  Res,
  HttpException,
  HttpStatus,
  Req,
} from '@nestjs/common';

import { applicationConfig } from 'config';
import { AppService } from './app.service';
import { Public } from './auth/decorators/public';
import { getErrorCodeAndMessage } from './utils/helpers';
import { InvalidStateError } from './utils/errors/common';
import { SpotifyService } from './common/spotify/spotify.service';

@ApiTags('App')
@Controller()
export class AppController {
  private axiosAccountClient: Axios;

  constructor(
    private readonly appService: AppService,
    private readonly spotifyService: SpotifyService,
  ) {
    this.axiosAccountClient = axios.create({
      baseURL: 'https://accounts.spotify.com',
    });
  }

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Get('/redirect/callback')
  async callback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const encryptedStateCookie = req.cookies.state;

      if (!encryptedStateCookie) {
        throw new InvalidStateError();
      }

      const decryptedState = AES.decrypt(
        encryptedStateCookie,
        applicationConfig.spotify.clientSecret,
      );

      const originalState = decryptedState.toString(enc.Utf8);

      if (originalState !== state) {
        throw new InvalidStateError();
      }

      res.cookie('state', '', { maxAge: 0 });

      const data = {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: 'http://localhost:4000/redirect/callback',
      };

      const authToken =
        'Basic ' +
        Buffer.from(
          applicationConfig.spotify.clientId +
            ':' +
            applicationConfig.spotify.clientSecret,
        ).toString('base64');

      const token = await this.axiosAccountClient.post('/api/token', data, {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          Authorization: authToken,
        },
      });

      res.cookie('accessToken', token.data.access_token);

      res.redirect('/');
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
