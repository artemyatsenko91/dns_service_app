import { Markup } from "telegraf";

import { InlineKeyboardButton } from "telegraf/typings/core/types/typegram";
import { GetDomainResult } from "../../services/CloudflareService/types/IGetDomainResponse";
import { ZoneResult } from "../../services/CloudflareService/types/IGetZoneResponse";

const createButtonCallback = (
    array: InlineKeyboardButton[][],
    index: number,
    btn_text: string,
    command: string,
    callbackQueryId: string,
) => {
    if (!array[index]) {
        array[index] = [];
    }
    const callbackCommand = `${command} ${callbackQueryId}`;
    array[index].push(Markup.button.callback(btn_text, callbackCommand));
};

export const generateButtons = (
    domainsData: GetDomainResult[] | ZoneResult[],
    edit_command: string,
): InlineKeyboardButton[][] => {
    const buttonsPerRow = 1;

    const buttons: InlineKeyboardButton[][] = domainsData.reduce(
        (accum, item, index) => {
            const rowIndex = Math.floor(index / buttonsPerRow);

            createButtonCallback(
                accum,
                rowIndex,
                item.name,
                edit_command,
                item.id,
            );

            return accum;
        },
        [] as InlineKeyboardButton[][],
    );

    return buttons;
};
