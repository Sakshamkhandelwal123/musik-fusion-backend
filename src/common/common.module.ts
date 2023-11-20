import { Module, Global } from '@nestjs/common';

import { UsersModule } from 'src/users/users.module';
import { DateScalar } from './scalar/date-scaler.service';
import { SpotifyService } from './spotify/spotify.service';
import { SendgridService } from './sendgrid/sendgrid.service';
import { SpotifyController } from './spotify/spotify.controller';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { CentrifugoService } from './centrifugo/centrifugo.service';
import { CloudinaryConfiguration } from './cloudinary/cloudinary.configuration';

@Global()
@Module({
  imports: [UsersModule],
  providers: [
    SpotifyService,
    DateScalar,
    SendgridService,
    CloudinaryConfiguration,
    CloudinaryService,
    CentrifugoService,
  ],
  controllers: [SpotifyController],
  exports: [
    SpotifyService,
    DateScalar,
    SendgridService,
    CloudinaryConfiguration,
    CloudinaryService,
    CentrifugoService,
  ],
})
export class CommonModule {}
