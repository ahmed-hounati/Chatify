import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomService } from 'src/room/room.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class VideoGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly roomsService: RoomService) { }

  @SubscribeMessage('join_room')
  handleJoinRoom(@MessageBody() roomName: string, @ConnectedSocket() client: Socket) {
    this.roomsService.joinRoom(roomName, client.id);

    // Notify the client that they joined the room successfully
    client.join(roomName);
    client.emit('joined_room', roomName);

    // Notify other users in the room that a new person has joined
    client.to(roomName).emit('another_person_ready');
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    // Find the room(s) this client was in and remove them
    this.roomsService.rooms.forEach((clients, roomName) => {
      if (clients.has(client.id)) {
        this.roomsService.leaveRoom(roomName, client.id);
        client.leave(roomName);

        // Notify remaining users in the room that someone left
        this.server.to(roomName).emit('user_disconnected', client.id);
      }
    });
  }

  @SubscribeMessage('send_offer')
  handleOffer(@MessageBody() data: { roomName: string; offer: RTCSessionDescriptionInit }, @ConnectedSocket() client: Socket) {
    client.to(data.roomName).emit('send_connection_offer', data.offer);
  }

  @SubscribeMessage('send_answer')
  handleAnswer(@MessageBody() data: { roomName: string; answer: RTCSessionDescriptionInit }, @ConnectedSocket() client: Socket) {
    client.to(data.roomName).emit('answer', data.answer);
  }

  @SubscribeMessage('send_candidate')
  handleCandidate(@MessageBody() data: { roomName: string; candidate: RTCIceCandidate }, @ConnectedSocket() client: Socket) {
    client.to(data.roomName).emit('send_candidate', data.candidate);
  }
}
