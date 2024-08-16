import { Markup } from "telegraf";

export const startMessage = () => {
    const text =
        "<b>Привіт, цей бот вміє:</b>\n\n" +
        "• реєструвати доменні імена на Cloudflare\n" +
        "• створювати, редагувати та видаляти DNS записи";
    const buttons = Markup.inlineKeyboard([
        Markup.button.callback("Реєстрація домена", "/register_domain"),
        Markup.button.callback("Переглянути домени", "/domain_list"),
    ]);

    return { text, buttons };
};
