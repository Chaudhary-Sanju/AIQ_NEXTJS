"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Check, ArrowRight } from "lucide-react";

export default function VisaImmigrationHero({ locale = "en", dict = {} }) {
    const t = (key, fallback) => {
        const parts = key.split(".");
        let cur = dict;
        for (const p of parts) cur = cur?.[p];
        return cur ?? fallback;
    };

    const l = (path) => `/${locale}${path}`;

    return (
        <section className="w-full bg-gradient-to-br from-white to-violet-50">
            <div className="relative py-10 md:py-14 px-6 sm:px-10 lg:px-16 mx-auto w-full max-w-7xl">
                <div className="grid items-center gap-10 lg:grid-cols-2">
                    {/* LEFT IMAGE */}
                    <div className="relative flex justify-center lg:justify-start">
                        <div className="relative overflow-hidden rounded-xl shadow-lg ring-1 ring-black/10">
                            <Image
                                src="/banners/visa.png"
                                alt={t("visaHero.alt", "Visa application")}
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
                            {t("visaHero.pill", "For all visa & immigration needs")}
                        </div>

                        {/* Title */}
                        <h1 className="mt-5 text-2xl font-extrabold leading-snug text-slate-900 sm:text-4xl lg:text-5xl">
                            <span className="text-[#4F46E5]">{t("visaHero.titleBlue1", "Visa")}</span>{" "}
                            {t("visaHero.titleRest1", "and")}
                            {" "}
                            <span className="text-[#4F46E5]">
                                {t("visaHero.titleBlue2", "immigration")}
                            </span>{" "}
                            {t("visaHero.titleRest2", "made simple")}
                            <br />
                            {t("visaHero.titleLine2", "international applications without stress")}
                        </h1>

                        {/* Subtitle */}
                        <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
                            {t(
                                "visaHero.subtitle",
                                "Comprehensive visa and immigration solutions for study, work, travel, and business. Get step-by-step support, document verification, and personalized guidance to ensure a smooth and hassle-free application process."
                            )}
                        </p>

                        {/* Buttons */}
                        {/* <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                            <Link
                                href={l("/services/visa-immigration")}
                                className="inline-flex w-full items-center justify-center rounded-md bg-[#4F46E5] px-6 py-3 text-sm font-semibold text-white shadow hover:bg-[#4338CA] sm:w-auto"
                            >
                                {t("visaHero.ctaPrimary", "Get Started with Your Visa Application")}
                            </Link>

                            <Link
                                href={t("visaHero.whatsappLink", "https://wa.me/")}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-semibold text-green-600 shadow ring-1 ring-green-200 hover:bg-green-50 sm:w-auto"
                            >
                                <MessageCircle className="h-4 w-4" />
                                {t("visaHero.ctaSecondary", "Contact on WhatsApp")}
                            </Link>
                        </div> */}

                        <div className="mt-6 flex flex-col gap-3 sm:mt-7 sm:flex-row sm:items-center">
                            <Link
                                href={l("/services/travel")}
                                className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:shadow-indigo-600/40 sm:w-auto sm:px-7 sm:py-3.5"
                            >
                                {t("visaHero.ctaPrimary", "Get Started with Your Visa Application")}
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>

                            <Link
                                href={t("travelHero.whatsappLink", "https://wa.me/")}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-green-600 shadow-sm ring-1 ring-green-200 hover:bg-green-50 sm:w-auto sm:px-7 sm:py-3.5"
                            >
                                <MessageCircle className="h-4 w-4" />
                                {t("visaHero.ctaSecondary", "Contact on WhatsApp")}
                            </Link>
                        </div>

                        {/* Feature chips */}
                        <div className="mt-6 grid gap-3 sm:grid-cols-2">
                            <div className="flex items-center gap-2 rounded-md bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow ring-1 ring-black/5">
                                <Check className="h-4 w-4 text-slate-900" />
                                {t("visaHero.feature1", "Step-by-step application guidance")}
                            </div>

                            <div className="flex items-center gap-2 rounded-md bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow ring-1 ring-black/5">
                                <Check className="h-4 w-4 text-slate-900" />
                                {t("visaHero.feature2", "Fast and reliable process")}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
