"use client";

const content = {
    en: {
        title: "Cookies Policy",
        updated: "Last updated: 2026",

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

export default function CookiesPolicyPage({ locale = "en" }) {
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