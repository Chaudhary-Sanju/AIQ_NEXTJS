"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, ArrowRight, MessageCircle } from "lucide-react";

export default function LicenseHero({ locale = "en", dict = {} }) {
    const t = (key, fallback) => {
        const parts = key.split(".");
        let cur = dict;
        for (const p of parts) cur = cur?.[p];
        return cur ?? fallback;
    };

    const l = (path) => `/${locale}${path}`;

    return (
        <section className="relative overflow-hidden bg-[#f6f4fb]">
            {/* soft background accents */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-24 top-10 h-[320px] w-[320px] rounded-full bg-purple-200/40 blur-3xl" />
                <div className="absolute right-0 top-0 h-[420px] w-[420px] rounded-full bg-indigo-200/40 blur-3xl" />
                <div className="absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-100/40 blur-3xl" />
            </div>

            <div className="relative mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
                <div className="grid items-center gap-10 lg:grid-cols-2">
                    {/* LEFT CONTENT */}
                    <div>
                        {/* Pill */}
                        <div className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm ring-1 ring-black/5">
                            <span className="h-2 w-2 rounded-full bg-green-500" />
                            {t("licenseHero.pill", "For restaurants, cafes & food businesses")}
                        </div>

                        {/* Title */}
                        <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">
                            {t("licenseHero.title1", "Get your")}{" "}
                            <span className="text-[#4f46e5]">
                                {t("licenseHero.titleHighlight", "F&B licensing")}
                            </span>{" "}
                            {t(
                                "licenseHero.title2",
                                "done with ease fast, compliant solutions for food businesses"
                            )}
                        </h1>

                        {/* Subtitle */}
                        <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
                            {t(
                                "licenseHero.subtitle",
                                "We handle food and beverage licensing, permits, and documentation so you can focus on launching and running your business with confidence."
                            )}
                        </p>

                        {/* CTAs */}
                        <div className="mt-7 flex flex-wrap gap-3">
                            <Link
                                href={l("/services/fb-licensing")}
                                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:shadow-indigo-600/40"
                            >
                                {t("licenseHero.ctaPrimary", "View F&B Licensing Services")}
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>

                            <Link
                                href={t("licenseHero.whatsappLink", "https://wa.me/")}
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-green-600 shadow-sm ring-1 ring-green-200 hover:bg-green-50"
                            >
                                <MessageCircle className="h-4 w-4" />
                                {t("licenseHero.ctaSecondary", "Contact on WhatsApp")}
                            </Link>
                        </div>

                        {/* Badges */}
                        <div className="mt-6 flex flex-wrap gap-3">
                            <div className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm ring-1 ring-black/5">
                                <Check className="h-4 w-4 text-slate-700" />
                                {t("licenseHero.badge1", "Monthly & Annual Plans")}
                            </div>

                            <div className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm ring-1 ring-black/5">
                                <Check className="h-4 w-4 text-slate-700" />
                                {t("licenseHero.badge2", "GST & Tax Ready")}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT IMAGE */}
                    <div className="relative">
                        <div className="relative mx-auto aspect-[16/10] w-full max-w-[640px] overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/5">
                            <Image
                                src="/banners/licensing-hero.png"
                                alt={t("licenseHero.alt", "Licensing")}
                                fill
                                priority
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
