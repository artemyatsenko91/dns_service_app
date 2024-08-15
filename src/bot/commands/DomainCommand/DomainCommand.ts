import { Bot, BotContext } from "../../bot";
import { State } from "../../ISessionData";
import { Command } from "../BotCommand";
import {
    deleteDnsRecordTemplate,
    domainCommandWithQueryTemplate,
    domainListCommandTemplate,
    editDnsRecordTemplate,
    editDnsRecordWithQueryTemplate,
} from "./view/templates";

export class RegisterDomainCommand extends Command {
    public domainCommand = "/domain";
    public registerDomainCommand = "/register_domain";
    public domainListCommand = "/domain_list";
    public createDnsRecord = "/create_dns";
    public editDnsRecord = "/edit_dns";
    public deleteDnsRecord = "/delete_dns";
    public editDnsComment = "/edit_dns_comment";
    public editDnsContent = "/edit_dns_content";
    public editDnsProxied = "/edit_dns_proxied";
    public editDnsName = "/edit_dns_name";

    constructor(bot: Bot) {
        super(bot);
    }

    getCommandInfo() {
        return {
            command: this.registerDomainCommand.slice(1),
            description: "Реєстарція нового домена на Cloudflare",
        };
    }

    handle() {
        const domainCommandWithQuery = new RegExp(`${this.domainCommand} (.+)`);
        const editDnsRecordWithQuery = new RegExp(`${this.editDnsRecord} (.+)`);
        const deleteDnsRecordWithQuery = new RegExp(
            `${this.deleteDnsRecord} (.+)`,
        );

        this.bot.bot.action(
            this.registerDomainCommand,
            (context: BotContext) => {
                context.reply(
                    "Введіть доменне ім'я котре бажаєте створити. Приклад домена example.com",
                );

                context.session = {
                    ...context.session,
                    state: State.REGISTER_DOMAIN,
                };
            },
        );

        this.bot.bot.action(this.createDnsRecord, (context: BotContext) => {
            context.reply("Введіть піддомен");

            context.session = {
                ...context.session,
                state: State.CREATE_DNS_RECORD,
            };
        });

        this.bot.bot.action(
            this.deleteDnsRecord,
            async (context: BotContext) => {
                const res = await this.bot.cloudFlareService.getInfoAboutDomain(
                    context.session?.domainZoneId!,
                );

                const { text, buttons } = deleteDnsRecordTemplate(
                    res?.result!,
                    this.deleteDnsRecord,
                );
                context.reply(text, buttons);
            },
        );

        this.bot.bot.action(this.editDnsComment, (context: BotContext) => {
            context.reply("Введіть новий коментар");

            context.session = {
                ...context.session,
                state: State.EDIT_DNS_COMMENT,
            };
        });

        this.bot.bot.action(this.editDnsContent, (context: BotContext) => {
            context.reply("Введіть нову IP адресу");

            context.session = {
                ...context.session,
                state: State.EDIT_DNS_CONTENT,
            };
        });

        this.bot.bot.action(this.editDnsProxied, (context: BotContext) => {
            context.reply("Вкажіть true або false щоб змінити Proxied");

            context.session = {
                ...context.session,
                state: State.EDIT_DNS_PROFIED,
            };
        });

        this.bot.bot.action(this.editDnsName, (context: BotContext) => {
            context.reply("Введіть нову назву піддомена");

            context.session = {
                ...context.session,
                state: State.EDIT_DNS_NAME,
            };
        });

        this.bot.bot.action(this.editDnsRecord, async (context: BotContext) => {
            const res = await this.bot.cloudFlareService.getInfoAboutDomain(
                context.session?.domainZoneId!,
            );
            const { text, buttons } = editDnsRecordTemplate(
                res?.result!,
                this.editDnsRecord,
            );
            context.reply(text, buttons);
        });

        this.bot.bot.action(
            domainCommandWithQuery,
            async (context: BotContext) => {
                const contextQuery = context.callbackQuery;
                if (contextQuery && "data" in contextQuery) {
                    const parsedContextQueryId =
                        contextQuery.data.split(" ")[1];
                    context.session = {
                        ...context.session,
                        domainZoneId: parsedContextQueryId,
                    };
                }

                const { text, buttons } = domainCommandWithQueryTemplate();

                context.reply(text, buttons);
            },
        );

        this.bot.bot.action(
            editDnsRecordWithQuery,
            async (context: BotContext) => {
                const contextQuery = context.callbackQuery;
                if (contextQuery && "data" in contextQuery) {
                    const parsedContextQueryId =
                        contextQuery.data.split(" ")[1];
                    const infoAboutDomain =
                        await this.bot.cloudFlareService.getInfoAboutDomain(
                            context.session?.domainZoneId!,
                        );
                    context.session = {
                        ...context.session,
                        dnsRecordToEdit: {
                            comment: infoAboutDomain?.result[0].comment,
                            content: infoAboutDomain?.result[0].content,
                            name: infoAboutDomain?.result[0].name,
                            proxied: infoAboutDomain?.result[0].proxied,
                            type: infoAboutDomain?.result[0].type,
                            id: parsedContextQueryId,
                        },
                    };

                    const { text, buttons } = editDnsRecordWithQueryTemplate(
                        context.session.dnsRecordToEdit!,
                        infoAboutDomain?.result[0].name as string,
                    );

                    context.reply(text, buttons);
                }
            },
        );

        this.bot.bot.action(
            deleteDnsRecordWithQuery,
            async (context: BotContext) => {
                const contextQuery = context.callbackQuery;
                if (contextQuery && "data" in contextQuery) {
                    const parsedContextQueryId =
                        contextQuery.data.split(" ")[1];

                    await this.bot.cloudFlareService.deleteDnsRecord(
                        context.session?.domainZoneId!,
                        parsedContextQueryId,
                    );

                    context.reply(`Запис успішно видалено`);
                }
            },
        );

        this.bot.bot.action(
            this.domainListCommand,
            async (context: BotContext) => {
                const res = await this.bot.cloudFlareService.getDomainsList();

                const { text, buttons } = domainListCommandTemplate(
                    res?.result!,
                    this.domainCommand,
                );

                context.reply(text, buttons);
            },
        );

        this.bot.bot.command(
            this.registerDomainCommand.slice(1),
            async (context: BotContext) => {
                context.reply(
                    "Введіть доменне ім'я котре бажаєте створити. Приклад домена example.com",
                );

                context.session = {
                    ...context.session,
                    state: State.REGISTER_DOMAIN,
                };
            },
        );
    }
}
