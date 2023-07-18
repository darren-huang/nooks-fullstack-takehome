import { Express, Request, Response } from "express";
import express from 'express';
import path from 'path';
import apiRouter from './routes/api.js';
import mongoose from 'mongoose';

export class Server {

    private app: Express;

    constructor(app: Express) {
        // // setup mongoose
        // mongoose.set("strictQuery", false);
        // const mongoDB = "mongodb://localhost/27017";
        // async function main() {
        //     await mongoose.connect(mongoDB);
        // }
        // main().catch((err) => console.log(err));

        // setup express
        this.app = app;
        this.app.use(express.json());

        // routes
        this.app.use("/api", apiRouter);

        // default rest of routes to React frontend
        this.app.use(express.static(path.resolve("./") + "/build/frontend"));
        this.app.get("*", (req: Request, res: Response): void => {
            res.sendFile(path.resolve("./") + "/build/frontend/index.html");
        });
    }

    public start(port: number): void {
        this.app.listen(port, () => console.log(`Server listening on port ${port}!`));
    }

}