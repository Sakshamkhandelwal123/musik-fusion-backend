import { Module, Global } from '@nestjs/common';

import { DateScalar } from './scalar/date-scaler.service';
import { SpotifyService } from './spotify/spotify.service';
import { SpotifyController } from './spotify/spotify.controller';

@Global()
@Module({
  providers: [SpotifyService, DateScalar],
  controllers: [SpotifyController],
  exports: [SpotifyService, DateScalar],
})
export class CommonModule {}
