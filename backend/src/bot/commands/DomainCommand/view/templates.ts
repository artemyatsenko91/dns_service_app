import { Markup } from "telegraf";
import { GetDomainResult } from "../../../../services/CloudflareService/types/IGetDomainResponse";
import { generateButtons } from "../../../common/generateInlineButtons";
import { IDNSRecord } from "../../../ISessionData";
import { ZoneResult } from "../../../../services/CloudflareService/types/IGetZoneResponse";

export const deleteDnsRecordTemplate = (
    domainResult: GetDomainResult[],
    command: string,
) => {
    const buttonsData = generateButtons(domainResult, command);
    const text = "Оберіть який запис ви бажаєте видалити";
    const buttons = Markup.inlineKeyboard(buttonsData);

    return { text, buttons };
};

export const editDnsRecordTemplate = (
    domainResult: GetDomainResult[],
    command: string,
) => {
    const buttonsData = generateButtons(domainResult, command);
    const text = "Оберіть який запис ви бажаєте змінити";
    const buttons = Markup.inlineKeyboard(buttonsData);

    return { text, buttons };
};

export const domainCommandWithQueryTemplate = () => {
    const text = "Що ви бажаете зробити?";
    const buttons = Markup.inlineKeyboard([
        [
            Markup.button.callback("Створити DNS запис", "/create_dns"),
            Markup.button.callback("Редагувати DNS запис", "/edit_dns"),
        ],
        [Markup.button.callback("Видалити DNS запис", "/delete_dns")],
    ]);

    return { text, buttons };
};

export const editDnsRecordWithQueryTemplate = (
    dnsRecord: IDNSRecord,
    name: string,
) => {
    const dnsDataKeys = Object.keys(dnsRecord);

    const buttonsData = dnsDataKeys
        .filter((key) => key !== "id" && key !== "type")
        .map((item) => [Markup.button.callback(item, `/edit_dns_${item}`)]);

    const text = `Вкажіть що бажаєте змінити у записа ${name}`;
    const buttons = Markup.inlineKeyboard(buttonsData);

    return { text, buttons };
};

export const domainListCommandTemplate = (
    domainResult: ZoneResult[],
    command: string,
) => {
    const buttonsData = generateButtons(domainResult, command);

    const text =
        "Список доменів. Оберіть домен, та оберіть що ви бажаєте зробити";
    const buttons = Markup.inlineKeyboard(buttonsData);

    return { text, buttons };
};
