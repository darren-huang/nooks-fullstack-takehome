import { v4 as uuidv4 } from "uuid";

interface sessionState {
  lastAction: string;
  paused: boolean;
  vidTime: number;
  timeElapsed: number;
}

export class Session {
  sessionId: string;
  vidUrl: string;
  lastAction: string;
  paused: boolean = true;
  lastActionTime: number;
  actionVidTime: number = 0;
  numUsers: number = 0;

  constructor(sessionId: string, vidUrl: string) {
    this.sessionId = sessionId;
    this.vidUrl = vidUrl;
    this.lastAction = "";
    this.lastActionTime = Date.now();
  }

  setState(action: string, paused: boolean, vidTime: number): void {
    this.lastAction = action;
    this.paused = paused;
    this.actionVidTime = vidTime;
    this.lastActionTime = Date.now(); // TODO might want to call earlier for a more accurate time?
    // TODO adjust with a Ping call?
  }

  getState() {
    const timeElapsed = Math.abs(Date.now() - this.lastActionTime) / 1000;
    return {
      lastAction: this.lastAction,
      paused: this.paused,
      vidTime: this.actionVidTime,
      timeElapsed: timeElapsed,
    };
  }

  getNumUsers(): number {
    return this.numUsers;
  }

  setNumUsers(users: number): void {
    this.numUsers = users;
  }
}

class Sessions {
  sessions: Map<string, Session>;

  constructor() {
    this.sessions = new Map();
  }

  /**
   * Creates a session.
   * @param vidUrl   url for the video
   * @return         returns the session id of the new session
   */
  createSession(vidUrl: string): string {
    const sessionId = uuidv4();
    // TODO: store session data inside MongoDB
    this.sessions.set(sessionId, new Session(sessionId, vidUrl));
    return sessionId;
  }

  getVideoUrl(sessionId: string): string | undefined {
    if (this.sessions.has(sessionId)) {
      return this.sessions.get(sessionId)?.vidUrl;
    }
  }

  getSessionState(sessionId: string): sessionState | undefined {
    // console.log(this.sessions);
    const session = this.sessions.get(sessionId);
    if (session) {
      return session.getState();
    }
  }

  getSession(sessionId: string): Session | undefined {
    const session = this.sessions.get(sessionId);
    if (session) return session;
  }

  decrementSession(sessionId: string | undefined): void {
    if (!sessionId) return;

    const session = this.sessions.get(sessionId);
    if (session) {
      session.setNumUsers(session.getNumUsers() - 1);
      console.log(`user left session: ${sessionId}: ${session.getNumUsers()} users`);
      if (session.getNumUsers() == 0) {
        // clean up empty session
        console.log(`0 users left, removing session '${sessionId}'`);
        this.sessions.delete(sessionId);
      }
    }
  }

  incrementSession(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.setNumUsers(session.getNumUsers() + 1);
      console.log(`user joined session: ${sessionId}: ${session.getNumUsers()} users`);
    }
  }
}

export default new Sessions();
