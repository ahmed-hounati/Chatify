import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RequestModule } from './request/request.module';
import { MessageModule } from './message/message.module';
import { CanalModule } from './canal/canal.module';
import { NotificationModule } from './notification/notification.module';
import * as dotenv from 'dotenv';


dotenv.config();

@Module({
  imports: [MongooseModule.forRoot(process.env.MONGO_URI),
    UsersModule,
    AuthModule,
    RequestModule,
    MessageModule,
    CanalModule,
    NotificationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
