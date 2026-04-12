"use client";

import React, { useMemo } from "react";
import Link from "next/link";

const serviceOrder = [
    "softwareDevelopment",
    "accountingFinance",
    "businessServices",
    "travelImmigration",
    "homeOfficeServices",
];

const translations = {
    en: {
        title: "Perfect Services",
        subtitle:
            "We provide a complete range of business, travel, home, and professional services designed to simplify your everyday needs — all in one place.",
        items: {
            businessServices: {
                title: "Company Register & F&B License",
                description:
                    "Complete support for company registration and food & beverage licensing to help you start and grow your business smoothly.",
                href: "/services/business-services",
            },
            travelImmigration: {
                title: "Travel & Immigration Services",
                description:
                    "All-in-one support for visa and immigration, tours and travel, flight booking, and transport arrangements.",
                href: "/services/travel-immigration",
            },
            homeOfficeServices: {
                title: "Home & Office Services",
                description:
                    "Reliable moving, repair, and installation services for homes, offices, and workspaces.",
                href: "/services/home-office-services",
            },
            softwareDevelopment: {
                title: "Software Development",
                description:
                    "Custom software solutions tailored to your business needs, from websites to enterprise systems.",
                href: "/services/software-development",
            },
            accountingFinance: {
                title: "Accounting & Finance",
                description:
                    "Professional accounting and financial support to simplify records, reporting, and business operations.",
                href: "/services/accounting-finance",
            },
        },
    },

    ne: {
        title: "उत्तम सेवाहरू",
        subtitle:
            "हामी व्यवसाय, यात्रा, घर तथा व्यावसायिक सेवाहरू एकै ठाउँमा उपलब्ध गराउँछौं, जसले तपाईंको दैनिक आवश्यकतालाई सरल बनाउँछ।",
        items: {
            businessServices: {
                title: "कम्पनी दर्ता तथा F&B लाइसेन्स",
                description:
                    "कम्पनी दर्ता र खाना तथा पेय लाइसेन्सका लागि पूर्ण सहयोग, ताकि तपाईंले आफ्नो व्यवसाय सहज रूपमा सुरु र विस्तार गर्न सक्नुहोस्।",
                href: "/services/business-services",
            },
            travelImmigration: {
                title: "यात्रा तथा आप्रवासन सेवा",
                description:
                    "भिसा तथा आप्रवासन, टुर तथा ट्राभल, उडान टिकट, र यातायात बुकिङका लागि एकै ठाउँमा सम्पूर्ण सहयोग।",
                href: "/services/travel-immigration",
            },
            homeOfficeServices: {
                title: "घर तथा कार्यालय सेवा",
                description:
                    "घर, कार्यालय तथा कार्यस्थलका लागि भरपर्दो सार्ने, मर्मत तथा जडान सेवाहरू।",
                href: "/services/home-office-services",
            },
            softwareDevelopment: {
                title: "सफ्टवेयर विकास",
                description:
                    "वेबसाइटदेखि व्यवसायिक प्रणालीसम्म तपाईंको आवश्यकताअनुसार अनुकूल सफ्टवेयर समाधानहरू।",
                href: "/services/software-development",
            },
            accountingFinance: {
                title: "लेखांकन तथा वित्त",
                description:
                    "रेकर्ड, रिपोर्टिङ र व्यवसायिक सञ्चालनलाई सहज बनाउन व्यावसायिक लेखांकन तथा वित्तीय सहयोग।",
                href: "/services/accounting-finance",
            },
        },
    },

    zh: {
        title: "精选服务",
        subtitle:
            "我们提供完整的商业、旅游、家居及专业服务，一站式满足您的日常需求，让一切更简单。",
        items: {
            businessServices: {
                title: "公司注册与餐饮牌照",
                description:
                    "为公司注册和餐饮牌照申请提供完整支持，帮助您顺利开展和发展业务。",
                href: "/services/business-services",
            },
            travelImmigration: {
                title: "旅游与移民服务",
                description:
                    "提供签证与移民、旅游规划、机票预订及交通安排的一站式服务。",
                href: "/services/travel-immigration",
            },
            homeOfficeServices: {
                title: "家居与办公室服务",
                description:
                    "为住宅、办公室和工作空间提供可靠的搬迁、维修与安装服务。",
                href: "/services/home-office-services",
            },
            softwareDevelopment: {
                title: "软件开发",
                description:
                    "根据您的业务需求定制软件解决方案，从网站到企业系统都可支持。",
                href: "/services/software-development",
            },
            accountingFinance: {
                title: "会计与财务",
                description:
                    "提供专业会计与财务支持，帮助简化记录、报表和业务运营。",
                href: "/services/accounting-finance",
            },
        },
    },
};

const serviceEmojis = {
    businessServices: "🏢",
    travelImmigration: "✈️",
    homeOfficeServices: "🏠",
    softwareDevelopment: "💻",
    accountingFinance: "📊",
};

const serviceBackgrounds = {
    businessServices: "https://picsum.photos/300/200?1",
    travelImmigration: "https://picsum.photos/300/200?2",
    homeOfficeServices: "https://picsum.photos/300/200?3",
    softwareDevelopment: "https://picsum.photos/300/200?4",
    accountingFinance: "https://picsum.photos/300/200?5",
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
        <section className="w-full bg-white py-10 md:py-14 lg:py-16">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto mb-10 max-w-[650px] text-center">
                    <h2 className="text-[32px] font-bold text-neutral-900">
                        {t.title}
                    </h2>
                    <p className="mt-2 text-sm leading-7 text-neutral-500">
                        {t.subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-[14px] md:grid-cols-3 md:gap-6 lg:grid-cols-5">
                    {serviceOrder.map((key) => {
                        const item = t.items[key];

                        return (
                            <Link
                                key={key}
                                href={item.href}
                                className="group relative overflow-hidden rounded-[18px] bg-gradient-to-br from-white to-indigo-50 p-[30px_20px_20px] transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02]"
                            >
                                <img
                                    src={serviceBackgrounds[key]}
                                    alt={item.title}
                                    className="absolute left-0 top-0 h-full w-full object-cover opacity-[0.08]"
                                />

                                <div className="relative z-10 flex min-h-[220px] flex-col items-center text-center">
                                    <div className="mx-auto flex h-[55px] w-[55px] items-center justify-center rounded-full bg-white text-[24px] shadow-[0_8px_20px_rgba(0,0,0,0.08)] transition duration-300 group-hover:scale-110">
                                        <span aria-hidden="true">{serviceEmojis[key]}</span>
                                    </div>

                                    <h3 className="mt-[18px] text-[15px] font-medium text-neutral-900">
                                        {item.title}
                                    </h3>

                                    <p className="mt-[6px] px-[10px] text-[13px] leading-6 text-neutral-500">
                                        {item.description}
                                    </p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}