import Link from "next/link";
import { ArrowRight, Home, PlaneLanding, PlaneTakeoff } from "lucide-react";

const SERVICES = [
    {
        key: "door-to-door",
        icon: Home,
        title: {
            en: "Door to Door",
            ne: "घरदेखि घरसम्म",
            zh: "门到门",
        },
        description: {
            en: "Book direct pickup and delivery from one address to another.",
            ne: "एक ठेगानाबाट अर्को ठेगानासम्म सिधा पिकअप र डेलिभरी बुक गर्नुहोस्।",
            zh: "预约从一个地址直接送到另一个地址的服务。",
        },
    },
    {
        key: "hk-to-kathmandu",
        icon: PlaneTakeoff,
        title: {
            en: "HK to Kathmandu",
            ne: "हङकङदेखि नेपाल",
            zh: "香港到尼泊尔",
        },
        description: {
            en: "Send parcels from Hong Kong to Kathmandu with secure courier support.",
            ne: "हङकङबाट नेपालमा सुरक्षित कुरियर सेवासहित पार्सल पठाउनुहोस्।",
            zh: "从香港寄送包裹到尼泊尔，提供安全快递支援。",
        },
    },
    {
        key: "kathmandu-to-hk",
        icon: PlaneLanding,
        title: {
            en: "Kathmandu to HK",
            ne: "नेपालदेखि हङकङ",
            zh: "尼泊尔到香港",
        },
        description: {
            en: "Send parcels from Kathmandu to Hong Kong with verified pickup service.",
            ne: "नेपालबाट हङकङमा प्रमाणित पिकअप सेवासहित पार्सल पठाउनुहोस्।",
            zh: "从尼泊尔寄送包裹到香港，提供验证取件服务。",
        },
    },
];

const COPY = {
    en: {
        eyebrow: "Choose Service",
        titleA: "Select your",
        titleB: "AI Express",
        titleC: "service",
        button: "Request Now",
    },
    ne: {
        eyebrow: "सेवा छान्नुहोस्",
        titleA: "आफ्नो",
        titleB: "AI Express",
        titleC: "सेवा छान्नुहोस्",
        button: "अहिले अनुरोध गर्नुहोस्",
    },
    zh: {
        eyebrow: "选择服务",
        titleA: "选择您的",
        titleB: "AI Express",
        titleC: "服务",
        button: "立即申请",
    },
};

const pick = (obj, locale = "en") => {
    return obj?.[locale] || obj?.en || "";
};

export default function AiExpressServiceCards({ locale = "en" }) {
    const t = COPY[locale] || COPY.en;

    return (
        <section className="relative overflow-hidden bg-[#f6f3ef] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <div className="absolute inset-x-0 top-0 h-[320px] bg-[radial-gradient(circle_at_top,#d9d6ff_0%,rgba(246,243,239,0)_58%)]" />

            <div className="relative mx-auto max-w-6xl">
                <div className="mb-10 text-center">
                    <div className="mb-4 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-neutral-500">
                        <span className="h-px w-10 bg-neutral-300" />
                        {t.eyebrow}
                        <span className="h-px w-10 bg-neutral-300" />
                    </div>

                    <h2 className="text-4xl font-medium leading-tight text-neutral-900 sm:text-5xl">
                        {t.titleA}{" "}
                        <span className="font-serif italic text-[#4b63ff]">
                            {t.titleB}
                        </span>{" "}
                        {t.titleC}
                    </h2>
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                    {SERVICES.map((service) => {
                        const Icon = service.icon;

                        return (
                            <Link
                                key={service.key}
                                href={`/${locale}/ai-express/${service.key}#pickup-form`}
                                className="group rounded-[28px] border border-black/5 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.12)]"
                            >
                                <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eef1ff] text-[#4b63ff]">
                                    <Icon className="h-6 w-6" />
                                </div>

                                <h3 className="text-xl font-semibold text-neutral-900">
                                    {pick(service.title, locale)}
                                </h3>

                                <p className="mt-3 min-h-[72px] text-sm leading-7 text-neutral-500">
                                    {pick(service.description, locale)}
                                </p>

                                <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#4b63ff]">
                                    {t.button}
                                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}