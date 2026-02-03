"use client";

import Image from "next/image";
import Link from "next/link";
import {
    ArrowRight,
    MessageSquare,
    ShieldCheck,
    Zap,
    Users,
    CheckCircle2,
    MessageCircle,
} from "lucide-react";

export default function CompanyRegisterHero({ locale = "en", dict = {} }) {
    const t = (key, fallback) => {
        const parts = key.split(".");
        let cur = dict;
        for (const p of parts) cur = cur?.[p];
        return cur ?? fallback;
    };

    const l = (path) => `/${locale}${path}`;

    const benefits = [
        { text: t("companyRegisterHero.benefit1", "Fast & Easy Process"), icon: Zap },
        { text: t("companyRegisterHero.benefit2", "Legal Compliance"), icon: ShieldCheck },
        { text: t("companyRegisterHero.benefit3", "Expert Support"), icon: Users },
    ];

    const stats = [
        { value: t("companyRegisterHero.stat1Value", "24h"), label: t("companyRegisterHero.stat1", "Fast Setup") },
        { value: t("companyRegisterHero.stat2Value", "99%"), label: t("companyRegisterHero.stat2", "Success Rate") },
        { value: t("companyRegisterHero.stat3Value", "5K+"), label: t("companyRegisterHero.stat3", "Companies") },
    ];

    return (
        <section className="relative overflow-hidden bg-[#070A12]">
            {/* soft gradient background */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-24 top-10 h-[420px] w-[420px] rounded-full bg-indigo-500/20 blur-3xl" />
                <div className="absolute right-0 top-0 h-[520px] w-[520px] rounded-full bg-purple-500/20 blur-3xl" />
                <div className="absolute left-1/2 top-2/3 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-3xl" />
            </div>

            {/* subtle grid */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.25] [background-image:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:28px_28px]" />

            <div className="relative py-10 md:py-14 px-6 sm:px-10 lg:px-16 mx-auto w-full max-w-7xl">
                <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
                    {/* LEFT */}
                    <div className="text-white">
                        {/* pill */}
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm ring-1 ring-white/10 backdrop-blur">
                            <span className="h-2 w-2 rounded-full bg-emerald-400" />
                            <span className="text-white/80">
                                {t("companyRegisterHero.pill", "For startups & growing businesses")}
                            </span>
                        </div>

                        {/* title */}
                        <h1 className="mt-7 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                            {t("companyRegisterHero.titleLine1", "Register your")}{" "}
                            <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-fuchsia-300 bg-clip-text text-transparent">
                                {t("companyRegisterHero.titleLine2", "business")}
                            </span>{" "}
                            {t("companyRegisterHero.titleLine3", "with confidence")}
                        </h1>

                        {/* subtitle */}
                        <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
                            {t(
                                "companyRegisterHero.subtitle",
                                "Streamlined company registration with expert guidance at every step."
                            )}
                        </p>

                        {/* benefits */}
                        <div className="mt-7 grid gap-3 sm:grid-cols-2">
                            {benefits.map((b, i) => {
                                const Icon = b.icon;
                                return (
                                    <div
                                        key={i}
                                        className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10"
                                    >
                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/15 ring-1 ring-emerald-500/20">
                                            <Icon className="h-4 w-4 text-emerald-300" />
                                        </div>
                                        <p className="text-sm font-medium text-white/85">{b.text}</p>
                                    </div>
                                );
                            })}
                        </div>

                        {/* CTAs */}
                        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                            <Link
                                href={l("/services/company-registration")}
                                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:shadow-indigo-600/40"
                            >
                                {t("companyRegisterHero.ctaPrimary", "Start Registration")}
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>

                            <Link
                                href={t("companyRegisterHero.whatsappLink", "https://wa.me/")}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/5 px-7 py-3.5 text-sm font-semibold text-white ring-1 ring-white/10 backdrop-blur transition hover:bg-white/10"
                            >
                                <MessageCircle className="h-4 w-4" />
                                {t("companyRegisterHero.ctaSecondary", "Contact on WhatsApp")}
                            </Link>
                        </div>

                        {/* trust line */}
                        <div className="mt-7 flex flex-wrap items-center gap-3 text-sm text-white/70">
                            <span className="inline-flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                                <span className="font-semibold text-white/80">
                                    {t("companyRegisterHero.badge", "100% Legal Compliance")}
                                </span>
                            </span>
                            <span className="h-1 w-1 rounded-full bg-white/30" />
                            <span>{t("companyRegisterHero.support", "7-day support")}</span>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="relative">
                        {/* image frame */}
                        <div className="relative overflow-hidden rounded-3xl bg-white/5 ring-1 ring-white/10 shadow-2xl">
                            {/* give a modern “cut” on desktop */}
                            <div className="relative aspect-[4/3] lg:aspect-[4/5] lg:rounded-l-[120px] overflow-hidden">
                                <Image
                                    src="/banners/company-register.jpg"
                                    alt={t("companyRegisterHero.alt", "Company registration process")}
                                    fill
                                    priority
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                            </div>

                            {/* floating stats */}
                            <div className="absolute bottom-4 left-4 right-4">
                                <div className="grid grid-cols-3 gap-3 rounded-2xl bg-black/35 p-3 backdrop-blur-md ring-1 ring-white/10">
                                    {stats.map((s, i) => (
                                        <div key={i} className="text-center">
                                            <div className="text-xl font-extrabold text-white">{s.value}</div>
                                            <div className="mt-0.5 text-[11px] font-medium text-white/70">
                                                {s.label}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* decorative corners */}
                        <div className="pointer-events-none absolute -top-6 -right-6 hidden h-24 w-24 rounded-3xl border border-indigo-400/25 lg:block" />
                        <div className="pointer-events-none absolute -bottom-6 -left-6 hidden h-20 w-20 rounded-full border border-purple-400/25 lg:block" />
                    </div>
                </div>

                {/* bottom glow line */}
                <div className="mx-auto mt-14 h-1.5 w-full max-w-3xl rounded-full bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
            </div>
        </section>
    );
}
