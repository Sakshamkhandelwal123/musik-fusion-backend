import helmet from "helmet";
import * as morgan from "morgan";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";

import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

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
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: [`'self'`],
          styleSrc: [`'self'`, `'unsafe-inline'`],
          imgSrc: [`'self'`, "data:", "validator.swagger.io"],
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
        },
      },
      crossOriginEmbedderPolicy: false,
    })
  );

  const config = new DocumentBuilder()
    .setTitle("Musik Fusion Apis")
    .setDescription("These are musik fusion apis")
    .setVersion("1.0")
    .addTag("MusicFusionApis")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api-docs", app, document);

  const res = await app.listen(4000, "0.0.0.0");
  const serverAddress = res.address();

  console.log(
    `⚡ Server is listening at http://${serverAddress.address}:${serverAddress.port}`
  );
  console.log(
    `⚡ Checkout Documentation at http://${serverAddress.address}:${serverAddress.port}/api-docs`
  );
}

bootstrap();
