"use client";

import Image from "next/image";

export default function AccountingBenefits({ locale = "en", dict = {} }) {
    const t = (key, fallback) => {
        const parts = key.split(".");
        let cur = dict;
        for (const p of parts) cur = cur?.[p];
        return cur ?? fallback;
    };

    // You can fully control content + images via JSON (recommended)
    const items =
        t("accountingBenefits.items", null) ?? [
            {
                title: "Time-Saving Automation",
                desc: "Automate repetitive accounting tasks to save time and reduce errors.",
                icon: "/accounting-benefits/time-saving.png",
            },
            {
                title: "Secure Data Protection",
                desc: "Enterprise-grade security for financial data.",
                icon: "/accounting-benefits/secure-data.png",
            },
            {
                title: "Comprehensive Reporting",
                desc: "Real-time insights for smarter decisions.",
                icon: "/accounting-benefits/comprehensive-report.png",
            },
            {
                title: "Scalable Solutions",
                desc: "Accounting that grows with your business.",
                icon: "/accounting-benefits/scalable.png",
            },
        ];

    return (
        <section className="w-full bg-white">
            <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-16 py-10 md:py-14">
                <h2 className="text-center text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl md:text-3xl">
                    {t(
                        "accountingBenefits.title",
                        "Discover the Benefits of YALAKOM’s Accounting Packages"
                    )}
                </h2>

                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {items.slice(0, 4).map((it, idx) => (
                        <div
                            key={idx}
                            className="rounded-2xl bg-white p-5 shadow-[0_12px_30px_-22px_rgba(15,23,42,0.45)] ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-[0_18px_45px_-28px_rgba(15,23,42,0.55)]"
                        >
                            <div className="relative mb-4 h-24 w-full">
                                <Image
                                    src={it.icon}
                                    alt={it.title}
                                    fill
                                    sizes="(max-width: 1024px) 50vw, 25vw"
                                    className="object-contain object-left"
                                    priority={idx === 0}
                                />
                            </div>

                            <h3 className="text-sm font-extrabold text-slate-900">
                                {it.title}
                            </h3>
                            <p className="mt-2 text-xs leading-relaxed text-slate-600">
                                {it.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}