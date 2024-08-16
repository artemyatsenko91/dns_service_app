import express, { Request, Response } from "express";
import { eventEmitter } from "../services/AppEventEmmiter";

const routes = express.Router();

const testRouter = (req: Request, res: Response) => {
    const ip =
        req.headers["x-forwarded-for"] || req.socket.remoteAddress || req.ip;
    const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
    const data: any = {
        ip,
        method: req.method,
        fullUrl,
    };

    if (req.method === "POST" && req.body) {
        data.body = req.body;
    }

    eventEmitter.emit("eventName", data);

    res.send({
        success: true,
    });
};

routes.get("/", testRouter);
routes.post("/", testRouter);

export default routes;
