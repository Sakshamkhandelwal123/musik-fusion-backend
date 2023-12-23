import { BullModule } from '@nestjs/bullmq';
import { Module, Global } from '@nestjs/common';

import { queueNames } from 'src/utils/constants';
import { UsersModule } from 'src/users/users.module';
import { ChatsModule } from 'src/chats/chats.module';
import { KafkaService } from './kafka/kafka.service';
import { DateScalar } from './scalar/date-scaler.service';
import { SpotifyService } from './spotify/spotify.service';
import { SendgridService } from './sendgrid/sendgrid.service';
import { SpotifyController } from './spotify/spotify.controller';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { CentrifugoService } from './centrifugo/centrifugo.service';
import { CloudinaryConfiguration } from './cloudinary/cloudinary.configuration';

@Global()
@Module({
  imports: [
    BullModule.registerQueue({ name: queueNames.DATA_CLEANUP_QUEUE }),
    UsersModule,
    ChatsModule,
  ],
  providers: [
    SpotifyService,
    DateScalar,
    SendgridService,
    CloudinaryConfiguration,
    CloudinaryService,
    CentrifugoService,
    KafkaService,
  ],
  controllers: [SpotifyController],
  exports: [
    BullModule,
    SpotifyService,
    DateScalar,
    SendgridService,
    CloudinaryConfiguration,
    CloudinaryService,
    CentrifugoService,
    KafkaService,
  ],
})
export class CommonModule {}
