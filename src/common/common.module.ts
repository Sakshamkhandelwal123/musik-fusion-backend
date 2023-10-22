import { Module, Global } from '@nestjs/common';

import { SpotifyService } from './spotify/spotify.service';
import { SpotifyController } from './spotify/spotify.controller';

@Global()
@Module({
  providers: [SpotifyService],
  controllers: [SpotifyController],
  exports: [SpotifyService],
})
export class CommonModule {}
