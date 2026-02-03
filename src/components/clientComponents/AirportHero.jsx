"use client";

import { ArrowRight, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AirportHero({ locale = "en", dict = {} }) {
    const t = (key, fallback) => {
        const parts = key.split(".");
        let cur = dict;
        for (const p of parts) cur = cur?.[p];
        return cur ?? fallback;
    };

    const l = (path) => `/${locale}${path}`;

    return (
        <section className="relative w-full overflow-hidden">
            <div className="relative h-[420px] sm:h-[440px] md:h-[560px] lg:h-[620px]">
                {/* Background image */}
                <Image
                    src="/banners/flight.png"
                    alt={t("airportHero.alt", "Airport transfers and flight tickets")}
                    fill
                    priority
                    className="object-cover"
                    sizes="100vw"
                />

                {/* Overlay (lighter image needs slightly different overlay) */}
                <div className="absolute inset-0 bg-black/35 sm:bg-black/25" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent sm:hidden" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent hidden sm:block" />

                {/* Content */}
                <div className="absolute inset-0">
                    <div className="mx-auto flex h-full max-w-6xl items-center px-4 sm:px-8">
                        <div className="w-full max-w-3xl pt-10 pb-10 text-center sm:pt-14 sm:pb-14 sm:text-left">
                            {/* Pill */}
                            <div className="inline-flex items-center gap-2 rounded bg-white/20 px-3 py-1.5 text-[11px] font-medium text-white ring-1 ring-white/25 backdrop-blur sm:px-4 sm:py-2 sm:text-xs">
                                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                                {t("airportHero.pill", "For smooth arrivals & departures")}
                            </div>

                            {/* Heading */}
                            <h1 className="mt-4 text-[24px] font-extrabold leading-snug tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
                                {t(
                                    "airportHero.title",
                                    "Airport transfers & flight tickets\neverything arranged for your journey"
                                )
                                    .split("\n")
                                    .map((line, i) => (
                                        <span key={i} className="block">
                                            {line}
                                        </span>
                                    ))}
                            </h1>

                            {/* Subtitle */}
                            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base md:text-lg">
                                <span className="block sm:hidden line-clamp-3">
                                    {t(
                                        "airportHero.subtitle",
                                        "Reliable airport pickup and drop services combined with easy flight ticket booking, ensuring a smooth, comfortable, and well-planned travel experience."
                                    )}
                                </span>
                                <span className="hidden sm:block">
                                    {t(
                                        "airportHero.subtitle",
                                        "Reliable airport pickup and drop services combined with easy flight ticket booking, ensuring a smooth, comfortable, and well-planned travel experience."
                                    )}
                                </span>
                            </p>

                            {/* Buttons */}
                            <div className="mt-6 flex flex-col gap-3 sm:mt-7 sm:flex-row sm:items-center">
                                <Link
                                    href={l("/services/travel")}
                                    className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:shadow-indigo-600/40 sm:w-auto sm:px-7 sm:py-3.5"
                                >
                                    {t("airportHero.ctaPrimary", "Book Travel Services")}
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>

                                <Link
                                    href={t("travelHero.whatsappLink", "https://wa.me/")}
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-green-600 shadow-sm ring-1 ring-green-200 hover:bg-green-50 sm:w-auto sm:px-7 sm:py-3.5"
                                >
                                    <MessageCircle className="h-4 w-4" />
                                    {t("airportHero.ctaSecondary", "Contact on WhatsApp")}
                                </Link>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
