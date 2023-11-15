import { Module, Global } from '@nestjs/common';

import { DateScalar } from './scalar/date-scaler.service';
import { SpotifyService } from './spotify/spotify.service';
import { SendgridService } from './sendgrid/sendgrid.service';
import { SpotifyController } from './spotify/spotify.controller';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { CloudinaryConfiguration } from './cloudinary/cloudinary.configuration';

@Global()
@Module({
  providers: [
    SpotifyService,
    DateScalar,
    SendgridService,
    CloudinaryConfiguration,
    CloudinaryService,
  ],
  controllers: [SpotifyController],
  exports: [
    SpotifyService,
    DateScalar,
    SendgridService,
    CloudinaryConfiguration,
    CloudinaryService,
  ],
})
export class CommonModule {}
