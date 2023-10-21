import helmet from "helmet";
import * as morgan from "morgan";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
    allowedHeaders: ["Authorization", "Content-Type"],
  });

  app.useGlobalPipes(new ValidationPipe());

  app.use(morgan("combined"));

  app.use(
    helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false })
  );

  const res = await app.listen(4000, "0.0.0.0");
  const serverAddress = res.address();

  console.log(
    `⚡ Server is listening at http://${serverAddress.address}:${serverAddress.port}`
  );
}

bootstrap();
