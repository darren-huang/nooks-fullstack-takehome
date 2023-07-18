import { v4 as uuidv4 } from "uuid";

interface user {
    ip: string;
    //socket?
}

class Session {
    sessionId: string;
    vidUrl: string;
    paused: boolean = true;
    lastEventTime: number;
    lastVideoTime: number = 0;
    users: Array<user> = [];

    constructor(sessionId: string, vidUrl: string) {
        this.sessionId = sessionId;
        this.vidUrl = vidUrl;
        this.lastEventTime = Date.now();
    }
}

interface sessionsMap {
    [key: string]: Session;
}

class Sessions {
    sessions: sessionsMap;

    constructor() {
        this.sessions = {};
    }

    /**
     * Creates a session.
     * @param vidUrl   url for the video
     * @return         returns the session id of the new session
     */
    createSession(vidUrl: string): string {
        const sessionId = uuidv4();
        // TODO: store session data inside MongoDB
        this.sessions[sessionId] = new Session(sessionId, vidUrl);
        return sessionId;
    }
}

export default new Sessions();