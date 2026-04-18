"use client";

import Link from "next/link";

export default function DynamicperfectServicesHeroSection({
    locale = "en",
    dict = {},
    serviceKey = "software",
    imageName,
}) {
    const getNestedValue = (obj, path) => {
        return path.split(".").reduce((acc, key) => acc?.[key], obj);
    };

    const t = (path, fallback = "") => {
        return getNestedValue(dict, path) ?? fallback;
    };

    const l = (path) => {
        if (!path) return "#";

        if (
            /^https?:\/\//i.test(path) ||
            path.startsWith("#") ||
            path.startsWith("mailto:") ||
            path.startsWith("tel:")
        ) {
            return path;
        }

        const normalized = path.startsWith("/") ? path : `/${path}`;
        return `/${locale}${normalized}`;
    };

    const baseKey = `perfectServicesPage.${serviceKey}.hero`;
    const whatsappLink = t(`${baseKey}.whatsappLink`, "https://wa.me/");
    const imageSrc = imageName ? `/banners/${imageName}` : `/banners/${serviceKey}.png`;

    return (
        <section className="relative isolate w-full overflow-hidden bg-[#070b2d] text-white">
            {/* Full background image */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${imageSrc})` }}
            />

            {/* Overlay */}
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#070b2d]/85 via-[#070b2d]/60 to-[#070b2d]/45 md:from-[#070b2d]/80 md:via-[#070b2d]/45 md:to-transparent" />

            <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-16 lg:py-24">
                <div className="max-w-xl">
                    <div className="inline-flex max-w-full items-center rounded-xl bg-white px-3 py-2 text-[11px] font-medium text-slate-700 shadow sm:px-4 sm:text-xs">
                        <span className="mr-2 h-2 w-2 shrink-0 rounded-full bg-emerald-400" />
                        <span className="truncate">
                            {t(
                                `${baseKey}.pill`,
                                "Made for individuals & growing businesses"
                            )}
                        </span>
                    </div>

                    <h1 className="mt-5 text-3xl font-extrabold leading-tight sm:mt-6 sm:text-4xl lg:text-6xl">
                        {t(`${baseKey}.titleLine1`, "Build, manage, and grow your")}
                        <br />
                        <span className="text-[#4F6BFF]">
                            {t(`${baseKey}.titleHighlight`, "software")}
                        </span>
                        {t(`${baseKey}.titleSuffix`, ".")}
                    </h1>

                    <p className="mt-4 max-w-lg text-sm leading-6 text-white/80 sm:mt-5 sm:text-base sm:leading-7">
                        {t(
                            `${baseKey}.subtitle`,
                            "We create web apps, mobile applications, and custom software solutions designed to fit your unique needs."
                        )}
                    </p>

                    <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center">
                        <Link
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#f4f7ec] px-5 py-3 text-sm font-semibold text-[#6bbf59] shadow-sm transition hover:opacity-95 sm:w-auto"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="h-5 w-5 shrink-0"
                            >
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            {t(`${baseKey}.ctaSecondary`, "Contact on WhatsApp")}
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}