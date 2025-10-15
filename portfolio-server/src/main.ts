import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = 6900;

  await app.listen(process.env.PORT ?? port);

  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}
bootstrap();
