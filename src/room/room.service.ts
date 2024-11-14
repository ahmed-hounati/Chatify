import { Injectable } from '@nestjs/common';

@Injectable()
export class RoomService {
    public rooms: Map<string, Set<string>> = new Map();

    joinRoom(roomName: string, clientId: string) {
        if (!this.rooms.has(roomName)) {
            this.rooms.set(roomName, new Set());
        }
        this.rooms.get(roomName).add(clientId);
    }

    leaveRoom(roomName: string, clientId: string) {
        const room = this.rooms.get(roomName);
        if (room) {
            room.delete(clientId);
            if (room.size === 0) {
                this.rooms.delete(roomName);
            }
        }
    }

    getRoomClients(roomName: string): string[] {
        return this.rooms.get(roomName) ? Array.from(this.rooms.get(roomName)) : [];
    }
}
