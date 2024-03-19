import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { StorageConfig } from 'config/storage.config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(StorageConfig.image.destination, {
    prefix: StorageConfig.image.urlPrefix,
    maxAge: StorageConfig.image.maxAge,
    index: false
  });

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors();
  
  await app.listen(3000);

}
bootstrap();
