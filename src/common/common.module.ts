import { Module, Global } from '@nestjs/common';

import { DateScalar } from './scalar/date-scaler.service';
import { SpotifyService } from './spotify/spotify.service';
import { SpotifyController } from './spotify/spotify.controller';
import { SendgridService } from './sendgrid/sendgrid.service';

@Global()
@Module({
  providers: [SpotifyService, DateScalar, SendgridService],
  controllers: [SpotifyController],
  exports: [SpotifyService, DateScalar, SendgridService],
})
export class CommonModule {}
