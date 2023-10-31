import { Module, Global } from '@nestjs/common';

import { SpotifyService } from './spotify/spotify.service';
import { SpotifyController } from './spotify/spotify.controller';
import { DateScalar } from './scalar/date-scaler.service';

@Global()
@Module({
  providers: [SpotifyService, DateScalar],
  controllers: [SpotifyController],
  exports: [SpotifyService, DateScalar],
})
export class CommonModule {}
