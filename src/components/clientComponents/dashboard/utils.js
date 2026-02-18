export const LOCALES = ["en", "ne", "zh"];

export const tGet = (obj, path, fallback = "") => {
    try {
        return path.split(".").reduce((acc, k) => acc?.[k], obj) ?? fallback;
    } catch {
        return fallback;
    }
};

export const withLocale = (href, locale) => {
    if (!href) return "#";
    if (/^https?:\/\//i.test(href) || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
        return href;
    }
    const path = href.startsWith("/") ? href : `/${href}`;
    const first = path.split("/")[1];
    if (LOCALES.includes(first)) return path;
    return `/${locale}${path}`;
};
