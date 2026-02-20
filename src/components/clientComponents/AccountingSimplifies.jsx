"use client";

import Image from "next/image";

export default function AccountingSimplifies({ locale = "en", dict = {} }) {
    const t = (key, fallback) => {
        const parts = key.split(".");
        let cur = dict;
        for (const p of parts) cur = cur?.[p];
        return cur ?? fallback;
    };

    const steps =
        t("accountingSimplifies.steps", null) ?? [
            {
                title: "Choose Your Package",
                desc: "Select an accounting package tailored to your business size and requirements.",
            },
            {
                title: "Set Up Quickly",
                desc: "Get started with a fast, hassle-free onboarding process handled by our experts.",
            },
            {
                title: "Automate & Manage",
                desc: "Let our smart systems handle daily accounting tasks while you focus on growth.",
            },
            {
                title: "Monitor & Improve",
                desc: "Access real-time reports and expert insights to improve financial performance.",
            },
        ];

    const imageSrc = t(
        "accountingSimplifies.imageSrc",
        "/banners/accounting/accounting-simplifies.png"
    );

    return (
        <section className="w-full bg-[#F3E8FF]">
            <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-16 py-10 md:py-14">
                <div className="grid items-center gap-10 lg:grid-cols-2">
                    {/* LEFT */}
                    <div className="max-w-xl">
                        <h2 className="text-lg font-extrabold text-slate-900 sm:text-xl md:text-2xl">
                            {t(
                                "accountingSimplifies.title",
                                "How YALAKOM Simplifies Your Accounting?"
                            )}
                        </h2>

                        <ol className="mt-5 space-y-4">
                            {steps.slice(0, 4).map((s, i) => (
                                <li key={i} className="flex gap-3">
                                    <div className="mt-0.5 text-sm font-bold text-slate-900">
                                        {i + 1}.
                                    </div>

                                    <div>
                                        <div className="text-sm font-extrabold text-slate-900">
                                            {s.title}
                                        </div>
                                        <p className="mt-1 text-sm leading-relaxed text-slate-700">
                                            {s.desc}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>

                    {/* RIGHT */}
                    <div className="relative flex justify-center lg:justify-end">
                        <div className="relative h-[260px] w-[260px] sm:h-[320px] sm:w-[320px] md:h-[360px] md:w-[360px]">
                            <Image
                                src={imageSrc}
                                alt={t("accountingSimplifies.alt", "Accounting process illustration")}
                                fill
                                priority
                                sizes="(max-width: 1024px) 80vw, 360px"
                                className="object-contain"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}