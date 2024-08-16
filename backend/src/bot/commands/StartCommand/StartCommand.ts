import { Markup, Context } from "telegraf";

import { Command } from "../BotCommand";
import { Bot, BotContext } from "../../bot";
import { startMessage } from "./view/templates";

export class StartCommand extends Command {
    constructor(bot: Bot) {
        super(bot);
    }

    public sendWelcomeMessage(context: BotContext): void {
        const { text, buttons } = startMessage();
        context.replyWithHTML(text, buttons);
    }

    public getCommandInfo() {
        return {
            command: "/start",
            description: "Запуск бота",
        };
    }

    handle(): void {
        this.bot.bot.start((context) => {
            this.sendWelcomeMessage(context);
        });
    }
}
