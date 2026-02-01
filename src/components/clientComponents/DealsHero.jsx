"use client";

import Link from "next/link";

export default function DealsHero({ locale = "en", dict = {} }) {
    const t = (key, fallback) => {
        const parts = key.split(".");
        let cur = dict;
        for (const p of parts) cur = cur?.[p];
        return cur ?? fallback;
    };

    const l = (path) => `/${locale}${path}`;

    return (
        <section className="my-10">
            <div className="mx-auto max-w-screen">
                <div className="overflow-hidden bg-gradient-to-r from-[#3b2fd6] via-[#5b3fe7] to-[#b94cff] px-6 py-12 text-center text-white shadow-sm sm:px-10 sm:py-16">
                    <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
                        {t("dealsHero.title", "Enjoying our prices?")}
                    </h2>

                    <p className="mx-auto mt-4 max-w-3xl text-base font-medium text-white/90 sm:mt-6 sm:text-2xl">
                        {t(
                            "dealsHero.subtitle",
                            "Hop into our deals page and browse all of our exclusive offers!"
                        )}
                    </p>

                    <div className="mt-8 sm:mt-10">
                        <Link
                            href={l("/deals")}
                            className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-3 text-base font-extrabold text-[#4f46e5] shadow-sm ring-1 ring-white/30 hover:bg-white/95"
                        >
                            {t("dealsHero.cta", "Go To Deals")}
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
