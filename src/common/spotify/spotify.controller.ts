import { Controller, Get } from '@nestjs/common';
import { SpotifyService } from './spotify.service';

@Controller('spotify')
export class SpotifyController {
  constructor(private readonly spotifyService: SpotifyService) {}

  @Get('/get-spotify-authentication-token')
  async getSpotifyAuthenticationToken(): Promise<string> {
    try {
      const token = await this.spotifyService.getToken();

      return token;
    } catch (error) {
      throw error;
    }
  }
}
