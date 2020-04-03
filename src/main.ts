import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/modules/app/app.module';
import helmet from 'helmet';
// import csurf from 'csurf';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: ['error', 'warn'],
  });
  const options = new DocumentBuilder()
    .setTitle('M Api')
    .setDescription('M API description')
    .setVersion('1.0')
    .addTag('M')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  app.enableCors();
  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());
  // app.use(csurf({ cookie: true }));

  await app.listen(3001);
}
bootstrap();
