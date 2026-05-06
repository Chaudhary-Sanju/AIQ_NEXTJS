"use client";

import {
    Cookie,
    ShieldCheck,
    Settings,
    BarChart3,
    RefreshCw,
    Mail,
    CheckCircle2,
} from "lucide-react";

const content = {
    en: {
        title: "Cookies Policy",
        updated: "Last updated: 2026",
        badge: "Privacy & Cookies",
        subtitle:
            "This policy explains how HKMandu uses cookies to improve your browsing experience, remember preferences, and keep the platform running smoothly.",

        highlights: [
            "Used to improve website functionality",
            "Helps remember your preferences",
            "Can be managed from your browser settings",
        ],

        sections: [
            {
                title: "1. What Are Cookies",
                body: "Cookies are small text files stored on your device when you visit a website. They help improve functionality and user experience.",
            },
            {
                title: "2. How We Use Cookies",
                body: "HKMandu uses cookies to remember preferences, improve performance, and understand how users interact with our platform.",
            },
            {
                title: "3. Types of Cookies We Use",
                body: "We may use essential cookies (for basic functionality), analytics cookies (to understand usage), and preference cookies (to remember settings).",
            },
            {
                title: "4. Third-Party Cookies",
                body: "Some cookies may be set by third-party services such as analytics or integrations used on our platform.",
            },
            {
                title: "5. Managing Cookies",
                body: "You can control or disable cookies through your browser settings. Disabling cookies may affect website functionality.",
            },
            {
                title: "6. Updates to This Policy",
                body: "We may update this cookies policy at any time. Continued use of the platform means you accept any changes.",
            },
            {
                title: "7. Contact",
                body: "If you have questions about cookies, please contact us via phone, email, or WhatsApp.",
            },
        ],
    },

    ne: {
        title: "कुकीज नीति",
        updated: "अन्तिम अपडेट: 2026",
        badge: "गोपनीयता र कुकीज",
        subtitle:
            "यो नीतिले HKMandu ले तपाईंको ब्राउजिङ अनुभव सुधार गर्न, प्राथमिकता सम्झन, र प्लेटफर्म सहज रूपमा चलाउन कुकीज कसरी प्रयोग गर्छ भन्ने जानकारी दिन्छ।",

        highlights: [
            "वेबसाइटको कार्यक्षमता सुधार गर्न प्रयोग हुन्छ",
            "तपाईंका प्राथमिकता सम्झन सहयोग गर्छ",
            "ब्राउजर सेटिङबाट व्यवस्थापन गर्न सकिन्छ",
        ],

        sections: [
            {
                title: "1. कुकीज के हुन्",
                body: "कुकीज साना टेक्स्ट फाइल हुन् जुन वेबसाइट प्रयोग गर्दा तपाईंको डिभाइसमा सुरक्षित हुन्छन्।",
            },
            {
                title: "2. हामी कसरी प्रयोग गर्छौं",
                body: "HKMandu ले कुकीज प्रयोगकर्ताको अनुभव सुधार र प्लेटफर्मको प्रदर्शनका लागि प्रयोग गर्दछ।",
            },
            {
                title: "3. कुकीजका प्रकार",
                body: "हामी आवश्यक, एनालिटिक्स र प्राथमिकता कुकीज प्रयोग गर्न सक्छौं।",
            },
            {
                title: "4. तेस्रो पक्ष कुकीज",
                body: "केही कुकीज तेस्रो पक्ष सेवाबाट आउन सक्छन्।",
            },
            {
                title: "5. कुकी व्यवस्थापन",
                body: "तपाईं ब्राउजर सेटिङबाट कुकी नियन्त्रण गर्न सक्नुहुन्छ।",
            },
            {
                title: "6. नीति अपडेट",
                body: "यो नीति परिवर्तन हुन सक्छ।",
            },
            {
                title: "7. सम्पर्क",
                body: "प्रश्न भएमा हामीलाई सम्पर्क गर्नुहोस्।",
            },
        ],
    },

    zh: {
        title: "Cookies 政策",
        updated: "最后更新：2026",
        badge: "隐私与 Cookies",
        subtitle:
            "本政策说明 HKMandu 如何使用 Cookies 来改善浏览体验、记住偏好设置，并确保平台顺畅运行。",

        highlights: [
            "用于改善网站功能",
            "帮助记住您的偏好",
            "可通过浏览器设置管理",
        ],

        sections: [
            {
                title: "1. 什么是 Cookies",
                body: "Cookies 是存储在您设备上的小型文本文件。",
            },
            {
                title: "2. 我们如何使用 Cookies",
                body: "HKMandu 使用 Cookies 提升用户体验和网站性能。",
            },
            {
                title: "3. Cookies 类型",
                body: "包括必要、分析和偏好 Cookies。",
            },
            {
                title: "4. 第三方 Cookies",
                body: "部分 Cookies 来自第三方服务。",
            },
            {
                title: "5. 管理 Cookies",
                body: "您可以通过浏览器设置控制 Cookies。",
            },
            {
                title: "6. 政策更新",
                body: "政策可能随时更新。",
            },
            {
                title: "7. 联系我们",
                body: "如有问题请联系我们。",
            },
        ],
    },
};

const sectionIcons = [Cookie, Settings, BarChart3, ShieldCheck, Settings, RefreshCw, Mail];

export default function CookiesPolicyPage({ locale = "en" }) {
    const t = content[locale] || content.en;

    return (
        <main className="bg-white">
            <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-blue-50">
                <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl" />
                <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl" />

                <div className="relative mx-auto max-w-5xl px-4 py-14 sm:px-6 md:py-16 lg:px-8 lg:py-20">
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#1a4b8f] shadow-sm">
                            <Cookie className="h-4 w-4" />
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
                            const Icon = sectionIcons[index] || Cookie;

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