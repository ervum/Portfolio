import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, Logger } from '@nestjs/common';
import { ServerConfiguration } from '@ervum/shared-configuration';
import { ServerConfigurationType } from '@ervum/types';

/**
 * Initializes and starts the NestJS server application, applying global configuration such as port and proxy prefixes.
 */
async function bootstrap(): Promise<void> {
  const Application: INestApplication = await NestFactory.create(AppModule);
  
  const Configuration: ServerConfigurationType = await ServerConfiguration;
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
