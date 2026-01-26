"use client";

import Image from "next/image";
import Link from "next/link";

export default function DeliveryHero({ locale = "en", dict = {} }) {
    const t = (key, fallback) => {
        const parts = key.split(".");
        let cur = dict;
        for (const p of parts) cur = cur?.[p];
        return cur ?? fallback;
    };

    const l = (path) => `/${locale}${path}`;

    return (
        <section className="relative overflow-hidden">
            {/* Full width hero */}
            <div className="relative h-[240px] sm:h-[300px] md:h-[380px] lg:h-[460px]">
                {/* Background image */}
                <Image
                    src="/banners/Delivery.png" // put image in /public
                    alt={t("deliveryHero.alt", "Delivery rider")}
                    fill
                    priority
                    className="object-cover"
                    sizes="100vw"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full px-6 sm:px-10 lg:px-16">
                        <div className="max-w-xl">
                            <h1 className="text-white font-semibold leading-tight tracking-tight text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                                {t(
                                    "deliveryHero.title",
                                    "Delivering at the Speed\nof Your Life"
                                )
                                    .split("\n")
                                    .map((line, i) => (
                                        <span key={i} className="block">
                                            {line}
                                        </span>
                                    ))}
                            </h1>

                            <p className="mt-4 text-white/80 text-sm sm:text-[15px] md:text-base leading-relaxed">
                                {t(
                                    "deliveryHero.subtitle",
                                    "Real-time tracking, instant pickups,\nand lightning-fast delivery\npowered by Yalakhom."
                                )
                                    .split("\n")
                                    .map((line, i) => (
                                        <span key={i} className="block">
                                            {line}
                                        </span>
                                    ))}
                            </p>

                            <div className="mt-6 flex flex-wrap gap-3">
                                <Link
                                    href={l("/get-started")}
                                    className="inline-flex items-center gap-2 rounded-md bg-white/15 px-4 py-2 text-sm font-medium text-white ring-1 ring-white/20 hover:bg-white/20"
                                >
                                    🚀 {t("deliveryHero.ctaPrimary", "Get Started")}
                                </Link>

                                <Link
                                    href={l("/track-order")}
                                    className="inline-flex items-center gap-2 rounded-md bg-white/15 px-4 py-2 text-sm font-medium text-white ring-1 ring-white/20 hover:bg-white/20"
                                >
                                    📦 {t("deliveryHero.ctaSecondary", "Track Order")}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
