import { Controller, Post, Param, Patch, Get, Body } from '@nestjs/common';
import { FriendRequestService } from './request.service';

@Controller('friend-requests')
export class FriendRequestController {
  constructor(private friendRequestService: FriendRequestService) {}

  @Post('send/:requesterId/:recipientId')
  async sendFriendRequest(
    @Param('requesterId') requesterId: number,
    @Param('recipientId') recipientId: number,
  ) {
    return this.friendRequestService.sendFriendRequest(requesterId, recipientId);
  }

  @Patch(':requestId')
  async respondToRequest(
    @Param('requestId') requestId: number,
    @Body('status') status: 'accepted' | 'declined',
  ) {
    return this.friendRequestService.respondToRequest(requestId, status);
  }

  @Get('user/:userId')
  async getRequests(@Param('userId') userId: number) {
    return this.friendRequestService.getRequests(userId);
  }
}
