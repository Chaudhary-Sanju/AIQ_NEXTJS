"use client";

import Link from "next/link";
import { Wrench, Settings, ShieldCheck } from "lucide-react";

export default function RepairInstallationSection({ locale = "en", dict = {} }) {
    const t = (key, fallback) => {
        const parts = key.split(".");
        let cur = dict;
        for (const p of parts) cur = cur?.[p];
        return cur ?? fallback;
    };

    const l = (path) => `/${locale}${path}`;

    const cards = [
        {
            title: t("repairSection.card1Title", "Device Repair"),
            desc: t(
                "repairSection.card1Desc",
                "Quick diagnosis and expert repair for home and office devices. Affordable service with transparent pricing and trusted technicians."
            ),
            Icon: Wrench,
            ring: "ring-red-500/60",
            border: "border-red-600/60",
            iconBg: "bg-red-500/10",
            iconColor: "text-red-600",
        },
        {
            title: t("repairSection.card2Title", "New Installation"),
            desc: t(
                "repairSection.card2Desc",
                "Professional installation of appliances, electronics, and smart devices. Safe setup, proper testing, and complete guidance included."
            ),
            Icon: Settings,
            ring: "ring-blue-600/60",
            border: "border-blue-700/60",
            iconBg: "bg-blue-500/10",
            iconColor: "text-blue-700",
        },
        {
            title: t("repairSection.card3Title", "Maintenance & Support"),
            desc: t(
                "repairSection.card3Desc",
                "Regular checkups and long-term maintenance to keep your devices running smoothly and efficiently without interruptions."
            ),
            Icon: ShieldCheck,
            ring: "ring-green-600/60",
            border: "border-green-700/60",
            iconBg: "bg-green-500/10",
            iconColor: "text-green-700",
        },
    ];

    return (
        <section className="relative w-full overflow-hidden bg-gradient-to-br from-[#f3f0ff] via-[#efeaff] to-[#f3f0ff]">
            {/* decorative circles */}
            <div className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-indigo-300/40" />
            <div className="pointer-events-none absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-indigo-300/40" />

            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
                {/* Title */}
                <div className="text-center">
                    <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
                        {t("repairSection.title", "Repair & Installation Services")}
                    </h2>
                    <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
                        {t(
                            "repairSection.subtitle",
                            "Fast, reliable repair and professional installation — done right the first time."
                        )}
                    </p>
                </div>

                {/* Cards */}
                <div className="mt-8 grid gap-5 md:mt-10 md:grid-cols-3">
                    {cards.map(({ title, desc, Icon, border, ring, iconBg, iconColor }, i) => (
                        <div
                            key={i}
                            className={[
                                "rounded-2xl bg-white/45 backdrop-blur-sm",
                                "border-2",
                                border,
                                "shadow-sm",
                                "px-6 py-7",
                                "text-center",
                            ].join(" ")}
                        >
                            <div
                                className={[
                                    "mx-auto flex h-14 w-14 items-center justify-center rounded-xl",
                                    iconBg,
                                    "ring-1",
                                    ring,
                                ].join(" ")}
                            >
                                <Icon className={["h-7 w-7", iconColor].join(" ")} />
                            </div>

                            <h3 className="mt-5 text-lg font-extrabold text-slate-900">
                                {title}
                            </h3>

                            <p className="mt-3 text-sm leading-relaxed text-slate-700">
                                {desc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Buttons */}
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row">
                    <Link
                        href={l("/services/repair")}
                        className="inline-flex w-full items-center justify-center rounded-lg bg-[#5b55d8] px-7 py-3 text-sm font-semibold text-white shadow hover:bg-[#4f49c9] sm:w-auto"
                    >
                        {t("repairSection.ctaPrimary", "Book Service")}
                    </Link>

                    <Link
                        href={l("/services/repair")}
                        className="inline-flex w-full items-center justify-center rounded-lg bg-[#5b55d8]/10 px-7 py-3 text-sm font-semibold text-[#4a44c8] ring-1 ring-[#5b55d8]/30 hover:bg-[#5b55d8]/15 sm:w-auto"
                    >
                        {t("repairSection.ctaSecondary", "Learn More")}
                    </Link>
                </div>
            </div>
        </section>
    );
}
