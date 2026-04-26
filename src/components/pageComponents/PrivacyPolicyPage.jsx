"use client";

const content = {
    en: {
        title: "Privacy Policy",
        updated: "Last updated: 2026",

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

export default function PrivacyPolicyPage({ locale = "en" }) {
    const t = content[locale] || content.en;

    return (
        <main className="bg-white">
            <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-black text-neutral-950">
                    {t.title}
                </h1>

                <p className="mt-3 text-sm text-neutral-500">{t.updated}</p>

                <div className="mt-10 space-y-8">
                    {t.sections.map((section) => (
                        <div key={section.title}>
                            <h2 className="text-xl font-bold text-neutral-900">
                                {section.title}
                            </h2>

                            <p className="mt-2 text-sm leading-7 text-neutral-600">
                                {section.body}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}