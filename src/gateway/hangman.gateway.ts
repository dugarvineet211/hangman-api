import {
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class HangmanGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  constructor() {}

  handleConnection(client: Socket) {
    console.log('New client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('joinRoom')
  onJoinRoom(client: Socket, message) {
    client.join(message.roomHash);
    this.server.to(message.roomHash).emit('userJoined', {
      message: `${message.username} has joined the game!`,
    });
  }

  @SubscribeMessage('leaveRoom')
  onLeaveRoom(message) {
    // if (client.in(message.roomHash)) {
    //   client.leave(message.roomHash);
    // }
  }
}
