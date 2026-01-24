import "server-only";

const dictionaries = {
    en: () => import("./dictionaries/en.json").then((m) => m.default),
    ne: () => import("./dictionaries/ne.json").then((m) => m.default),
    zh: () => import("./dictionaries/zh.json").then((m) => m.default),
};

export const locales = ["en", "ne", "zh"];
export const defaultLocale = "en";

export async function getDictionary(locale) {
    return (dictionaries[locale] || dictionaries[defaultLocale])();
}
