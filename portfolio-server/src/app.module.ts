import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';

import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationModule } from './authentication/authentication.module';

import { ServerSideConfiguration } from '@ervum/shared-configuration';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: (ServerSideConfiguration.Database.Host),
      port: (ServerSideConfiguration.Database.Port),
      username: (ServerSideConfiguration.Database.User),
      password: (ServerSideConfiguration.Database.Password),
      database: (ServerSideConfiguration.Database.Name),
      autoLoadEntities: true,
      synchronize: true,
    }),

    UsersModule,

    AuthenticationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
