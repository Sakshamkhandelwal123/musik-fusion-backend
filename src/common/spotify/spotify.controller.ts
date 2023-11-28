import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Res,
} from '@nestjs/common';

import { SpotifyService } from './spotify.service';
import {
  generateRandomString,
  getErrorCodeAndMessage,
} from 'src/utils/helpers';
import { applicationConfig } from 'config';
import { Public } from 'src/auth/decorators/public';

@ApiTags('Spotify')
@Controller('spotify')
export class SpotifyController {
  constructor(private readonly spotifyService: SpotifyService) {}

  @Get('/get-spotify-authentication-token')
  async getSpotifyAuthenticationToken(): Promise<string> {
    try {
      const token = await this.spotifyService.getToken();

      return token;
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Public()
  @Get('/login')
  async login(@Res() res: Response) {
    try {
      const state = generateRandomString(16);
      const scope = 'user-read-private user-read-email';

      const queryParams = new URLSearchParams({
        response_type: 'code',
        client_id: applicationConfig.spotify.clientId,
        scope: scope,
        redirect_uri: 'http://localhost:4000/redirect/callback',
        state: state,
      });

      return res.redirect(
        'https://accounts.spotify.com/authorize?' + queryParams.toString(),
      );
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
