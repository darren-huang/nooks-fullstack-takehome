import express, { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

/* GET home page. */
router.post("/", (req: Request, res: Response): void => {
    const sessionId = uuidv4();
    console.log(`sessionId: ${sessionId}, body: ${JSON.stringify(req.body)}`);
    res.send({ "sessionId": sessionId });
});

export default router;
