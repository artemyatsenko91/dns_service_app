import { Command } from "./BotCommand";
import { BotContext } from "../bot";
import { State } from "../ISessionData";

export class ManualInput extends Command {
    getCommandInfo(): null {
        return null;
    }

    handle(): void {
        this.bot.bot.hears(/.*/, async (context: BotContext) => {
            const state = context.session?.state;
            let outMessage;
            if (context.message && "text" in context.message) {
                if (context.session) {
                    switch (state) {
                        case State.REGISTER_DOMAIN: {
                            const res =
                                await this.bot.cloudFlareService.createDomain(
                                    context.message.text,
                                );
                            const nsRecords = res?.result.name_servers.reduce(
                                (accum, item) => {
                                    accum += `• ${item}\n`;
                                    return accum;
                                },
                                "",
                            );
                            const message =
                                `Вітаю, домен ${res?.result.name} успішно створений \n` +
                                "Ocь NS записи до домена\n\n" +
                                `${nsRecords}`;
                            context.reply(message);
                            context.session.state = State.NEUTRAL;
                            return;
                        }
                        case State.CREATE_DNS_RECORD: {
                            const res =
                                await this.bot.cloudFlareService.createDnsRecord(
                                    context.message.text,
                                    context.session?.domainZoneId!,
                                );
                            context.reply(
                                `Вітаю, DNS запис ${res?.result.name} успішно створена`,
                            );

                            context.session.state = State.NEUTRAL;

                            return;
                        }
                        case State.EDIT_DNS_COMMENT: {
                            context.session.editedDnsRecord = {
                                ...context.session?.editedDnsRecord,
                                comment: context.message.text,
                            };

                            outMessage = "Коментар успішно змінений";
                            break;
                        }
                        case State.EDIT_DNS_CONTENT: {
                            context.session.editedDnsRecord = {
                                ...context.session?.editedDnsRecord,
                                content: context.message.text,
                            };

                            outMessage = "IP адреса успішно змінена";
                            break;
                        }
                        case State.EDIT_DNS_PROFIED: {
                            context.session.editedDnsRecord = {
                                ...context.session?.editedDnsRecord,
                                proxied:
                                    context.message.text === "true"
                                        ? true
                                        : false,
                            };
                            outMessage = "Profied успішно змінена";
                            break;
                        }
                        case State.EDIT_DNS_NAME: {
                            context.session.editedDnsRecord = {
                                ...context.session?.editedDnsRecord,
                                name: context.message.text,
                            };
                            outMessage = "Піддомен успішно змінений";
                            break;
                        }
                        default: {
                            context.reply("Я не розумію що ти ввів");
                            return;
                        }
                    }

                    try {
                        await this.bot.cloudFlareService.updateDnsRecord(
                            context.session.dnsRecordToEdit!,
                            context.session.domainZoneId!,
                            context.session.editedDnsRecord!,
                        );
                        context.session.state = State.NEUTRAL;
                        context.reply(outMessage!);
                    } catch (error) {
                        console.log(error);
                    }
                }
            }
        });
    }
}
