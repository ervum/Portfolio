import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, Logger } from '@nestjs/common';
import { ServerSideConfiguration as Configuration } from '@ervum/shared-configuration';

async function bootstrap() {
  const Application: INestApplication = await NestFactory.create(AppModule);
  const Port: number = (Configuration.Port);

  Application.setGlobalPrefix(Configuration.ProxyURL);
  /* Application.enableCors({
    origin: (Configuration.ClientSideURL),
    credentials: true,
  }); */

  await Application.listen(Port);

  Logger.log(`🚀 Application is running on: ${await Application.getUrl()}`);
}

bootstrap();
