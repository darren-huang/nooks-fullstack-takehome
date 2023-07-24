import { Server as SocketServer, Socket } from 'socket.io';
import sioEvent from '@nookstakehome/common';
import { default as sessions, Session } from '../controller/sessionsController.js';
import { resolveModuleName } from 'typescript';

export default function setupSocket(io: SocketServer): void {
    io.on(sioEvent.CON, (socket: Socket) => {
        console.log(`con: id: ${socket.id}, nsp: ${socket.nsp.name}`);
        socket.emit(sioEvent.CON, null);

        socket.on(sioEvent.DCON, () => {
            console.log(`dcon: id: ${socket.id}, nsp: ${socket.nsp.name}`);
        });

        socket.on(sioEvent.JOIN, (sessionId: string) => {
            const sessionState = sessions.getSessionState(sessionId);
            if (sessionState) {
                socket.join(sessionId);
                console.log(`join: ${socket.id.slice(0, 5)} joined ${sessionId}`);
                socket.emit(
                    sioEvent.JOIN_SUCCESS,
                    sessionState.lastAction,
                    sessionState.paused,
                    sessionState.vidTime,
                    sessionState.timeElapsed
                );
            } else {
                console.log(`join: ERROR: session not found for ${sessionId}`);
            }
        });

        socket.on(sioEvent.ACT, (sessionId: string, currAct: string, paused: boolean, vidTime: number) => {
            const session = sessions.getSession(sessionId);
            if (session) {
                console.log(`act: sess: ${sessionId} act: ${currAct} paused: ${paused} vidTime: ${vidTime}`);
                session.setState(currAct, paused, vidTime);
                // socket.emit(sioEvent.JOIN_SUCCESS, sessionState.lastAction, sessionState.paused, sessionState.vidTime);
            } else {
                console.log(`join: ERROR: session not found for ${sessionId}`);
            }
        });
    });
}