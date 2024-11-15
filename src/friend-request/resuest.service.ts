import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FriendRequest } from './schema/request.schema';
import { Model } from 'mongoose';
import { User } from '../../src/users/schema/user.schema';

import { FriendRequestDto } from './dto/request.dto';


@Injectable()
export class FriendRequestService {
    constructor(
        @InjectModel(FriendRequest.name) private friendRequestModel: Model<FriendRequest>,
        @InjectModel(User.name) private userModel: Model<User>

    ){} 
    async sendFriendRequest(FriendRequestDto): Promise<FriendRequest>{
        const { senderId, receiverId } = FriendRequestDto;
        const sender= await this.userModel.findById(senderId)
        const reciever= await this.userModel.findById(receiverId)

        if(!sender || sender == reciever){
            throw new Error('Both sender and receiver must exist');
        }

        const existingFriendRequest = ({
            sender,
            reciever
        })

        if(!existingFriendRequest){
            throw new Error('Friend request already exists')
        }
        const friendRequest = new this.friendRequestModel({
            sender,
            reciever
        })
       await friendRequest.save()
        return friendRequest;

    }
    async acceptRequest(requestId: string,  friendRequestDto: FriendRequestDto ): Promise<FriendRequest> {
        const updatedRequest = await this.friendRequestModel.findByIdAndUpdate(
            requestId,
            { status: 'Accepted' },
            { new: true } 
        );
        await updatedRequest.save();
        return updatedRequest
      }
      
      async deleteRequest (requestId: string, friendRequestDto: FriendRequestDto): Promise<FriendRequest>{

        const updateFriendRequest = await this.friendRequestModel.findByIdAndUpdate(
            requestId,
           { status: 'Denied' },
           { new: true }
        ) 
        await updateFriendRequest.save()
        return updateFriendRequest
      }
}