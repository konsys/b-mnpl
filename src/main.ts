import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import helmet from 'helmet';
// import csurf from 'csurf';
import compression from 'compression';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: ['error', 'warn'],
  });
  app
    .enableCors
    // { origin: 'localhost:3000', methods: ['GET', 'POST'] }
    ();
  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());
  // app.use(csurf({ cookie: true }));

  await app.listen(3001);
}
bootstrap();
