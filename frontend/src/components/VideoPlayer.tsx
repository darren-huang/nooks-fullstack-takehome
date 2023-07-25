import { Box, Button } from "@mui/material";
import React, { useRef, useState } from "react";
import ReactPlayer from "react-player";
import { useEffect } from "react";
import { sioEvent } from "@nookstakehome/common";
import { socket } from "./socket";
import { v4 as uuidv4 } from "uuid";

const timeout = 1000;
const timeThreshold = 0.1; // less than this amount of seconds off is considered equal

interface VideoPlayerProps {
  url: string;
  sessionId: string;
  hideControls?: boolean;
}

interface videoState {
  currAction: string;
  paused: boolean;
  actionVidTime: number;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, sessionId, hideControls }) => {
  const [hasJoined, setHasJoined] = useState(false);
  const [isReady, setIsReady] = useState(false);
  let lastServerAction = ""; // TODO something
  const [videoState, setVideoState] = useState<videoState>({
    currAction: "",
    paused: true,
    actionVidTime: 0,
  });
  const player = useRef<ReactPlayer>(null);

  function updateVideoState(
    action: string,
    pause: boolean,
    vidTime: number,
    elapsedTime: number,
    preventSeek: boolean = false
  ): void {
    console.log(
      `vid update - a:${action} p:${pause} vt:${vidTime} et:${elapsedTime} ps:${preventSeek}`
    );

    // add elapsed time for playing video
    if (!pause) vidTime += elapsedTime; // TODO adjust with Ping call?

    setVideoState({
      // update current video state
      currAction: action,
      paused: pause,
      actionVidTime: vidTime,
    });

    // if we can't retrieve the old video time OR if time changed, seek to new time
    const oldVidTime = player.current?.getCurrentTime();
    if (
      !preventSeek &&
      (!oldVidTime || Math.abs(vidTime - oldVidTime) > timeThreshold)
    ) {
      console.log(`seeking: vt: ${vidTime}, ot: ${oldVidTime}`);
      player.current?.seekTo(vidTime);
    }
  }

  /**
   * Emits a join message on the socket, and listens for success
   * - after success, will update current video state to match server's session
   * @returns a promise that is resolved once the current video state is updated
   */
  async function joinSession(): Promise<void> {
    let joined = false;

    function handleSucess(
      resolve: CallableFunction,
      serverAction: string,
      pause: boolean,
      vidTime: number,
      elapsedTime: number
    ): void {
      // update current state
      lastServerAction = serverAction;
      updateVideoState(serverAction, pause, vidTime, elapsedTime);
      joined = true;

      // wrap up success handler
      socket.off(sioEvent.JOIN_SUCCESS, handleSucess);
      resolve(null);
    }

    function joinSessionHelper() {
      if (joined) return;
      socket.emit(sioEvent.JOIN, sessionId);
      setTimeout(joinSessionHelper.bind(null), timeout); // TODO add some visual indicator
    }

    return new Promise<void>((resolve) => {
      socket.on(sioEvent.JOIN_SUCCESS, handleSucess.bind(null, resolve));
      joinSessionHelper();
    });
  }

  /**
   * Sets the current video to the current video time and emits the state to the server
   * @param currVidTime: current time of the player
   * @param paused: whether or not the video is paused
   */
  function emitAction(currVidTime: number, paused: boolean): void {
    const newAction = uuidv4();
    updateVideoState(newAction, paused, currVidTime, 0, true);

    console.log(`action: emitting action ${[newAction, paused, currVidTime]}`);
    socket.emit(sioEvent.ACT, sessionId, newAction, paused, currVidTime);
  }

  // Setup Sockets
  useEffect(() => {
    console.log(`Setting up socket to ${window.location.href}`);
    console.log("CAN YOU SEE THIS");
    socket.connect();
    socket.on(sioEvent.PROP_ACT, updateVideoState);

    return () => {
      socket.disconnect();
      console.log("DISCONNECTING");
    };
  }, []);

  const handleReady = () => {
    setIsReady(true);
  };

  const handleEnd = () => {
    console.log("Video ended");
  };

  const handleSeek = (seconds: number) => {
    // Ideally, the seek event would be fired whenever the user moves the built in Youtube video slider to a new timestamp.
    // However, the youtube API no longer supports seek events (https://github.com/cookpete/react-player/issues/356), so this no longer works

    // You'll need to find a different way to detect seeks (or just write your own seek slider and replace the built in Youtube one.)
    // Note that when you move the slider, you still get play, pause, buffer, and progress events, can you use those?

    console.log("This never prints because seek decetion doesn't work: ", seconds);
  };

  const handlePlay = () => {
    console.log("play");
    if (videoState.paused && player.current) {
      emitAction(player.current.getCurrentTime(), false);
    } else {
      console.log(`ERROR: paused: ${videoState.paused}, player: ${player.current}`);
    }
  };

  const handlePause = () => {
    console.log("pause");
    if (player.current) {
      emitAction(player.current.getCurrentTime(), true);
    } else {
      console.log("ERROR: can't get player");
    }
  };

  const handleBuffer = () => {
    console.log("Video buffered");
  };

  const handleProgress = (state: {
    played: number;
    playedSeconds: number;
    loaded: number;
    loadedSeconds: number;
  }) => {
    console.log("Video progress: ", state);
  };

  const handleClick = () => {
    console.log(`conn ack: joining session '${sessionId}'`);
    joinSession().then(() => {
      setHasJoined(true);
    });
  };

  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      <Box
        width="100%"
        height="100%"
        display={hasJoined ? "flex" : "none"}
        flexDirection="column"
      >
        <ReactPlayer
          ref={player}
          url={url}
          playing={hasJoined && !videoState.paused}
          controls={!hideControls}
          onReady={handleReady}
          onEnded={handleEnd}
          onSeek={handleSeek}
          onPlay={handlePlay}
          onPause={handlePause}
          onBuffer={handleBuffer}
          onProgress={handleProgress}
          width="100%"
          height="100%"
          style={{ pointerEvents: hideControls ? "none" : "auto" }}
        />
      </Box>
      {!hasJoined && isReady && (
        // Youtube doesn't allow autoplay unless you've interacted with the page already
        // So we make the user click "Join Session" button and then start playing the video immediately after
        // This is necessary so that when people join a session, they can seek to the same timestamp and start watching the video with everyone else
        <Button variant="contained" size="large" onClick={handleClick}>
          Watch Session
        </Button>
      )}
    </Box>
  );
};

export default VideoPlayer;
