"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Check, ArrowRight } from "lucide-react";

export default function OfficeMovingHero({ locale = "en", dict = {} }) {
    const t = (key, fallback) => {
        const parts = key.split(".");
        let cur = dict;
        for (const p of parts) cur = cur?.[p];
        return cur ?? fallback;
    };

    const l = (path) => `/${locale}${path}`;

    return (
        <section className="w-full bg-gradient-to-br from-white to-violet-50">
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-16 lg:px-8">
                <div className="grid items-center gap-10 lg:grid-cols-2">
                    {/* LEFT IMAGE */}
                    <div className="relative flex justify-center lg:justify-start">
                        <div className="relative overflow-hidden rounded-xl shadow-lg ring-1 ring-black/10">
                            <Image
                                src="/banners/office-moving.png"
                                alt={t("movingHero.alt", "Home and office moving")}
                                width={560}
                                height={420}
                                priority
                                className="object-cover"
                            />
                        </div>
                    </div>

                    {/* RIGHT CONTENT */}
                    <div className="max-w-xl">
                        {/* Pill */}
                        <div className="inline-flex items-center gap-2 rounded bg-white px-4 py-2 text-xs font-medium text-slate-700 shadow ring-1 ring-black/5">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                            {t("movingHero.pill", "For all home & office relocation needs")}
                        </div>

                        {/* Title */}
                        <h1 className="mt-5 text-2xl font-extrabold leading-snug text-slate-900 sm:text-4xl lg:text-5xl">
                            <span className="text-[#4F46E5]">
                                {t("movingHero.titleBlue", "Home & Office Moving")}
                            </span>{" "}
                            {t("movingHero.titleRest1", "made easy")}
                            <br />
                            {t(
                                "movingHero.titleLine2",
                                "Reliable packing, transport, and setup—without the stress."
                            )}
                        </h1>

                        {/* Subtitle */}
                        <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
                            {t(
                                "movingHero.subtitle",
                                "Professional home and office moving solutions for local and long-distance relocation. Get end-to-end support including packing, loading, transportation, and safe unloading. Our experienced team ensures a smooth, secure, and hassle-free moving experience from start to finish."
                            )}
                        </p>

                        {/* Buttons */}
                        {/* <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                            <Link
                                href={l("/services/moving")}
                                className="inline-flex w-full items-center justify-center rounded-md bg-[#4F46E5] px-6 py-3 text-sm font-semibold text-white shadow hover:bg-[#4338CA] sm:w-auto"
                            >
                                {t("movingHero.ctaPrimary", "Get Started with Your Move")}
                            </Link>

                            <Link
                                href={t("movingHero.whatsappLink", "https://wa.me/")}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-semibold text-green-600 shadow ring-1 ring-green-200 hover:bg-green-50 sm:w-auto"
                            >
                                <MessageCircle className="h-4 w-4" />
                                {t("movingHero.ctaSecondary", "Contact on WhatsApp")}
                            </Link>
                        </div> */}

                        <div className="mt-6 flex flex-col gap-3 sm:mt-7 sm:flex-row sm:items-center">
                            <Link
                                href={l("/services/travel")}
                                className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:shadow-indigo-600/40 sm:w-auto sm:px-7 sm:py-3.5"
                            >
                                {t("movingHero.ctaPrimary", "Get Started with Your Move")}
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>

                            <Link
                                href={t("travelHero.whatsappLink", "https://wa.me/")}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-green-600 shadow-sm ring-1 ring-green-200 hover:bg-green-50 sm:w-auto sm:px-7 sm:py-3.5"
                            >
                                <MessageCircle className="h-4 w-4" />
                                {t("movingHero.ctaSecondary", "Contact on WhatsApp")}
                            </Link>
                        </div>

                        {/* Feature chips */}
                        <div className="mt-6 grid gap-3 sm:grid-cols-2">
                            <div className="flex items-center gap-2 rounded-md bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow ring-1 ring-black/5">
                                <Check className="h-4 w-4 text-slate-900" />
                                {t("movingHero.feature1", "Step-by-step guidance")}
                            </div>

                            <div className="flex items-center gap-2 rounded-md bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow ring-1 ring-black/5">
                                <Check className="h-4 w-4 text-slate-900" />
                                {t("movingHero.feature2", "Fast and reliable service")}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
