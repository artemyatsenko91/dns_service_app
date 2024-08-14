import express, { Request, Response } from "express";
import { eventEmitter } from "../services/AppEventEmmiter";

const routes = express.Router();

const testRouter = (req: Request, res: Response) => {
    const ip =
        req.headers["x-forwarded-for"] || req.socket.remoteAddress || req.ip;

    eventEmitter.emit("eventName", { ip });

    res.send({
        success: true,
    });
};

routes.get("/", testRouter);

export default routes;
