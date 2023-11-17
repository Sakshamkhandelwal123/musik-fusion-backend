import { Centrifuge } from 'centrifuge';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CentrifugoService {
  constructor() {}

  async connectToCentrifugo() {
    const centrifuge = new Centrifuge(
      'ws://localhost:8000/connection/websocket',
    );

    centrifuge
      .on('connecting', function (ctx) {
        console.log(`connecting: ${ctx.code}, ${ctx.reason}`);
      })
      .on('connected', function (ctx) {
        console.log(`connected over ${ctx.transport}`);
      })
      .on('disconnected', function (ctx) {
        console.log(`disconnected: ${ctx.code}, ${ctx.reason}`);
      })
      .connect();

    return centrifuge;
  }
}
