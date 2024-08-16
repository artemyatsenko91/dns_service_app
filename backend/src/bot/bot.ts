import { Redis } from "@telegraf/session/redis";
import { Context, Telegraf, session } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";

import { eventEmitter } from "../services/AppEventEmmiter";
import { CloudflareService } from "../services/CloudflareService/CloudflareService";
import { IConfigService } from "../services/ConfigService/IConfigService";
import { LoggerService } from "../services/LoggerService/LoggerService";
import { Command, CommandInfo } from "./commands/BotCommand";
import { RegisterDomainCommand } from "./commands/DomainCommand/DomainCommand";
import { ManualInput } from "./commands/ManualInput";
import { StartCommand } from "./commands/StartCommand/StartCommand";
import { ISessionData, State } from "./ISessionData";
import { UserSchema } from "../models/users";

interface Commands {
    start: StartCommand;
    registerDomain: RegisterDomainCommand;
    manual: ManualInput;
}

export interface BotContext extends Context<Update> {
    session?: ISessionData;
}

const sessionData: ISessionData = {
    state: State.NEUTRAL,
    domainZoneId: "",
    ip: "",
    dnsRecordToEdit: {
        comment: "",
        content: "",
        name: "",
        proxied: false,
        type: "",
        id: "",
    },
    editedDnsRecord: {},
};

export class Bot {
    public bot: Telegraf;
    public logger: LoggerService;
    private store: any;
    public cloudFlareService: CloudflareService;

    constructor(
        private readonly configService: IConfigService,
        cloudflareService: CloudflareService,
    ) {
        this.bot = new Telegraf(this.configService.get("TELEGRAM_TOKEN"));
        this.logger = new LoggerService();
        this.cloudFlareService = cloudflareService;
        this.store = Redis<ISessionData>({
            url: `redis://${this.configService.get("REDIS_URL")}:${this.configService.get("REDIS_PORT")}`,
        });
    }

    public commands: Commands = {
        start: new StartCommand(this),
        registerDomain: new RegisterDomainCommand(this),
        manual: new ManualInput(this),
    };

    setupCommands() {
        const commandsInfos = this.getCommandsInfos();
        this.bot.telegram.setMyCommands(commandsInfos);
    }

    getCommandsInfos(): CommandInfo[] {
        return Object.keys(this.commands)
            .map((commandStr) => {
                const commandKey = commandStr as keyof Commands;
                const command = this.commands[commandKey] as Command;
                return command.getCommandInfo();
            })
            .filter((cmd) => cmd !== null) as CommandInfo[];
    }

    sendMessageAboutRequestFromServer() {
        eventEmitter.on("eventName", (data) => {
            let view =
                `🌍IP: ${data.ip}\n` +
                `Запрос з сайта: ${data.fullUrl}\n` +
                `Метод запросу: ${data.method}\n`;
            data.body && data.body.message
                ? (view += `Тіло запиту: ${data.body.message}`)
                : "";

            this.bot.telegram.sendMessage(
                this.configService.get("TELEGRAM_CHAT_ID"),
                view,
            );
        });
    }

    private initCommands() {
        Object.keys(this.commands).forEach((commandStr) => {
            const commandKey = commandStr as keyof Commands;
            const command = this.commands[commandKey] as Command;
            command.handle();
        });
    }

    private checkUserAccess = async (
        ctx: BotContext,
        next: () => Promise<void>,
    ) => {
        if (ctx.from && ctx.from.username) {
            const userName = ctx.from.username;

            try {
                const user = await UserSchema.findOne({
                    telegram_user_name: `@${userName}`,
                });

                if (!user) {
                    // Отправляем сообщение об отказе в доступе
                    await ctx.reply(
                        "Извините, но у вас нет доступа к этому боту.",
                    );
                    // Прерываем выполнение дальнейших команд
                    return;
                }
            } catch (error) {
                console.error("Ошибка при проверке пользователя:", error);
                // Если ошибка при доступе к базе данных, также прерываем выполнение
                await ctx.reply("Произошла ошибка при проверке доступа.");
                return;
            }
        }

        // Если пользователь найден или username не указан, продолжаем выполнение команд
        await next();
    };

    init() {
        this.bot.use(
            session({
                store: this.store,
                defaultSession(ctx) {
                    return sessionData;
                },
            }),
        );
        this.bot.use(this.checkUserAccess);
        this.initCommands();
        this.setupCommands();
        this.bot.launch();
        this.sendMessageAboutRequestFromServer();
        this.logger.info("Bot was running");
    }
}
