import { Context, SessionStore, Telegraf, session } from "telegraf";
import { LoggerService } from "../services/LoggerService/LoggerService";
import { IConfigService } from "../services/ConfigService/IConfigService";
import { Command, CommandInfo } from "./commands/BotCommand";
import { RegisterDomainCommand } from "./commands/DomainCommand/DomainCommand";
import { StartCommand } from "./commands/StartCommand/StartCommand";
import { ManualInput } from "./commands/ManualInput";
import { Update } from "telegraf/typings/core/types/typegram";
import { ISessionData, State } from "./ISessionData";
import { Redis } from "@telegraf/session/redis";
import { CloudflareService } from "../services/CloudflareService/CloudflareService";

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
    chatId: 1,
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
    private store: SessionStore<ISessionData> = Redis({
        url: "redis://127.0.0.1:6379",
    });
    public cloudFlareService: CloudflareService;

    constructor(
        private readonly configService: IConfigService,
        cloudflareService: CloudflareService,
    ) {
        this.bot = new Telegraf(this.configService.get("TELEGRAM_TOKEN"));
        this.logger = new LoggerService();
        this.cloudFlareService = cloudflareService;
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

    private initCommands() {
        Object.keys(this.commands).forEach((commandStr) => {
            const commandKey = commandStr as keyof Commands;
            const command = this.commands[commandKey] as Command;
            command.handle();
        });
    }

    init() {
        this.bot.use(
            session({
                store: this.store,
                defaultSession(ctx) {
                    return sessionData;
                },
            }),
        );
        this.initCommands();
        this.setupCommands();
        this.bot.launch();
        this.logger.info("Bot was running");
    }
}
