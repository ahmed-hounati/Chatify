
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { WebsocketAdapter } from './chat/websocket-adapter';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: configService.get('FRONTEND_URL'),
  });

  app.useWebSocketAdapter(
    new WebsocketAdapter(app, {
      origin: configService.get('FRONTEND_URL'),
    }),
  );
  await app.listen(process.env.PORT);
}
bootstrap();
