import { Context } from "telegraf";
import { Bot } from "../bot";
import { Command } from "./BotCommand";
import { eventEmitter } from "../../services/AppEventEmmiter";

export class UnknownCommand extends Command {
    constructor(
        bot: Bot,
        private readonly chatId: string,
    ) {
        super(bot);
    }

    async getCommands() {
        // eslint-disable-next-line no-useless-catch
        try {
            const commands = await this.bot.bot.telegram.getMyCommands();
            return commands;
        } catch (error) {
            throw error;
        }
    }

    getCommandInfo() {
        return null;
    }

    handle(): void {
        this.bot.bot.hears(/.*/, async (ctx: Context) => {
            console.log(ctx.chat?.id);
        });
        eventEmitter.on("eventName", (data) => {
            this.bot.bot.telegram.sendMessage(this.chatId, `ip: ${data.ip}`);
        });
    }
}
