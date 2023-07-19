import { Box, createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import WatchSession from "./routes/WatchSession";
import CreateSession from "./routes/CreateSession";
import io from 'socket.io-client';
import sioEvent from '@nookstakehome/common';

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const App = () => {

  useEffect(() => {
    console.log("Setting up socket");
    let socket = io(window.location.href);
    socket.on(sioEvent.CON, () => {
      console.log("connected with the back-end");
    });
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={1}
      >
        <Routes>
          <Route path="/" element={<CreateSession />} />
          <Route path="/create" element={<CreateSession />} />
          <Route path="/watch/:sessionId" element={<WatchSession />} />
        </Routes>
      </Box>
    </ThemeProvider>
  );
};

export default App;
