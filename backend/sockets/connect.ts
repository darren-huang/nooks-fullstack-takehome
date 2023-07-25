import { Server as SocketServer, Socket } from "socket.io";
import { sioEvent } from "@nookstakehome/common";
import {
  default as sessions,
  Session,
} from "../controller/sessionsController.js";
import { resolveModuleName } from "typescript";

export default function setupSocket(io: SocketServer): void {
  io.on(sioEvent.CON, (socket: Socket) => {
    // ack connection & log
    console.log(`con: id: ${socket.id}, nsp: ${socket.nsp.name}`);

    // log disconnections
    socket.on(sioEvent.DCON, () => {
      console.log(`dcon: id: ${socket.id}, nsp: ${socket.nsp.name}`);
    });

    // handle joining session
    socket.on(sioEvent.JOIN, (sessionId: string) => {
      // get session state and check exists
      const sessionState = sessions.getSessionState(sessionId);
      if (!sessionState) {
        console.log(`join: ERROR: session not found for ${sessionId}`);
        return;
      }

      // set socket room & emit session state
      socket.join(sessionId);
      console.log(`join: ${socket.id.slice(0, 5)} joined ${sessionId}`);
      socket.emit(
        sioEvent.JOIN_SUCCESS,
        sessionState.lastAction,
        sessionState.paused,
        sessionState.vidTime,
        sessionState.timeElapsed,
      );
    });

    // handle socket actions
    socket.on(
      sioEvent.ACT,
      (
        sessionId: string,
        currAct: string,
        paused: boolean,
        vidTime: number,
      ) => {
        // get session and check exists
        const session = sessions.getSession(sessionId);
        if (!session) {
          console.log(`join: ERROR: session not found for ${sessionId}`);
          return;
        }

        console.log(
          `act: sess: ${sessionId} act: ${currAct} paused: ${paused} vidTime: ${vidTime}`,
        );
        console.log(`emitting prop_act to ${sessionId}`);
        socket
          .to(sessionId)
          .emit(sioEvent.PROP_ACT, currAct, paused, vidTime, 0);
        session.setState(currAct, paused, vidTime);
      },
    );
  });
}
