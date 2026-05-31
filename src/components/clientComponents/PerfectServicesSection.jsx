"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import {
    ArrowRight,
    BadgeCheck,
    BriefcaseBusiness,
    Calculator,
    Plane,
    Code2,
    Sparkles,
    Hammer,
} from "lucide-react";

const serviceOrder = [
    "softwareDevelopment",
    "accountingFinance",
    "businessServices",
    "travelImmigration",
    "constructionRepairServices",
];

const comingSoonServiceKeys = [
    "businessServices",
    "constructionRepairServices",
];

const translations = {
    en: {
        title: "R Services",
        subtitle:
            "From business setup to digital solutions, travel support, finance, and home assistance — R Services brings trusted professional help closer to you, all through one simple platform.",
        badge: "Professional Services",
        explore: "Explore Service",
        comingSoon: "Coming Soon",
        items: {
            businessServices: {
                title: "Company Register & F&B License",
                description:
                    "Launch your business with confidence. We simplify company registration and F&B licensing with guided support from start to approval.",
                href: "/services/business-services",
            },
            travelImmigration: {
                title: "Travel & Immigration Services",
                description:
                    "Plan your next journey with ease. Get reliable support for visas, immigration guidance, travel bookings, flights, and transport arrangements.",
                href: "/services/travel-immigration",
            },
            constructionRepairServices: {
                title: "Construction & Repair Services",
                description:
                    "Build, renovate, and repair with confidence. From home renovations and office setup to electrical, plumbing, and maintenance support — we connect you with trusted professionals.",
                href: "/services/construction-repair-services",
            },
            softwareDevelopment: {
                title: "Software Development",
                description:
                    "Turn your ideas into powerful digital products. We build websites, business systems, and custom software designed to grow with your goals.",
                href: "/services/software-development",
            },
            accountingFinance: {
                title: "Accounting & Finance",
                description:
                    "Stay organized, compliant, and business-ready with professional accounting and finance support tailored for smoother daily operations.",
                href: "/services/accounting-finance",
            },
        },
    },

    ne: {
        title: "R Services",
        subtitle:
            "व्यवसाय सुरु गर्नेदेखि डिजिटल समाधान, यात्रा सहयोग, लेखा–वित्त र घर/अफिस सेवासम्म — R Services ले भरपर्दो व्यावसायिक सहयोग एउटै सरल प्लेटफर्ममा ल्याउँछ।",
        badge: "व्यावसायिक सेवाहरू",
        explore: "सेवा हेर्नुहोस्",
        comingSoon: "चाँडै आउँदैछ",
        items: {
            businessServices: {
                title: "कम्पनी दर्ता तथा F&B लाइसेन्स",
                description:
                    "आफ्नो व्यवसाय आत्मविश्वासका साथ सुरु गर्नुहोस्। कम्पनी दर्ता र F&B लाइसेन्स प्रक्रियालाई हामी सहज, स्पष्ट र व्यवस्थित बनाउँछौं।",
                href: "/services/business-services",
            },
            travelImmigration: {
                title: "यात्रा तथा आप्रवासन सेवा",
                description:
                    "तपाईंको अर्को यात्रा झन्झटमुक्त बनाउनुहोस्। भिसा, आप्रवासन, टुर, फ्लाइट बुकिङ र यातायात व्यवस्थापनमा भरपर्दो सहयोग पाउनुहोस्।",
                href: "/services/travel-immigration",
            },
            constructionRepairServices: {
                title: "निर्माण तथा मर्मत सेवा",
                description:
                    "निर्माण, नवीकरण र मर्मत कार्य सहज बनाउनुहोस्। घर, अफिस, इलेक्ट्रिकल, प्लम्बिङ तथा मर्मतसम्बन्धी कामका लागि भरपर्दो प्राविधिक सहयोग पाउनुहोस्।",
                href: "/services/construction-repair-services",
            },
            softwareDevelopment: {
                title: "सफ्टवेयर विकास",
                description:
                    "तपाईंको आइडियालाई प्रभावकारी डिजिटल उत्पादनमा बदल्नुहोस्। वेबसाइट, बिजनेस सिस्टम र कस्टम सफ्टवेयर तपाईंको लक्ष्यअनुसार तयार गर्छौं।",
                href: "/services/software-development",
            },
            accountingFinance: {
                title: "लेखांकन तथा वित्त",
                description:
                    "व्यवसायलाई व्यवस्थित, स्पष्ट र तयार राख्नुहोस्। दैनिक सञ्चालन, रेकर्ड र रिपोर्टिङका लागि व्यावसायिक लेखा–वित्त सहयोग पाउनुहोस्।",
                href: "/services/accounting-finance",
            },
        },
    },

    zh: {
        title: "R服务",
        subtitle:
            "从公司设立到数字解决方案、旅游支持、财务管理及家居办公室服务，R服务将可信赖的专业支持整合到一个简单平台。",
        badge: "专业服务",
        explore: "查看服务",
        comingSoon: "即將推出",
        items: {
            businessServices: {
                title: "公司注册与餐饮牌照",
                description:
                    "让您的业务顺利起步。我们为公司注册和餐饮牌照申请提供清晰、便捷、可靠的全流程支持。",
                href: "/services/business-services",
            },
            travelImmigration: {
                title: "旅游与移民服务",
                description:
                    "轻松规划您的下一段旅程。我们提供签证、移民咨询、旅游安排、机票预订和交通支持。",
                href: "/services/travel-immigration",
            },
            constructionRepairServices: {
                title: "建筑与维修服务",
                description:
                    "让建筑、翻新与维修更轻松。无论是家居装修、办公室安装，还是电力、水管和维护服务，我们都能为您连接可靠专业人员。",
                href: "/services/construction-repair-services",
            },
            softwareDevelopment: {
                title: "软件开发",
                description:
                    "把您的想法变成强大的数字产品。我们打造网站、业务系统和定制软件，助力您的业务持续成长。",
                href: "/services/software-development",
            },
            accountingFinance: {
                title: "会计与财务",
                description:
                    "让财务管理更清晰、更专业。我们提供会计、记录、报表和业务运营相关的可靠支持。",
                href: "/services/accounting-finance",
            },
        },
    },
};

const serviceConfig = {
    softwareDevelopment: {
        icon: Code2,
        emoji: "💻",
        tone: "blue",
    },
    accountingFinance: {
        icon: Calculator,
        emoji: "📊",
        tone: "orange",
    },
    businessServices: {
        icon: BriefcaseBusiness,
        emoji: "🏢",
        tone: "blue",
    },
    travelImmigration: {
        icon: Plane,
        emoji: "✈️",
        tone: "orange",
    },
    constructionRepairServices: {
        icon: Hammer,
        emoji: "🔨",
        tone: "blue",
    },
};

export default function PerfectServicesSection({ locale = "en" }) {
    const lang = useMemo(() => {
        const map = { en: "en", ne: "ne", zh: "zh" };
        return map[locale] || "en";
    }, [locale]);

    const t = useMemo(() => {
        return translations[lang] || translations.en;
    }, [lang]);

    return (
        <section
            id="perfect-services"
            className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-blue-50 py-4 sm:py-4 lg:py-6"
        >
            <div className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl" />
            <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl" />

            <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto mb-8 max-w-3xl text-center md:mb-10">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#1a4b8f] shadow-sm">
                        <Sparkles className="h-4 w-4" />
                        {t.badge}
                    </div>

                    <h2 className="text-[30px] font-bold leading-tight tracking-tight text-neutral-950 sm:text-4xl lg:text-[46px]">
                        {t.title}
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-neutral-600 sm:text-base">
                        {t.subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
                    {serviceOrder.map((key) => {
                        const item = t.items[key];
                        const config = serviceConfig[key];
                        const Icon = config.icon;
                        const isOrange = config.tone === "orange";
                        const isComingSoon = comingSoonServiceKeys.includes(key);

                        return (
                            <Link
                                key={key}
                                href={`/${locale}${item.href}`}
                                className={[
                                    "group relative overflow-hidden rounded-[26px] border border-orange-100 bg-white/95 p-4 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_18px_45px_rgba(15,42,94,0.10)] sm:p-5",
                                    "last:col-span-2 last:mx-auto last:w-[calc(50%-6px)]",
                                    "md:last:col-span-1 md:last:mx-0 md:last:w-full",
                                ].join(" ")}
                            >
                                <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-orange-100/70 blur-2xl transition group-hover:bg-orange-200/80" />
                                <div className="pointer-events-none absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-blue-100/60 blur-2xl transition group-hover:bg-blue-200/70" />

                                {isComingSoon && (
                                    <div className="absolute right-3 top-3 z-20 rounded-full bg-orange-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-md">
                                        {t.comingSoon}
                                    </div>
                                )}

                                <div className="relative flex min-h-[230px] flex-col">
                                    <div className="flex items-start justify-between gap-3">
                                        <div
                                            className={[
                                                "flex h-13 w-13 items-center justify-center rounded-2xl transition duration-300 group-hover:scale-110",
                                                isOrange
                                                    ? "bg-orange-100 text-orange-600 group-hover:bg-orange-500 group-hover:text-white"
                                                    : "bg-[#1a4b8f]/10 text-[#1a4b8f] group-hover:bg-[#1a4b8f] group-hover:text-white",
                                            ].join(" ")}
                                        >
                                            <Icon className="h-6 w-6" />
                                        </div>

                                        {!isComingSoon && (
                                            <span className="text-2xl leading-none opacity-80 transition group-hover:scale-110">
                                                {config.emoji}
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="mt-5 text-[15px] font-bold leading-6 text-neutral-950 sm:text-base">
                                        {item.title}
                                    </h3>

                                    <p className="mt-2 line-clamp-4 text-xs leading-6 text-neutral-500 sm:text-[13px]">
                                        {item.description}
                                    </p>

                                    <div className="mt-auto pt-5">
                                        <div className="inline-flex items-center gap-2 text-xs font-bold text-[#1a4b8f] transition group-hover:gap-3">
                                            <span>{t.explore}</span>
                                            <ArrowRight className="h-4 w-4" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                <div className="mx-auto mt-8 grid max-w-4xl gap-3 sm:grid-cols-3">
                    <TrustPoint text="Hong Kong ↔ Nepal" />
                    <TrustPoint text="Multilingual Support" />
                    <TrustPoint text="Simple Request Flow" />
                </div>
            </div>
        </section>
    );
}

function TrustPoint({ text }) {
    return (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-orange-100 bg-white/85 px-4 py-3 text-sm font-semibold text-neutral-700 shadow-sm backdrop-blur">
            <BadgeCheck className="h-4 w-4 text-[#1a4b8f]" />
            <span>{text}</span>
        </div>
    );
}