import { Server } from "@nookstakehome/backend";
import express from "express";
const app = express();

const port = 3000;

const server = new Server(app, "/frontend/build");
server.start(port);
