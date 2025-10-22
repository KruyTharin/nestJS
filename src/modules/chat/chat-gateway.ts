import { Logger } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import {} from '@nestjs/platform-socket.io';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(4000, {})
export class ChatGateway {
  logger = new Logger(ChatGateway.name);
  @WebSocketServer() sever: Server;

  @SubscribeMessage('newMessage')
  handleEvent(client: Socket, message: any) {
    this.logger.error(message);
    client.emit('Hello back!'); // can only use for single client
    this.sever.emit('reply', 'reply back from sever');
  }
}
