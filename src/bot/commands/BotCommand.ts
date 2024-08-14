import { Bot } from "../bot";

export interface CommandInfo {
    command: string;
    description: string;
}

export abstract class Command {
    constructor(public bot: Bot) {}
    abstract handle(): void;
    abstract getCommandInfo(): CommandInfo | null;
}
