"use client";

import Image from "next/image";

export default function AiExpressAboutSection({ locale = "en", dict = {} }) {
    const t = (key, fallback) => {
        const parts = key.split(".");
        let cur = dict;
        for (const p of parts) cur = cur?.[p];
        return cur ?? fallback;
    };

    return (
        <section className="bg-[#efefef] py-10 sm:py-14 lg:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-14 xl:gap-20">
                    {/* Left Image */}
                    <div className="relative mx-auto w-full max-w-[470px] overflow-hidden rounded-[28px]">
                        <div className="relative aspect-[0.83/1] min-h-[340px] sm:min-h-[420px] lg:min-h-[540px]">
                            <Image
                                src="/banners/about-us.png"
                                alt={t("aboutUs.imageAlt", "Delivery person carrying boxes")}
                                fill
                                priority
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 45vw"
                            />
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="w-full">
                        <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl lg:text-[44px]">
                            {t("aboutUs.title", "About Us")}
                        </h2>

                        <div className="mt-5 space-y-6 text-[15px] leading-8 text-black/80 sm:text-base lg:text-[18px]">
                            <p>
                                {t(
                                    "aboutUs.description1",
                                    "At HkMandu, we believe delivery should match the speed of life. That’s why we’ve built a logistics platform that powers fast, reliable deliveries across Nepal and connects Nepal with Hong Kong through seamless international shipping—all with precision, reliability, and real-time visibility."
                                )}
                            </p>

                            <p>
                                {t(
                                    "aboutUs.description2",
                                    "From doorstep pickups within cities to nationwide delivery across Nepal and cross-border shipping between Hong Kong and Nepal, every package is handled with care and efficiency. Our commitment is simple: fast, secure, and seamless delivery—anytime, anywhere."
                                )}
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:mt-10 lg:gap-6">
                            <StatCard
                                value={t("aboutUs.stats.deliveries.value", "100K+")}
                                label={t("aboutUs.stats.deliveries.label", "Deliveries")}
                            />
                            <StatCard
                                value={t("aboutUs.stats.collaboration.value", "20+")}
                                label={t("aboutUs.stats.collaboration.label", "Collaboration")}
                            />
                            <StatCard
                                value={t("aboutUs.stats.clients.value", "1000+")}
                                label={t("aboutUs.stats.clients.label", "Clients")}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function StatCard({ value, label }) {
    return (
        <div className="rounded-2xl bg-white px-5 py-7 text-center shadow-[0_4px_16px_rgba(0,0,0,0.10)] ring-1 ring-black/5 sm:px-4 lg:px-6 lg:py-8">
            <div className="text-3xl font-bold text-[#1f57b8] sm:text-[32px] lg:text-[36px]">
                {value}
            </div>
            <div className="mt-5 text-xl font-medium text-black sm:text-2xl lg:text-[28px]">
                {label}
            </div>
        </div>
    );
}