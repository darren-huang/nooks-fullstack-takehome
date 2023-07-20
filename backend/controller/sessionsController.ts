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
            const timeElapsed = Math.abs(Date.now() - session.lastActionTime) / 1000;
            console.log(`join: sess info: ${session.actionVidTime}, elapsed: ${timeElapsed}`);
            return {
                lastAction: session.lastAction,
                paused: session.paused,
                vidTime: session.actionVidTime,
                timeElapsed: timeElapsed
            };
        };
    }

    getSession(sessionId: string): Session | undefined {
        const session = this.sessions.get(sessionId);
        if (session) return session;
    }
}

export default new Sessions();