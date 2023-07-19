import { Server as SocketServer } from 'socket.io';
import sioEvent from 'common';

export default function setupSocket(io: SocketServer): void {
    io.on(sioEvent.CON, (socket) => {
        console.log(`new socket connection: id: ${socket.id}, nsp: ${socket.nsp.name}`);
        socket.emit(sioEvent.CON, null);
    });
    io.on(sioEvent.DCON, (socket) => {
        console.log(`new socket disconnection: id: ${socket.id}, nsp: ${socket.nsp.name}`);
    });
}