"use client";

import {
    FileText,
    PackageCheck,
    UserCheck,
    CreditCard,
    Truck,
    Handshake,
    RefreshCw,
    ShieldAlert,
    Mail,
    CheckCircle2,
    Sparkles,
} from "lucide-react";

const content = {
    en: {
        title: "Terms & Conditions",
        updated: "Last updated: 2026",
        badge: "Legal Terms",
        subtitle:
            "These terms explain how HKMandu services, product orders, courier support, payments, and service requests should be used.",

        highlights: [
            "Use the platform responsibly and legally",
            "Orders and services are subject to confirmation",
            "Terms may be updated when required",
        ],

        sections: [
            {
                title: "1. Introduction",
                body: "Welcome to HKMandu. By accessing or using our platform, you agree to comply with and be bound by these terms and conditions.",
            },
            {
                title: "2. Services",
                body: "HKMandu provides products, courier support, and professional services including software, business, travel, and home/office services between Hong Kong and Nepal.",
            },
            {
                title: "3. User Responsibilities",
                body: "You agree to provide accurate information, use the platform legally, and not misuse or attempt to disrupt the services.",
            },
            {
                title: "4. Orders & Payments",
                body: "All orders are subject to availability and confirmation. Prices and services may change without prior notice.",
            },
            {
                title: "5. Courier & Delivery",
                body: "Delivery timelines may vary depending on logistics, customs, and external conditions. HKMandu is not responsible for delays beyond control.",
            },
            {
                title: "6. Service Requests",
                body: "Service outcomes depend on the information provided. HKMandu does not guarantee specific results but ensures professional handling.",
            },
            {
                title: "7. Refund & Cancellation",
                body: "Refund and cancellation policies depend on the type of product or service and will be communicated where applicable.",
            },
            {
                title: "8. Limitation of Liability",
                body: "HKMandu shall not be liable for indirect, incidental, or consequential damages arising from use of the platform.",
            },
            {
                title: "9. Changes to Terms",
                body: "We may update these terms at any time. Continued use of the platform means you accept the updated terms.",
            },
            {
                title: "10. Contact",
                body: "For any questions, please contact us via phone, email, or WhatsApp.",
            },
        ],
    },

    ne: {
        title: "नियम तथा सर्तहरू",
        updated: "अन्तिम अपडेट: 2026",
        badge: "कानुनी सर्तहरू",
        subtitle:
            "यी सर्तहरूले HKMandu का सेवा, उत्पादन अर्डर, कुरियर सहयोग, भुक्तानी र सेवा अनुरोध कसरी प्रयोग गर्ने भन्ने जानकारी दिन्छ।",

        highlights: [
            "प्लेटफर्म जिम्मेवारीपूर्वक र कानुनी रूपमा प्रयोग गर्नुहोस्",
            "अर्डर र सेवा पुष्टि अनुसार हुनेछ",
            "आवश्यक परेमा सर्तहरू अपडेट हुन सक्छन्",
        ],

        sections: [
            {
                title: "1. परिचय",
                body: "HKMandu प्रयोग गर्दा तपाईं यी नियम तथा सर्तहरूमा सहमत हुनुहुन्छ।",
            },
            {
                title: "2. सेवाहरू",
                body: "HKMandu ले Hong Kong र Nepal बीच उत्पादन, कुरियर, र विभिन्न व्यावसायिक सेवाहरू प्रदान गर्दछ।",
            },
            {
                title: "3. प्रयोगकर्ताको जिम्मेवारी",
                body: "सही जानकारी दिनु, कानुनी रूपमा प्रयोग गर्नु र सेवाको दुरुपयोग नगर्नु तपाईंको जिम्मेवारी हो।",
            },
            {
                title: "4. अर्डर र भुक्तानी",
                body: "सबै अर्डर उपलब्धता र पुष्टि अनुसार हुनेछ। मूल्य परिवर्तन हुन सक्छ।",
            },
            {
                title: "5. डेलिभरी",
                body: "डेलिभरी समय परिस्थिति अनुसार फरक हुन सक्छ।",
            },
            {
                title: "6. सेवा अनुरोध",
                body: "सेवाको नतिजा तपाईंले दिएको जानकारीमा निर्भर हुन्छ।",
            },
            {
                title: "7. फिर्ता र रद्द",
                body: "फिर्ता नीति सेवा अनुसार फरक हुन्छ।",
            },
            {
                title: "8. दायित्व सीमा",
                body: "HKMandu अप्रत्यक्ष क्षतिका लागि जिम्मेवार हुने छैन।",
            },
            {
                title: "9. नियम परिवर्तन",
                body: "यी सर्तहरू समय समयमा परिवर्तन हुन सक्छन्।",
            },
            {
                title: "10. सम्पर्क",
                body: "प्रश्न भएमा हामीलाई सम्पर्क गर्नुहोस्।",
            },
        ],
    },

    zh: {
        title: "条款与条件",
        updated: "最后更新：2026",
        badge: "法律条款",
        subtitle:
            "本条款说明 HKMandu 的服务、商品订单、快递支持、付款及服务申请的使用规则。",

        highlights: [
            "请合法并负责任地使用平台",
            "订单和服务需经确认",
            "条款可能会按需要更新",
        ],

        sections: [
            {
                title: "1. 介绍",
                body: "使用 HKMandu 即表示您同意这些条款。",
            },
            {
                title: "2. 服务",
                body: "HKMandu 提供香港与尼泊尔之间的商品、快递和专业服务。",
            },
            {
                title: "3. 用户责任",
                body: "您必须提供准确信息并合法使用平台。",
            },
            {
                title: "4. 订单与付款",
                body: "订单取决于库存和确认，价格可能变动。",
            },
            {
                title: "5. 配送",
                body: "配送时间可能因外部因素而变化。",
            },
            {
                title: "6. 服务请求",
                body: "服务结果取决于提供的信息。",
            },
            {
                title: "7. 退款与取消",
                body: "退款政策取决于具体服务。",
            },
            {
                title: "8. 责任限制",
                body: "HKMandu 不承担间接损失责任。",
            },
            {
                title: "9. 条款变更",
                body: "条款可能随时更新。",
            },
            {
                title: "10. 联系我们",
                body: "如有问题，请联系我们。",
            },
        ],
    },
};

const sectionIcons = [
    FileText,
    PackageCheck,
    UserCheck,
    CreditCard,
    Truck,
    Handshake,
    RefreshCw,
    ShieldAlert,
    Sparkles,
    Mail,
];

export default function TermsPage({ locale = "en" }) {
    const t = content[locale] || content.en;

    return (
        <main className="bg-white">
            <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-blue-50">
                <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl" />
                <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl" />

                <div className="relative mx-auto max-w-5xl px-4 py-14 sm:px-6 md:py-16 lg:px-8 lg:py-20">
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#1a4b8f] shadow-sm">
                            <FileText className="h-4 w-4" />
                            {t.badge}
                        </div>

                        <h1 className="text-[34px] font-bold leading-tight tracking-tight text-neutral-950 sm:text-5xl lg:text-[56px]">
                            {t.title}
                        </h1>

                        <p className="mt-4 text-sm font-semibold text-orange-600">
                            {t.updated}
                        </p>

                        <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-8 text-neutral-600 sm:text-base">
                            {t.subtitle}
                        </p>
                    </div>

                    <div className="mx-auto mt-9 grid max-w-4xl gap-3 sm:grid-cols-3">
                        {t.highlights.map((item) => (
                            <div
                                key={item}
                                className="rounded-2xl border border-orange-100 bg-white/90 p-4 text-center shadow-sm backdrop-blur"
                            >
                                <div className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-orange-50 text-[#1a4b8f]">
                                    <CheckCircle2 className="h-4 w-4" />
                                </div>

                                <p className="text-sm font-semibold leading-6 text-neutral-700">
                                    {item}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-white py-12 sm:py-16">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className="space-y-4">
                        {t.sections.map((section, index) => {
                            const Icon = sectionIcons[index] || FileText;

                            return (
                                <article
                                    key={section.title}
                                    className="group rounded-[26px] border border-orange-100 bg-gradient-to-br from-white to-orange-50/40 p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-[0_18px_45px_rgba(15,42,94,0.08)] sm:p-6"
                                >
                                    <div className="flex gap-4">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#1a4b8f]/10 text-[#1a4b8f] transition group-hover:bg-[#1a4b8f] group-hover:text-white">
                                            <Icon className="h-5 w-5" />
                                        </div>

                                        <div>
                                            <h2 className="text-lg font-bold text-neutral-950 sm:text-xl">
                                                {section.title}
                                            </h2>

                                            <p className="mt-2 text-sm leading-7 text-neutral-600 sm:text-[15px]">
                                                {section.body}
                                            </p>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>
        </main>
    );
}