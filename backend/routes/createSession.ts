import express, { Request, Response } from "express";
import sessions from '../controller/sessions.js';

const router = express.Router();

/* GET home page. */
router.post("/", (req: Request, res: Response): void => {
    const sessionId = sessions.createSession(req.body.url);
    console.log(`sessionId: ${sessionId}, body: ${JSON.stringify(req.body)}`);
    res.send({ "sessionId": sessionId });
});

export default router;
