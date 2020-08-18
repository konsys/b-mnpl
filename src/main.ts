import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { App } from 'src/app';
import { NestFactory } from '@nestjs/core';
import Redis from 'ioredis';
import { Transport } from '@nestjs/microservices';
// import csurf from 'csurf';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

export let redis = null;
export let errorSubscriber = null;
export let messageSubscriber = null;
export let chatRedis = null;

async function bootstrap() {
  redis = new Redis('redis://localhost:6379');
  errorSubscriber = new Redis('redis://localhost:6379');
  messageSubscriber = new Redis('redis://localhost:6379');
  chatRedis = new Redis('redis://localhost:6379');

  redis.on('error', (err) => {
    console.log('Redis Error ' + err);
  });

  const app = await NestFactory.create(App, {
    logger: ['error', 'warn'],
  });

  const options = new DocumentBuilder()
    // .setBasePath('api')
    .setTitle('M Api')
    .setDescription('M API description')
    .setVersion('1.0')
    .addTag('M')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  app.connectMicroservice({
    transport: Transport.NATS,
    options: {
      url: 'nats://localhost:4222',
    },
  });

  await app.startAllMicroservicesAsync();

  app.enableCors();
  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());

  await app.listen(3001);
}
bootstrap();
