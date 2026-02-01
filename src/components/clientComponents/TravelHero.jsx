"use client";

import { ArrowRight, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function TravelHero({ locale = "en", dict = {} }) {
    const t = (key, fallback) => {
        const parts = key.split(".");
        let cur = dict;
        for (const p of parts) cur = cur?.[p];
        return cur ?? fallback;
    };

    const l = (path) => `/${locale}${path}`;

    return (
        <section className="relative w-full overflow-hidden">
            <div className="relative h-[360px] sm:h-[440px] md:h-[520px] lg:h-[560px]">
                {/* Background image */}
                <Image
                    src="/banners/boat.png"
                    alt={t("travelHero.alt", "Travel hero")}
                    fill
                    priority
                    className="object-cover"
                    sizes="100vw"
                />

                {/* Overlay to make text readable */}
                <div className="absolute inset-0 bg-black/25" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0">
                    <div className="mx-auto flex h-full max-w-7xl items-center px-5 sm:px-8">
                        <div className="max-w-3xl">
                            {/* Pill */}
                            <div className="inline-flex items-center gap-2 rounded bg-white/25 px-4 py-2 text-xs font-medium text-white ring-1 ring-white/30 backdrop-blur">
                                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                {t("travelHero.pill", "For leisure & business travelers")}
                            </div>

                            {/* Heading */}
                            <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
                                {t(
                                    "travelHero.title",
                                    "Plan your travel with ease carefully crafted\ntour packages for every journey"
                                )
                                    .split("\n")
                                    .map((line, i) => (
                                        <span key={i} className="block">
                                            {line}
                                        </span>
                                    ))}
                            </h1>

                            {/* Subtitle */}
                            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base md:text-lg">
                                {t(
                                    "travelHero.subtitle",
                                    "Explore thoughtfully designed tour packages tailored for relaxation, adventure, and business travel — planned to give you a seamless and memorable experience."
                                )}
                            </p>

                            {/* Buttons */}
                            <div className="mt-7 flex flex-wrap gap-3">
                                <Link
                                    href={l("/services/travel")}
                                    className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:shadow-indigo-600/40"
                                >
                                    {t("travelHero.ctaPrimary", "View Tour Packages")}
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>

                                <Link
                                    href={t("travelHero.whatsappLink", "https://wa.me/")}
                                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-green-600 shadow-sm ring-1 ring-green-200 hover:bg-green-50"
                                >
                                    <MessageCircle className="h-4 w-4" />
                                    {t("travelHero.ctaSecondary", "Contact on WhatsApp")}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
