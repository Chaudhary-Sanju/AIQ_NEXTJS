"use client";

import { CheckCircle2 } from "lucide-react";

export default function WhyChooseYalakom({ locale = "en", dict = {} }) {
    const t = (key, fallback) => {
        const parts = key.split(".");
        let cur = dict;
        for (const p of parts) cur = cur?.[p];
        return cur ?? fallback;
    };

    const points =
        t("whyChooseYalakom.points", null) ?? [
            "Expert accountants with industry experience",
            "Transparent and affordable pricing",
            "Smart automation powered by modern technology",
            "Dedicated customer support when you need it",
            "Designed for startups, SMEs, and enterprises",
        ];

    return (
        <section className="w-full bg-gradient-to-br from-orange-50 via-white to-orange-50 py-14">
            <div className="mx-auto max-w-6xl px-6">
                <div className="relative overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-orange-100">

                    {/* Decorative Big ? */}
                    <div className="pointer-events-none absolute -left-10 top-1/2 -translate-y-1/2 text-[180px] font-extrabold text-orange-100">
                        ?
                    </div>

                    <div className="relative px-8 py-12 sm:px-14 sm:py-16">

                        {/* Title */}
                        <div className="text-center">
                            <h3 className="text-2xl font-light tracking-wide text-slate-600 sm:text-3xl">
                                {t("whyChooseYalakom.titleLine1", "Why Businesses Choose")}
                            </h3>

                            <h2 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                                {t("whyChooseYalakom.titleLine2", "YALAKOM")}
                            </h2>

                            <div className="mx-auto mt-6 h-1 w-20 rounded-full bg-orange-500" />
                        </div>

                        {/* Points */}
                        <div className="mt-10 grid gap-y-6 gap-x-12 sm:grid-cols-2">
                            {points.map((text, idx) => (
                                <div key={idx} className="flex items-start gap-3">
                                    <CheckCircle2 className="mt-1 h-6 w-6 text-green-600 shrink-0" />
                                    <p className="text-base leading-relaxed text-slate-700">
                                        {text}
                                    </p>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}