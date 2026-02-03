"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

export default function TransportHero({ locale = "en", dict = {} }) {
    const t = (key, fallback) => {
        const parts = key.split(".");
        let cur = dict;
        for (const p of parts) cur = cur?.[p];
        return cur ?? fallback;
    };

    const l = (path) => `/${locale}${path}`;

    return (
        <section className="w-full bg-[#dbe6ef]">
            <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-16 lg:px-8">
                <div className="grid items-center gap-10 lg:grid-cols-2">
                    {/* LEFT CONTENT */}
                    <div className="max-w-xl">
                        {/* Pill */}
                        <div className="inline-flex items-center gap-2 rounded bg-white px-4 py-2 text-xs font-medium text-slate-700 shadow ring-1 ring-black/5">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                            {t("transportHero.pill", "For local & long-distance travel")}
                        </div>

                        {/* Title */}
                        <h1 className="mt-5 text-2xl font-extrabold leading-snug text-slate-900 sm:text-4xl lg:text-5xl">
                            {t("transportHero.titleLine1", "Book")}
                            {" "}
                            <span className="text-[#3E63DD]">
                                {t("transportHero.titleHighlight", "transport")}
                            </span>{" "}
                            {t("transportHero.titleLine2", "with confidence")}
                            <br />
                            {t(
                                "transportHero.titleLine3",
                                "buses, vans, and private vehicles made easy"
                            )}
                        </h1>

                        {/* Subtitle */}
                        <p className="mt-4 text-sm leading-relaxed text-slate-700 sm:text-base">
                            {t(
                                "transportHero.subtitle",
                                "Flexible transport booking solutions for individuals, families, and groups. Choose from buses, vans, and private vehicles designed for comfort, safety, and reliable travel across short and long distances."
                            )}
                        </p>

                        {/* Perfect for */}
                        <div className="mt-5 text-sm text-slate-700">
                            <p className="font-semibold text-red-500">
                                {t("transportHero.perfectFor", "Perfect For")}
                            </p>
                            <ul className="mt-2 list-disc space-y-1 pl-5">
                                <li>{t("transportHero.point1", "City travel & intercity routes")}</li>
                                <li>{t("transportHero.point2", "Group tours & family trips")}</li>
                                <li>{t("transportHero.point3", "Corporate and business travel")}</li>
                            </ul>
                        </div>

                        {/* Buttons */}
                        <div className="mt-6 flex flex-col gap-3 sm:mt-7 sm:flex-row sm:items-center">
                            <Link
                                href={l("/services/travel")}
                                className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:shadow-indigo-600/40 sm:w-auto sm:px-7 sm:py-3.5"
                            >
                                {t("travelHero.ctaPrimary", "View Tour Packages")}
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>

                            <Link
                                href={t("travelHero.whatsappLink", "https://wa.me/")}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-green-600 shadow-sm ring-1 ring-green-200 hover:bg-green-50 sm:w-auto sm:px-7 sm:py-3.5"
                            >
                                <MessageCircle className="h-4 w-4" />
                                {t("travelHero.ctaSecondary", "Contact on WhatsApp")}
                            </Link>
                        </div>
                    </div>

                    {/* RIGHT IMAGE */}
                    <div className="relative flex justify-center lg:justify-end">
                        <Image
                            src="/banners/transport-hero.png"
                            alt={t("transportHero.alt", "Transport booking illustration")}
                            width={520}
                            height={420}
                            priority
                            className="max-w-full"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
