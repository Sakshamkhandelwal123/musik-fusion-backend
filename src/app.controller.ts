import { Response } from 'express';
import axios, { Axios } from 'axios';
import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Query, Res } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';

import { applicationConfig } from 'config';
import { AppService } from './app.service';
import { Public } from './auth/decorators/public';
import { getErrorCodeAndMessage } from './utils/helpers';

@ApiTags('App')
@Controller()
export class AppController {
  private axiosAccountClient: Axios;

  constructor(private readonly appService: AppService) {
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
  @Get('/redirect/data')
  getData(): string {
    return 'hello';
  }

  @Public()
  @Get('/redirect/callback')
  async callback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: Response,
  ) {
    try {
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

      console.log(token);

      res.redirect('/');
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
    // const payload = {
    //   method: 'POST',
    //   url: '/api/token',
    //   headers: {
    //     'Content-Type': 'application/x-www-form-urlencoded',
    //   },
    //   body: {
    //     grant_type: 'authorization_code',
    //     code,
    //     redirect_uri: 'http://localhost:4000',
    //   },
    // };

    // const authOptions = {
    //   body: {
    //     code: code,
    //     redirect_uri: 'http://localhost:4000',
    //     grant_type: 'authorization_code',
    //   },
    //   headers: {
    //     'content-type': 'application/x-www-form-urlencoded',
    //   },
    //   json: true,
    // };
  }
}
