"use client";

import React, { useMemo } from "react";
import Link from "next/link";

const serviceOrder = [
    "softwareDevelopment",
    "accountingDevelopment",
    "companyRegister",
    "fnbLicense",
    "visaImmigration",
    "tourTravel",
    "flightTicket",
    "bookTransport",
    "homeOfficeMoving",
    "repairInstallation",
];

const translations = {
    en: {
        title: "Perfect Services",
        subtitle:
            "We provide a complete range of business, travel, and logistics services designed to simplify your everyday needs — all in one place.",
        items: {
            softwareDevelopment: {
                title: "Software Development",
                description:
                    "Custom software solutions tailored to your business needs, from websites to enterprise systems.",
                href: "/services/software-development",
            },
            accountingDevelopment: {
                title: "Accounting Development",
                description:
                    "Smart accounting system development to simplify reports, records, and financial operations.",
                href: "/services/accounting-development",
            },
            companyRegister: {
                title: "Company Register",
                description:
                    "Easy company registration support to help you start your business smoothly.",
                href: "/services/company-register",
            },
            fnbLicense: {
                title: "F&B License",
                description:
                    "Professional help for food and beverage licensing and approval processes.",
                href: "/services/f&b-license",
            },
            visaImmigration: {
                title: "Visa and Immigration",
                description:
                    "Trusted guidance for visa processing, documentation, and immigration support.",
                href: "/services/visa-and-immigration",
            },
            tourTravel: {
                title: "Tour and Travel",
                description:
                    "Convenient travel planning services for holidays, tours, and business trips.",
                href: "/services/tour-and-travel",
            },
            flightTicket: {
                title: "Flight Ticket",
                description:
                    "Quick and easy domestic and international flight booking assistance.",
                href: "/services/flight-ticket",
            },
            bookTransport: {
                title: "Book Transport",
                description:
                    "Reliable transport booking solutions for personal and business travel needs.",
                href: "/services/book-transport",
            },
            homeOfficeMoving: {
                title: "Home and Office Moving",
                description:
                    "Safe and organized moving services for homes, offices, and workspaces.",
                href: "/services/home-and-office-moving",
            },
            repairInstallation: {
                title: "Repair and Installation",
                description:
                    "Expert repair and installation support for home and office essentials.",
                href: "/services/repair-and-installation",
            },
        },
    },

    ne: {
        title: "उत्तम सेवाहरू",
        subtitle:
            "हामी व्यवसाय, यात्रा र ढुवानीसम्बन्धी सम्पूर्ण सेवाहरू एकै ठाउँमा उपलब्ध गराउँछौं, जसले तपाईंको दैनिक आवश्यकतालाई सरल बनाउँछ।",
        items: {
            softwareDevelopment: {
                title: "सफ्टवेयर विकास",
                description:
                    "वेबसाइटदेखि व्यवसायिक प्रणालीसम्म तपाईंको आवश्यकताअनुसार अनुकूल सफ्टवेयर समाधानहरू।",
                href: "/services/software-development",
            },
            accountingDevelopment: {
                title: "लेखांकन विकास",
                description:
                    "रिपोर्ट, रेकर्ड र आर्थिक सञ्चालनलाई सहज बनाउने स्मार्ट लेखांकन प्रणाली विकास।",
                href: "/services/accounting-development",
            },
            companyRegister: {
                title: "कम्पनी दर्ता",
                description:
                    "तपाईंको व्यवसाय सहज रूपमा सुरु गर्न सरल कम्पनी दर्ता सहयोग।",
                href: "/services/company-register",
            },
            fnbLicense: {
                title: "खाना तथा पेय लाइसेन्स",
                description:
                    "खाना तथा पेयसम्बन्धी लाइसेन्स र स्वीकृतिका लागि व्यावसायिक सहयोग।",
                href: "/services/f&b-license",
            },
            visaImmigration: {
                title: "भिसा तथा आप्रवासन",
                description:
                    "भिसा प्रक्रिया, कागजात र आप्रवासन सेवाका लागि विश्वसनीय मार्गदर्शन।",
                href: "/services/visa-and-immigration",
            },
            tourTravel: {
                title: "टुर तथा ट्राभल",
                description:
                    "घुमफिर, भ्रमण र व्यवसायिक यात्राका लागि सहज यात्रा योजना सेवा।",
                href: "/services/tour-and-travel",
            },
            flightTicket: {
                title: "उडान टिकट",
                description:
                    "आन्तरिक र अन्तर्राष्ट्रिय यात्राका लागि छिटो र सजिलो टिकट बुकिङ सेवा।",
                href: "/services/flight-ticket",
            },
            bookTransport: {
                title: "यातायात बुकिङ",
                description:
                    "व्यक्तिगत र व्यवसायिक यात्राका लागि भरपर्दो यातायात बुकिङ समाधान।",
                href: "/services/book-transport",
            },
            homeOfficeMoving: {
                title: "घर तथा कार्यालय सार्ने",
                description:
                    "घर, कार्यालय र कार्यस्थल सार्न सुरक्षित र व्यवस्थित सेवा।",
                href: "/services/home-and-office-moving",
            },
            repairInstallation: {
                title: "मर्मत तथा जडान",
                description:
                    "घर तथा कार्यालयका आवश्यक सामग्रीका लागि विशेषज्ञ मर्मत र जडान सेवा।",
                href: "/services/repair-and-installation",
            },
        },
    },

    zh: {
        title: "精选服务",
        subtitle:
            "我们提供完整的商业、旅游和物流服务，一站式满足您的日常需求，让一切更简单。",
        items: {
            softwareDevelopment: {
                title: "软件开发",
                description:
                    "根据您的业务需求定制软件解决方案，从网站到企业系统都可支持。",
                href: "/services/software-development",
            },
            accountingDevelopment: {
                title: "会计系统开发",
                description:
                    "智能会计系统开发，帮助简化报表、记录和财务运营。",
                href: "/services/accounting-development",
            },
            companyRegister: {
                title: "公司注册",
                description:
                    "便捷的公司注册支持，帮助您顺利开展业务。",
                href: "/services/company-register",
            },
            fnbLicense: {
                title: "餐饮牌照",
                description:
                    "提供餐饮业务牌照申请与审批的专业协助。",
                href: "/services/f&b-license",
            },
            visaImmigration: {
                title: "签证与移民",
                description:
                    "为签证办理、文件准备和移民事务提供可靠支持。",
                href: "/services/visa-and-immigration",
            },
            tourTravel: {
                title: "旅游服务",
                description:
                    "为度假、旅游和商务出行提供便捷的行程规划服务。",
                href: "/services/tour-and-travel",
            },
            flightTicket: {
                title: "机票预订",
                description:
                    "快速便捷的国内及国际航班机票预订服务。",
                href: "/services/flight-ticket",
            },
            bookTransport: {
                title: "交通预订",
                description:
                    "满足个人和商务出行需求的可靠交通预订服务。",
                href: "/services/book-transport",
            },
            homeOfficeMoving: {
                title: "搬屋与办公室搬迁",
                description:
                    "为住宅、办公室和工作空间提供安全有序的搬迁服务。",
                href: "/services/home-and-office-moving",
            },
            repairInstallation: {
                title: "维修与安装",
                description:
                    "为家庭和办公室设备提供专业维修与安装支持。",
                href: "/services/repair-and-installation",
            },
        },
    },
};

const serviceEmojis = {
    softwareDevelopment: "💻",
    accountingDevelopment: "📊",
    companyRegister: "🏢",
    fnbLicense: "🍽️",
    visaImmigration: "🛂",
    tourTravel: "🌍",
    flightTicket: "✈️",
    bookTransport: "🚌",
    homeOfficeMoving: "📦",
    repairInstallation: "🛠️",
};

const serviceBackgrounds = {
    softwareDevelopment:
        "https://picsum.photos/300/200?1",
    accountingDevelopment:
        "https://picsum.photos/300/200?2",
    companyRegister:
        "https://picsum.photos/300/200?3",
    fnbLicense:
        "https://picsum.photos/300/200?4",
    visaImmigration:
        "https://picsum.photos/300/200?5",
    tourTravel:
        "https://picsum.photos/300/200?6",
    flightTicket:
        "https://picsum.photos/300/200?7",
    bookTransport:
        "https://picsum.photos/300/200?8",
    homeOfficeMoving:
        "https://picsum.photos/300/200?9",
    repairInstallation:
        "https://picsum.photos/300/200?10",
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
                <div className="mx-auto mb-10 max-w-[600px] text-center">
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