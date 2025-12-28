import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, Logger } from '@nestjs/common';
import { ServerConfiguration } from '@ervum/shared-configuration';

async function bootstrap() {
  const Application: INestApplication = await NestFactory.create(AppModule);
  
  const Configuration = await ServerConfiguration;
  const Port: number = (Configuration.Port);

  Application.setGlobalPrefix(Configuration.ProxyURL);
  /* Application.enableCors({
    origin: (Configuration.ClientURL),
    credentials: true,
  }); */

  await Application.listen(Port);

  Logger.log(`🚀 Application is running on: ${await Application.getUrl()}`);
}

bootstrap();
