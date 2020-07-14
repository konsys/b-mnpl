import { NestFactory } from '@nestjs/core';
import { App } from 'src/app';
import helmet from 'helmet';
// import csurf from 'csurf';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Transport } from '@nestjs/microservices';
import Redis from 'ioredis';

export const redis = new Redis('redis://localhost:6379');

async function bootstrap() {
  redis.connect(() => console.log('Redis connected'));

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
