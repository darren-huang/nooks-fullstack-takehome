import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, TextField } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { response } from "express";

interface sessData {
  sessionId: string;
}

const postUrl = "/api/create-session";

function createPostRequest(vidUrl: string): Object {
  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: vidUrl })
  };
}


const CreateSession: React.FC = () => {
  const navigate = useNavigate();
  const [newUrl, setNewUrl] = useState("");

  const handleCreateSession = async () => {
    //TODO: validate youtube url is valid

    fetch(postUrl, createPostRequest(newUrl))
      .then((res: Response) => {
        if (!res.ok) throw new Error(res.status.toString());
        else return res.json();
      })
      .then((data: sessData) => {
        console.log(`received response: ${JSON.stringify(data)}`);

        //TODO: validate sessionId is in response
        setNewUrl("");
        navigate(`/watch/${data.sessionId}`);
      });
  };

  return (
    <Box width="100%" maxWidth={600} display="flex" gap={1} marginTop={1}>
      <TextField
        label="Youtube URL"
        variant="outlined"
        value={newUrl}
        onChange={(e) => setNewUrl(e.target.value)}
        fullWidth
      />
      <Button
        disabled={!newUrl}
        onClick={handleCreateSession}
        size="small"
        variant="contained"
      >
        Create a session
      </Button>
    </Box>
  );
};

export default CreateSession;
