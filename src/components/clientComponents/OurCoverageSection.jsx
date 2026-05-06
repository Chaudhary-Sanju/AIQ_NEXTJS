// components/OurCoverageSection.jsx
import Image from "next/image";
import { BadgeCheck, Globe2, MapPin, Plane, Truck } from "lucide-react";

const fallbackCoverage = {
    title: "Our Coverage",
    subtitle:
        "From local support to cross-border connections, HKMandu helps connect people, products, parcels, and services between Hong Kong and Nepal with speed, care, and reliability.",
    badge: "Hong Kong ↔ Nepal",
    points: [
        "Cross-border service support",
        "Courier and delivery coverage",
        "Products and professional services",
    ],
};

export default function OurCoverageSection({
    dict,
    mapSrc = "/coverage-map.png",
    className = "",
}) {
    const t = dict?.coverage || fallbackCoverage;

    const points = Array.isArray(t.points) && t.points.length
        ? t.points
        : fallbackCoverage.points;

    return (
        <section
            className={`relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-blue-50 py-12 sm:py-14 lg:py-16 ${className}`}
        >
            <div className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl" />
            <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-3xl text-center">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#1a4b8f] shadow-sm">
                        <Globe2 className="h-4 w-4" />
                        {t.badge || fallbackCoverage.badge}
                    </div>

                    <h2 className="text-[30px] font-bold leading-tight tracking-tight text-neutral-950 sm:text-4xl lg:text-[46px]">
                        {t.title || fallbackCoverage.title}
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-neutral-600 sm:text-base">
                        {t.subtitle || fallbackCoverage.subtitle}
                    </p>
                </div>

                <div className="mx-auto mt-8 max-w-6xl rounded-[32px] border border-orange-100 bg-white/95 p-3 shadow-[0_24px_70px_rgba(15,42,94,0.12)] backdrop-blur sm:p-4 lg:mt-10">
                    <div className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-white to-orange-50/50">
                        <div className="pointer-events-none absolute left-6 top-6 z-10 rounded-2xl border border-orange-100 bg-white/90 px-4 py-3 shadow-sm backdrop-blur">
                            <div className="flex items-center gap-2 text-sm font-bold text-neutral-950">
                                <MapPin className="h-4 w-4 text-[#1a4b8f]" />
                                HKMandu Network
                            </div>
                            <p className="mt-1 text-xs text-neutral-500">
                                Hong Kong and Nepal coverage
                            </p>
                        </div>

                        <div className="relative aspect-[16/7] w-full min-h-[240px] sm:min-h-[320px]">
                            <Image
                                src={mapSrc}
                                alt={t.imageAlt || "HKMandu coverage map"}
                                fill
                                className="object-contain p-4 sm:p-6 lg:p-8"
                                sizes="(max-width: 1024px) 100vw, 1100px"
                                priority={false}
                            />
                        </div>

                        <div className="pointer-events-none absolute bottom-6 right-6 hidden rounded-2xl border border-orange-100 bg-white/90 px-4 py-3 shadow-sm backdrop-blur sm:block">
                            <div className="flex items-center gap-2 text-sm font-bold text-neutral-950">
                                <Plane className="h-4 w-4 text-orange-500" />
                                Fast Connections
                            </div>
                            <p className="mt-1 text-xs text-neutral-500">
                                Services made simple
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mx-auto mt-8 grid max-w-5xl gap-3 sm:grid-cols-3">
                    {points.map((point, index) => (
                        <CoveragePoint
                            key={point}
                            icon={
                                index === 0 ? (
                                    <Globe2 className="h-4 w-4" />
                                ) : index === 1 ? (
                                    <Truck className="h-4 w-4" />
                                ) : (
                                    <BadgeCheck className="h-4 w-4" />
                                )
                            }
                            text={point}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

function CoveragePoint({ icon, text }) {
    return (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-orange-100 bg-white/85 px-4 py-3 text-center text-sm font-semibold text-neutral-700 shadow-sm backdrop-blur">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-50 text-[#1a4b8f]">
                {icon}
            </span>
            <span>{text}</span>
        </div>
    );
}