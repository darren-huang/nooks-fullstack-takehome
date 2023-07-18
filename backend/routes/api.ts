import express, { Request, Response } from "express";
import createSessionRouter from "./createSession.js";
import joinSessionRouter from "./joinSession.js";

const router = express.Router();

// default
router.get("/", (req: Request, res: Response): void => {
    res.send("You've hit the api!");
});

router.use("/create-session", createSessionRouter);
router.use("/join-session", joinSessionRouter);

router.get("*", (req: Request, res: Response): void => {
    console.log(`invalid api get:${req.url}`);
    res.redirect("/");
});

export default router;
