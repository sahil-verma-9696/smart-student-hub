import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationService } from './notification.service';
import { Inject, forwardRef } from '@nestjs/common';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  // 🔥 maps to track connections
  private userSockets = new Map<string, Set<string>>(); // userId -> socketIds
  private socketUser = new Map<string, string>(); // socketId -> userId

  constructor(
    @Inject(forwardRef(() => NotificationService))
    private notificationService: NotificationService,
  ) {}

  async handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (!userId) return client.disconnect();

    const socketId = client.id;

    // store socketId -> userId
    this.socketUser.set(socketId, userId);

    // store userId -> multiple socketIds
    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set());
    }
    this.userSockets.get(userId)!.add(socketId);

    await client.join(userId); // private room (optional)

    console.log(`User connected: ${userId}, socket: ${socketId}`);
  }

  handleDisconnect(client: Socket) {
    const socketId = client.id;
    const userId = this.socketUser.get(socketId);

    if (userId) {
      const sockets = this.userSockets.get(userId);
      if (sockets) {
        sockets.delete(socketId);

        if (sockets.size === 0) {
          this.userSockets.delete(userId);
        }
      }
      this.socketUser.delete(socketId);
    }

    console.log(`Disconnected socket: ${socketId}, user: ${userId}`);
  }

  // testing
  @SubscribeMessage('ping')
  handleTest(client: Socket) {
    client.emit('pong', { message: 'Working fine!' });
  }

  // 🔥 send notification to ALL active devices of a user
  sendToUser(userId: string, payload: any) {
    const sockets = this.userSockets.get(userId);

    if (!sockets || sockets.size === 0) {
      console.log(`User ${userId} is offline.`);
      return;
    }

    for (const socketId of sockets) {
      this.server.to(socketId).emit('notification', payload);
    }
  }
}
