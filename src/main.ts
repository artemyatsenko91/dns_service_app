import express from "express";
import cors from "cors";

import { Bot } from "./bot/bot";
import { ConfigService } from "./services/ConfigService/ConfigService";
import { LoggerService } from "./services/LoggerService";

import testRoutes from "./routes/testRoutes";

const app = express();
const PORT = process.env.PORT || 3000;
const logger = new LoggerService();
const bot = new Bot(new ConfigService());

app.use(cors());
app.use(express.json());

app.use("/test", testRoutes);

app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
    bot.init();
});
