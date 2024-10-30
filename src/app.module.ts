import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RequestController } from './request/request.controller';
import { RequestService } from './request/request.service';
import { RequestModule } from './request/request.module';
import * as dotenv from 'dotenv';


dotenv.config();

@Module({
  imports: [MongooseModule.forRoot(process.env.MONGO_URI),
            UsersModule,
            AuthModule,
            RequestModule],
  controllers: [AppController, RequestController],
  providers: [AppService, RequestService],
})
export class AppModule { }
