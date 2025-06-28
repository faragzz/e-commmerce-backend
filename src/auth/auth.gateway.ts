import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

type Status = 'Verified' | 'NotVerified';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class EmailVerificationGateway {
    @WebSocketServer()
    server: Server;

    @SubscribeMessage('join-user-email-verification')
    handleJoinUserEmailVerification(
        @MessageBody() userId: string,
        @ConnectedSocket() client: Socket,
    ) {
        client.join(userId);
        console.log(`Client joined email verification room: ${userId}`);
    }

    sendVerificationStatusUpdate(
        userId: string,
        isVerified: boolean
    ): void {
        const status: Status = isVerified ? 'Verified' : 'NotVerified';
        this.server.to(userId).emit('email-status-update', { status });
    }
}