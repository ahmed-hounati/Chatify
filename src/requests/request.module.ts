import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { requestService } from './resuest.service';
import { requestController } from './request.controller';
import { request } from './request.entity';
import { User } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([request, User])],
  providers: [requestService],
  controllers: [requestController],
})
export class FriendRequestModule {}
