"use client";

const content = {
    en: {
        title: "Terms & Conditions",
        updated: "Last updated: 2026",

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

export default function TermsPage({ locale = "en" }) {
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