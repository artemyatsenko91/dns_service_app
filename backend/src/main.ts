import express from "express";
import cors from "cors";

import { Bot } from "./bot/bot";
import { ConfigService } from "./services/ConfigService/ConfigService";
import { LoggerService } from "./services/LoggerService/LoggerService";

import testRoutes from "./routes/testRoutes";
import userCreateRouter from "./routes/userCreateRoute";
import { CloudflareService } from "./services/CloudflareService/CloudflareService";
import mongoose from "mongoose";
const configService = new ConfigService();

const app = express();
const PORT = process.env.PORT || 3000;
const logger = new LoggerService();
const bot = new Bot(
    configService,
    new CloudflareService(
        configService.get("CLOUDFLARE_API_KEY"),
        configService.get("CLOUDFLARE_GLOBAL_API_TOKEN"),
        configService.get("CLOUDFLARE_EMAIL"),
    ),
);

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_CLUSTER_NAME = process.env.DB_CLUSTER_NAME;
const DB_NAME = process.env.DB_NAME;

const URL = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_CLUSTER_NAME}.1i22sgg.mongodb.net/?retryWrites=true&w=majority&appName=${DB_NAME}`;

mongoose
    .connect(URL)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log(`DB connection error: ${err}`));

app.use(cors());
app.use(express.json());

app.use("/test", testRoutes);
app.use("/user-create", userCreateRouter);

app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
    bot.init();
});
