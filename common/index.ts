import { default as sioEvent2 } from './sioEvent.js';

const sioEvent = {
    CON: "connection",
    DCON: "disconnect",
    JOIN: "join-session",
    JOIN_SUCCESS: "join-session-success",
    ACT: "action-on-video",
    ACT_SUCCESS: "action-on-video-success"
};

export default sioEvent;