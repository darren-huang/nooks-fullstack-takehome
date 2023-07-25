import { useEffect, useState } from "react";
import VideoPlayer from "../components/VideoPlayer";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, TextField, Tooltip } from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const getVideoUrl = "/api/join-session/get-video-url?";

interface urlData {
  url: string;
}

const WatchSession: React.FC = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [url, setUrl] = useState<string | null>(null);

  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    function error(msg: string) {
      console.log(msg);
      navigate("/");
    }

    if (sessionId === undefined) {
      error("no sessionId");
      return;
    }

    const url = getVideoUrl + new URLSearchParams({ sessionId: sessionId.toString() });
    fetch(url)
      .then((res: Response) => {
        if (!res.ok) error(`Bad response stats: ${res.status}`);
        else return res.json();
      })
      .then((data: urlData) => {
        console.log(`received response: ${JSON.stringify(data)}`);
        if (data.url) setUrl(data.url);
        else error("no url found");
      })
      .catch((reason: any) => {
        error(reason);
      });
  }, [sessionId, navigate]);

  if (!!url) {
    return (
      <>
        <Box
          width="100%"
          maxWidth={1000}
          display="flex"
          gap={1}
          marginTop={1}
          alignItems="center"
        >
          <TextField
            label="Youtube URL"
            variant="outlined"
            value={url}
            inputProps={{
              readOnly: true,
              disabled: true,
            }}
            fullWidth
          />
          <Tooltip title={linkCopied ? "Link copied" : "Copy link to share"}>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setLinkCopied(true);
                setTimeout(() => setLinkCopied(false), 2000);
              }}
              disabled={linkCopied}
              variant="contained"
              sx={{ whiteSpace: "nowrap", minWidth: "max-content" }}
            >
              <LinkIcon />
            </Button>
          </Tooltip>
          <Tooltip title="Create new watch party">
            <Button
              onClick={() => {
                navigate("/create");
              }}
              variant="contained"
              sx={{ whiteSpace: "nowrap", minWidth: "max-content" }}
            >
              <AddCircleOutlineIcon />
            </Button>
          </Tooltip>
        </Box>
        <VideoPlayer url={url} sessionId={sessionId as string} />
      </>
    );
  }

  return null;
};

export default WatchSession;
