"use client";

import Image from "next/image";
import { CheckCircle2, PackageCheck, MapPin, Truck } from "lucide-react";

export default function AiExpressAboutSection({ locale = "en", dict = {} }) {
    const t = (key, fallback) => {
        const parts = key.split(".");
        let cur = dict;
        for (const p of parts) cur = cur?.[p];
        return cur ?? fallback;
    };

    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-blue-50 py-12 sm:py-16 lg:py-20">
            {/* Soft background decoration */}
            <div className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl" />
            <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 xl:gap-20">
                    {/* Left Image */}
                    <div className="relative mx-auto w-full max-w-[520px]">
                        <div className="absolute -left-4 -top-4 hidden h-28 w-28 rounded-3xl bg-[#1a4b8f]/10 sm:block" />
                        <div className="absolute -bottom-4 -right-4 hidden h-32 w-32 rounded-3xl bg-orange-300/30 sm:block" />

                        <div className="relative overflow-hidden rounded-[30px] bg-white p-2 shadow-[0_24px_70px_rgba(15,42,94,0.16)] ring-1 ring-black/5">
                            <div className="relative aspect-[4/4.6] min-h-[330px] overflow-hidden rounded-[24px] sm:min-h-[430px] lg:min-h-[500px]">
                                <Image
                                    src="/banners/about-us.png"
                                    alt={t("aboutUs.imageAlt", "Delivery person carrying boxes")}
                                    fill
                                    priority
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 100vw, 45vw"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

                                <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/90 p-4 shadow-lg backdrop-blur-md">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1a4b8f] text-white">
                                            <Truck className="h-5 w-5" />
                                        </div>

                                        <div>
                                            <p className="text-sm font-bold text-neutral-900">
                                                {t("aboutUs.badgeTitle", "Fast & Reliable Delivery")}
                                            </p>
                                            <p className="mt-0.5 text-xs leading-5 text-neutral-500">
                                                {t(
                                                    "aboutUs.badgeText",
                                                    "Nepal-wide delivery and Hong Kong ↔ Nepal shipping."
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="w-full">
                        <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#1a4b8f] shadow-sm">
                            <PackageCheck className="h-4 w-4" />
                            {t("aboutUs.eyebrow", "About A Express")}
                        </div>

                        <h2 className="mt-5 max-w-2xl text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl lg:text-[46px] lg:leading-[1.08]">
                            {t("aboutUs.title", "Fast delivery built for Nepal and Hong Kong.")}
                        </h2>

                        <div className="mt-5 max-w-2xl space-y-4 text-[15px] leading-7 text-neutral-600 sm:text-base lg:text-[17px] lg:leading-8">
                            <p>
                                {t(
                                    "aboutUs.description1",
                                    "At HkMandu, we believe delivery should match the speed of life. That’s why we’ve built a logistics platform that powers fast, reliable deliveries across Nepal and connects Nepal with Hong Kong through seamless international shipping."
                                )}
                            </p>

                            <p>
                                {t(
                                    "aboutUs.description2",
                                    "From doorstep pickups within cities to nationwide delivery across Nepal and cross-border shipping between Hong Kong and Nepal, every package is handled with care, efficiency, and real-time visibility."
                                )}
                            </p>
                        </div>

                        {/* Feature Points */}
                        <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <FeatureItem
                                text={t("aboutUs.features.pickup", "Doorstep pickup support")}
                            />
                            <FeatureItem
                                text={t("aboutUs.features.tracking", "Real-time tracking")}
                            />
                            <FeatureItem
                                text={t("aboutUs.features.crossBorder", "Hong Kong ↔ Nepal shipping")}
                            />
                            <FeatureItem
                                text={t("aboutUs.features.secure", "Secure package handling")}
                            />
                        </div>

                        {/* Stats */}
                        <div className="mt-8 grid grid-cols-3 overflow-hidden rounded-3xl bg-white shadow-[0_18px_45px_rgba(15,42,94,0.10)] ring-1 ring-black/5">
                            <StatCard
                                icon={<PackageCheck className="h-5 w-5" />}
                                value={t("aboutUs.stats.deliveries.value", "100K+")}
                                label={t("aboutUs.stats.deliveries.label", "Deliveries")}
                            />

                            <StatCard
                                icon={<MapPin className="h-5 w-5" />}
                                value={t("aboutUs.stats.collaboration.value", "20+")}
                                label={t("aboutUs.stats.collaboration.label", "Partners")}
                            />

                            <StatCard
                                icon={<CheckCircle2 className="h-5 w-5" />}
                                value={t("aboutUs.stats.clients.value", "1000+")}
                                label={t("aboutUs.stats.clients.label", "Clients")}
                                noBorder
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function FeatureItem({ text }) {
    return (
        <div className="flex items-center gap-2.5 rounded-2xl border border-orange-100 bg-white/80 px-4 py-3 shadow-sm">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-[#1a4b8f]" />
            <span className="text-sm font-medium text-neutral-700">{text}</span>
        </div>
    );
}

function StatCard({ icon, value, label, noBorder = false }) {
    return (
        <div
            className={[
                "px-3 py-5 text-center sm:px-5 sm:py-6",
                noBorder ? "" : "border-r border-orange-100",
            ].join(" ")}
        >
            <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-orange-50 text-[#1a4b8f]">
                {icon}
            </div>

            <div className="text-xl font-bold text-[#1a4b8f] sm:text-2xl lg:text-[30px]">
                {value}
            </div>

            <div className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-neutral-500 sm:text-xs">
                {label}
            </div>
        </div>
    );
}