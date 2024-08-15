import express from "express";
import cors from "cors";

import { Bot } from "./bot/bot";
import { ConfigService } from "./services/ConfigService/ConfigService";
import { LoggerService } from "./services/LoggerService/LoggerService";

import testRoutes from "./routes/testRoutes";
import { CloudflareService } from "./services/CloudflareService/CloudflareService";
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

app.use(cors());
app.use(express.json());

app.use("/test", testRoutes);

app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
    bot.init();
});
