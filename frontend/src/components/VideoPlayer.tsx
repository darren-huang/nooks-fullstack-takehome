import { Box, Button } from "@mui/material";
import React, { useRef, useState } from "react";
import ReactPlayer from "react-player";
import { useEffect } from "react";
import sioEvent from '@nookstakehome/common';
import { socket } from './socket';
import { Socket } from 'socket.io-client';

const timeout = 1000;

interface VideoPlayerProps {
  url: string;
  sessionId: string;
  hideControls?: boolean;
}

interface videoState {
  serverAction: string;
  currAction: string;
  paused: boolean;
  actionVidTime: number;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, sessionId, hideControls }) => {
  const [hasJoined, setHasJoined] = useState(false);
  const [isReady, setIsReady] = useState(false);
  let videoState: videoState;
  const player = useRef<ReactPlayer>(null);

  function joinSession(socket: Socket) {
    if (videoState) return;
    socket.emit(sioEvent.JOIN, sessionId);
    setTimeout(joinSession.bind(null, socket), timeout);
  }

  // Setup Sockets
  useEffect(() => {
    console.log(`Setting up socket to ${window.location.href}`);
    socket.connect();

    socket.on(sioEvent.CON, () => {
      console.log(`conn ack: joining session '${sessionId}'`);
      joinSession(socket);
    });

    socket.on(sioEvent.JOIN_SUCCESS, (serverAction: string, pause: boolean, vidTime: number) => {
      console.log(`join ack: ${serverAction} ${pause.toString()} ${vidTime.toString()}`);
      videoState = {
        serverAction: serverAction,
        currAction: serverAction,
        paused: pause,
        actionVidTime: vidTime,
      };
    });

    return () => {
      socket.disconnect();
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

    console.log(
      "This never prints because seek decetion doesn't work: ",
      seconds
    );
  };

  const handlePlay = () => {
    console.log(
      "User played video at time: ",
      player.current?.getCurrentTime()
    );
  };

  const handlePause = () => {
    console.log(
      "User paused video at time: ",
      player.current?.getCurrentTime()
    );
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
          playing={hasJoined}
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
        <Button
          variant="contained"
          size="large"
          onClick={() => setHasJoined(true)}
        >
          Watch Session
        </Button>
      )}
    </Box>
  );
};

export default VideoPlayer;
