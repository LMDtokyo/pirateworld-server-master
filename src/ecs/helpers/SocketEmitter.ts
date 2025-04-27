// src/ecs/helpers/SocketEmitter.ts

import { Server } from 'socket.io';

class SocketEmitter {
    private io: Server | null = null;

    setServer(io: Server) {
        this.io = io;
    }

    emitToRoom(room: string, event: string, data: any) {
        if (!this.io) return;
        this.io.to(room).emit(event, data);
    }

    emitToUser(userId: number, event: string, data: any) {
        if (!this.io) return;
        this.io.to(`user:${userId}`).emit(event, data);
    }
}

const socketEmitter = new SocketEmitter();
export default socketEmitter;
