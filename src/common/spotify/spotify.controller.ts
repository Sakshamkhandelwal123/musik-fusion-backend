import { AES } from 'crypto-js';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Req,
  Res,
} from '@nestjs/common';

import { applicationConfig } from 'config';
import { SpotifyService } from './spotify.service';
import { Public } from 'src/auth/decorators/public';
import { RefreshTokenNotFoundError } from 'src/utils/errors/common';
import {
  generateRandomString,
  getErrorCodeAndMessage,
} from 'src/utils/helpers';

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

      const encryptedState = AES.encrypt(
        state,
        applicationConfig.spotify.clientSecret,
      ).toString();

      res.cookie('state', encryptedState, { maxAge: 10 * 60 * 1000 }); //expire after 10 minutes

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

  @Public()
  @Get('/refresh-token')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    try {
      const refreshToken = req.cookies?.spotify_refresh_token;

      console.log(refreshToken);

      if (!refreshToken) {
        throw new RefreshTokenNotFoundError();
      }

      const accessToken =
        await this.spotifyService.getRefreshToken(refreshToken);

      res.cookie('spotify_access_token', accessToken, {
        maxAge: 60 * 60 * 1000,
      });

      res.redirect('/');
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
