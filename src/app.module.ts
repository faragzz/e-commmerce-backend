import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { EmailModule } from './email/email.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/Guards/auth.guard';

@Module({
  imports: [
    UsersModule,
    EmailModule,
    AuthModule,
    MongooseModule.forRoot('mongodb://localhost/test'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
