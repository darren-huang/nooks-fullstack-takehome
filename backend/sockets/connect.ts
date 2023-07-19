import { Server as SocketServer, Socket } from 'socket.io';
import sioEvent from 'common';

export default function setupSocket(io: SocketServer): void {
    io.on(sioEvent.CON, (socket: Socket) => {
        console.log(`new socket connection: id: ${socket.id}, nsp: ${socket.nsp.name}`);
        socket.emit(sioEvent.CON, null);

        socket.on(sioEvent.DCON, () => {
            console.log(`new socket disconnection: id: ${socket.id}, nsp: ${socket.nsp.name}`);
        });
    });
}