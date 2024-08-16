import express, { Request, Response } from "express";
import { eventEmitter } from "../services/AppEventEmmiter";
import {
    createNewUser,
    getDataFromDB,
} from "../services/UserService/UserService";

const routes = express.Router();

const userCreateRouter = async (req: Request, res: Response) => {
    const { user_name } = req.body;
    const user = await getDataFromDB(user_name);

    if (user) {
        res.status(409).send({
            message: "Такий user_name вже існує",
        });
        return;
    }

    await createNewUser(user_name);

    res.send({
        success: true,
    });
};

routes.post("/", userCreateRouter);

export default routes;
