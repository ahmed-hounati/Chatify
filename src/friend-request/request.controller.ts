import { Controller, Post,Body, Delete, Param, Patch } from '@nestjs/common';
import { FriendRequestService } from './resuest.service';
import { FriendRequestDto } from './dto/request.dto';
import { FriendRequest } from './schema/request.schema';
// import { MessagesDto } from 'src/message/dto/message.dto';
import { error } from 'console';


@Controller('fr')
export class FriendRequestController {
    constructor(
        private friendRequestService: FriendRequestService
    ){}

    @Post()
    async friendRequest(
        @Body() friendRequestDto: FriendRequestDto, 
  ) {
    try {
      const request = await this.friendRequestService.sendFriendRequest(friendRequestDto);
      return request
    }catch(err){
        throw err
    }
    }

    @Patch('accept/:id')
    async acceptRequest(
        @Param('id') requestId: string,
        @Body() friendRequestDto: FriendRequestDto
    ): Promise<FriendRequest> {
        try {
            const acceptedRequest = await this.friendRequestService.acceptRequest(requestId, friendRequestDto);
            return acceptedRequest;
        } catch (err) {
            throw err;
        }
    }


    @Delete('denied/:id')
    async denyRequest(
        @Param('id') requestId: string,
        @Body() friendRequestDto: FriendRequestDto
    ): Promise<FriendRequest>{
        try{
            const denyRequest = await this.friendRequestService.deleteRequest(requestId, friendRequestDto)
            return denyRequest
        }catch(error){
            throw error
        }
    }
}