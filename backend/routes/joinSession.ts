import express, { Request, Response } from "express";
import sessions from '../controller/sessionsController.js';

const router = express.Router();

/* GET home page. */
router.get("/get-video-url*", (req: Request, res: Response): void => {
    const sessionId = req.query.sessionId as string;
    const vidUrl = sessions.getVideoUrl(sessionId);
    console.log(`get-vid: sessionId: ${sessionId}, vidUrl: ${vidUrl}, queryurl: ${req.url}`);

    if (!sessionId || !vidUrl) res.sendStatus(404);
    else res.send({ "url": vidUrl });
});

export default router;
