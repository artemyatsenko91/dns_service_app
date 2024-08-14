import { Telegraf } from "telegraf";
import { LoggerService } from "../services/LoggerService";
import { IConfigService } from "../services/ConfigService/IConfigService";
import { UnknownCommand } from "./commands/UnknownCommand";
import { Command, CommandInfo } from "./commands/BotCommand";

interface Commands {
    unknown: UnknownCommand;
}

export class Bot {
    public bot: Telegraf;
    public commands;

    // public commands: Commands = {
    //     start: new StartCommand(this),
    //     about: new AboutCommand(this),
    //     links: new LinksCommand(this),
    //     help: new HelpCommand(this),
    //     language: new LanguageCommand(this),
    //     unknown: new UnknownCommand(this),
    // };
    public commandsInitialized: boolean = false;
    public logger: LoggerService;

    constructor(private readonly configService: IConfigService) {
        this.bot = new Telegraf(this.configService.get("TELEGRAM_TOKEN"));
        this.logger = new LoggerService();
        this.commands = {
            unknown: new UnknownCommand(
                this,
                this.configService.get("TELEGRAM_CHAT_ID"),
            ),
        };
    }

    public setupCommands() {
        const commandsInfos = this.getCommandsInfos();
        this.bot.telegram.setMyCommands(commandsInfos);
    }

    public getCommandsInfos(): CommandInfo[] {
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
        this.initCommands();
        this.bot.launch();
        this.logger.info("Bot was running");
    }
}
