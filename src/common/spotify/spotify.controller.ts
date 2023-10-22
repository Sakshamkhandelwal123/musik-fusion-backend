import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';

import { SpotifyService } from './spotify.service';
import { getErrorCodeAndMessage } from 'src/utils/helpers';

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
}
