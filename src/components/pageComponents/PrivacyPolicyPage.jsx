"use client";

import {
    ShieldCheck,
    UserRound,
    LockKeyhole,
    Share2,
    Cookie,
    Database,
    FileText,
    RefreshCw,
    Mail,
    CheckCircle2,
    Settings,
} from "lucide-react";

const content = {
    en: {
        title: "Privacy Policy",
        updated: "Last updated: 2026",
        badge: "Privacy & Data",
        subtitle:
            "This policy explains how HKMandu collects, uses, protects, and manages your personal information when you use our platform.",

        highlights: [
            "We do not sell your personal data",
            "Your information is used to provide better services",
            "You can request access, updates, or deletion",
        ],

        sections: [
            {
                title: "1. Introduction",
                body: "HKMandu respects your privacy and is committed to protecting your personal information when you use our platform.",
            },
            {
                title: "2. Information We Collect",
                body: "We may collect your name, email, phone number, address, and any details you provide when using our services, placing orders, or contacting us.",
            },
            {
                title: "3. How We Use Information",
                body: "Your information is used to provide services, process orders, improve user experience, and communicate updates or support.",
            },
            {
                title: "4. Sharing of Information",
                body: "We do not sell your personal data. Information may be shared with service providers (e.g., delivery, payment, or service partners) only when necessary.",
            },
            {
                title: "5. Data Security",
                body: "We take reasonable measures to protect your data, but no system is completely secure.",
            },
            {
                title: "6. Cookies & Tracking",
                body: "We may use cookies to improve website functionality and user experience.",
            },
            {
                title: "7. Your Rights",
                body: "You have the right to access, update, or request deletion of your personal data.",
            },
            {
                title: "8. Third-Party Services",
                body: "Our platform may include links or integrations with third-party services, which have their own privacy policies.",
            },
            {
                title: "9. Changes to Policy",
                body: "We may update this privacy policy at any time. Continued use of the platform means acceptance of changes.",
            },
            {
                title: "10. Contact Us",
                body: "For any privacy-related concerns, please contact us via phone, email, or WhatsApp.",
            },
        ],
    },

    ne: {
        title: "गोपनीयता नीति",
        updated: "अन्तिम अपडेट: 2026",
        badge: "गोपनीयता र डेटा",
        subtitle:
            "यो नीतिले HKMandu ले तपाईंको व्यक्तिगत जानकारी कसरी सङ्कलन, प्रयोग, सुरक्षित र व्यवस्थापन गर्छ भन्ने जानकारी दिन्छ।",

        highlights: [
            "हामी तपाईंको व्यक्तिगत डेटा बेच्दैनौं",
            "सेवा सुधार गर्न जानकारी प्रयोग गरिन्छ",
            "तपाईं डेटा हेर्न, सच्याउन वा मेटाउन अनुरोध गर्न सक्नुहुन्छ",
        ],

        sections: [
            {
                title: "1. परिचय",
                body: "HKMandu तपाईंको गोपनीयताको सम्मान गर्दछ र तपाईंको व्यक्तिगत जानकारी सुरक्षित राख्न प्रतिबद्ध छ।",
            },
            {
                title: "2. हामीले सङ्कलन गर्ने जानकारी",
                body: "हामी तपाईंको नाम, इमेल, फोन नम्बर, ठेगाना र अन्य विवरण सङ्कलन गर्न सक्छौं।",
            },
            {
                title: "3. जानकारीको प्रयोग",
                body: "सेवा प्रदान गर्न, अर्डर प्रक्रिया गर्न, र प्रयोगकर्ता अनुभव सुधार गर्न जानकारी प्रयोग गरिन्छ।",
            },
            {
                title: "4. जानकारी साझेदारी",
                body: "हामी तपाईंको जानकारी बेच्दैनौं। आवश्यक पर्दा मात्र साझेदारहरूसँग साझा गरिन्छ।",
            },
            {
                title: "5. डेटा सुरक्षा",
                body: "हामी डेटा सुरक्षित राख्न प्रयास गर्छौं तर पूर्ण रूपमा सुरक्षित प्रणाली हुँदैन।",
            },
            {
                title: "6. कुकीज",
                body: "वेबसाइट सुधारका लागि कुकी प्रयोग हुन सक्छ।",
            },
            {
                title: "7. तपाईंका अधिकार",
                body: "तपाईं आफ्नो डेटा हेर्न, सच्याउन वा मेटाउन अनुरोध गर्न सक्नुहुन्छ।",
            },
            {
                title: "8. तेस्रो पक्ष सेवा",
                body: "तेस्रो पक्ष सेवाहरूको आफ्नै गोपनीयता नीति हुन्छ।",
            },
            {
                title: "9. नीति परिवर्तन",
                body: "यो नीति परिवर्तन हुन सक्छ।",
            },
            {
                title: "10. सम्पर्क",
                body: "गोपनीयता सम्बन्धी प्रश्नका लागि सम्पर्क गर्नुहोस्।",
            },
        ],
    },

    zh: {
        title: "隐私政策",
        updated: "最后更新：2026",
        badge: "隐私与数据",
        subtitle:
            "本政策说明 HKMandu 在您使用平台时如何收集、使用、保护和管理您的个人信息。",

        highlights: [
            "我们不会出售您的个人数据",
            "您的信息用于提供更好的服务",
            "您可以请求访问、更新或删除数据",
        ],

        sections: [
            {
                title: "1. 介绍",
                body: "HKMandu 重视您的隐私并保护您的个人信息。",
            },
            {
                title: "2. 收集的信息",
                body: "我们可能收集您的姓名、邮箱、电话和地址等信息。",
            },
            {
                title: "3. 信息使用",
                body: "用于提供服务、处理订单和提升体验。",
            },
            {
                title: "4. 信息共享",
                body: "我们不会出售您的数据，仅在必要时共享。",
            },
            {
                title: "5. 数据安全",
                body: "我们采取合理措施保护数据。",
            },
            {
                title: "6. Cookies",
                body: "用于改善用户体验。",
            },
            {
                title: "7. 用户权利",
                body: "您可以访问或删除您的数据。",
            },
            {
                title: "8. 第三方服务",
                body: "第三方服务有独立隐私政策。",
            },
            {
                title: "9. 政策变更",
                body: "政策可能更新。",
            },
            {
                title: "10. 联系我们",
                body: "如有问题请联系我们。",
            },
        ],
    },
};

const sectionIcons = [
    ShieldCheck,
    UserRound,
    Settings,
    Share2,
    LockKeyhole,
    Cookie,
    Database,
    FileText,
    RefreshCw,
    Mail,
];

export default function PrivacyPolicyPage({ locale = "en" }) {
    const t = content[locale] || content.en;

    return (
        <main className="bg-white">
            <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-blue-50">
                <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl" />
                <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl" />

                <div className="relative mx-auto max-w-5xl px-4 py-14 sm:px-6 md:py-16 lg:px-8 lg:py-20">
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#1a4b8f] shadow-sm">
                            <ShieldCheck className="h-4 w-4" />
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
                            const Icon = sectionIcons[index] || ShieldCheck;

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