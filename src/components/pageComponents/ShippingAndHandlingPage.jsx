"use client";

import {
    Truck,
    MapPin,
    Clock,
    PackageCheck,
    Ban,
    Landmark,
    Box,
    AlertTriangle,
    ShoppingBag,
    Mail,
    CheckCircle2,
} from "lucide-react";

const content = {
    en: {
        title: "Shipping & Handling",
        updated: "Last updated: 2026",
        badge: "Shipping Policy",
        subtitle:
            "This policy explains how HKMandu handles shipping, delivery, courier, packaging, and product-order logistics between Hong Kong and Nepal.",

        highlights: [
            "Delivery time may vary by route and logistics conditions",
            "Customers must provide accurate parcel information",
            "International shipments may involve customs or duties",
        ],

        sections: [
            {
                title: "1. Overview",
                body: "HKMandu provides shipping, delivery, courier, and handling support for eligible parcels, products, and service-related items between Hong Kong and Nepal.",
            },
            {
                title: "2. Pickup & Drop-off",
                body: "Pickup or drop-off availability may depend on your location, order type, parcel size, and selected service. Our team may contact you to confirm details before processing.",
            },
            {
                title: "3. Delivery Time",
                body: "Delivery times are estimates only and may vary due to customs, weather, public holidays, logistics delays, incorrect information, or other external conditions.",
            },
            {
                title: "4. Parcel Information",
                body: "Customers must provide accurate sender, receiver, address, phone number, item details, weight, and value information. Incorrect details may cause delay or cancellation.",
            },
            {
                title: "5. Prohibited Items",
                body: "Customers must not send prohibited, restricted, illegal, dangerous, fragile without declaration, or customs-restricted items. HKMandu may reject parcels that do not meet requirements.",
            },
            {
                title: "6. Customs & Duties",
                body: "International shipments may be subject to customs checks, duties, taxes, or additional charges. These are the responsibility of the sender or receiver unless otherwise agreed.",
            },
            {
                title: "7. Handling & Packaging",
                body: "Customers are responsible for proper packaging unless packaging service is specifically requested. HKMandu is not responsible for damage caused by poor or unsafe packaging.",
            },
            {
                title: "8. Lost, Delayed, or Damaged Items",
                body: "If an item is lost, delayed, or damaged, please contact us as soon as possible. Resolution depends on shipment type, declared value, evidence provided, and courier partner policies.",
            },
            {
                title: "9. Product Orders",
                body: "For marketplace product orders, delivery options, charges, and timing may vary depending on product availability, destination, and logistics conditions.",
            },
            {
                title: "10. Contact",
                body: "For shipping or handling questions, please contact HKMandu by phone, email, or WhatsApp.",
            },
        ],
    },

    ne: {
        title: "शिपिङ तथा ह्यान्डलिङ",
        updated: "अन्तिम अपडेट: 2026",
        badge: "शिपिङ नीति",
        subtitle:
            "यो नीतिले HKMandu ले Hong Kong र Nepal बीच शिपिङ, डेलिभरी, कुरियर, प्याकेजिङ र उत्पादन अर्डर logistics कसरी व्यवस्थापन गर्छ भन्ने जानकारी दिन्छ।",

        highlights: [
            "डेलिभरी समय रुट र logistics अवस्थाअनुसार फरक हुन सक्छ",
            "ग्राहकले सही पार्सल जानकारी उपलब्ध गराउनुपर्छ",
            "अन्तर्राष्ट्रिय शिपमेन्टमा भन्सार वा शुल्क लाग्न सक्छ",
        ],

        sections: [
            {
                title: "1. परिचय",
                body: "HKMandu ले Hong Kong र Nepal बीच योग्य पार्सल, उत्पादन र सेवा सम्बन्धी वस्तुहरूको शिपिङ, डेलिभरी, कुरियर र ह्यान्डलिङ सहयोग प्रदान गर्दछ।",
            },
            {
                title: "2. पिकअप र ड्रप-अफ",
                body: "पिकअप वा ड्रप-अफ उपलब्धता स्थान, अर्डर प्रकार, पार्सल साइज र छनोट गरिएको सेवामा निर्भर हुन सक्छ।",
            },
            {
                title: "3. डेलिभरी समय",
                body: "डेलिभरी समय अनुमानित मात्र हो। भन्सार, मौसम, सार्वजनिक बिदा, गलत जानकारी वा अन्य बाह्य कारणले ढिलाइ हुन सक्छ।",
            },
            {
                title: "4. पार्सल जानकारी",
                body: "ग्राहकले पठाउने र पाउने व्यक्तिको सही नाम, ठेगाना, फोन नम्बर, वस्तुको विवरण, तौल र मूल्य जानकारी दिनुपर्छ।",
            },
            {
                title: "5. निषेधित वस्तुहरू",
                body: "ग्राहकले निषेधित, प्रतिबन्धित, गैरकानुनी, खतरनाक वा भन्सारले रोक लगाएका वस्तु पठाउन मिल्दैन।",
            },
            {
                title: "6. भन्सार र शुल्क",
                body: "अन्तर्राष्ट्रिय शिपमेन्टमा भन्सार जाँच, कर वा थप शुल्क लाग्न सक्छ। यस्ता शुल्क पठाउने वा पाउने व्यक्तिको जिम्मेवारी हुनेछ।",
            },
            {
                title: "7. ह्यान्डलिङ र प्याकेजिङ",
                body: "प्याकेजिङ सेवा अलगै अनुरोध नगरिएको अवस्थामा ग्राहक आफैंले सुरक्षित प्याकेजिङ गर्नुपर्छ। कमजोर प्याकेजिङका कारण भएको क्षतिका लागि HKMandu जिम्मेवार हुने छैन।",
            },
            {
                title: "8. हराएको, ढिलो वा क्षति भएको वस्तु",
                body: "वस्तु हराए, ढिलो भए वा क्षति भए तुरुन्त सम्पर्क गर्नुहोस्। समाधान शिपमेन्ट प्रकार, घोषणा गरिएको मूल्य, प्रमाण र कुरियर पार्टनर नीतिमा निर्भर हुन्छ।",
            },
            {
                title: "9. उत्पादन अर्डर",
                body: "मार्केटप्लेस उत्पादन अर्डरका लागि डेलिभरी विकल्प, शुल्क र समय उत्पादन उपलब्धता, गन्तव्य र logistics अवस्थाअनुसार फरक हुन सक्छ।",
            },
            {
                title: "10. सम्पर्क",
                body: "शिपिङ वा ह्यान्डलिङ सम्बन्धी प्रश्न भए HKMandu लाई फोन, इमेल वा WhatsApp मार्फत सम्पर्क गर्नुहोस्।",
            },
        ],
    },

    zh: {
        title: "运输与处理政策",
        updated: "最后更新：2026",
        badge: "运输政策",
        subtitle:
            "本政策说明 HKMandu 如何处理香港与尼泊尔之间的运输、配送、快递、包装和商品订单物流。",

        highlights: [
            "配送时间可能因路线和物流情况而变化",
            "客户必须提供准确的包裹信息",
            "国际运输可能涉及海关或税费",
        ],

        sections: [
            {
                title: "1. 概述",
                body: "HKMandu 为香港与尼泊尔之间符合条件的包裹、商品和服务相关物品提供运输、配送、快递和处理支持。",
            },
            {
                title: "2. 取件与交付",
                body: "取件或交付服务可能取决于您的位置、订单类型、包裹尺寸和所选服务。",
            },
            {
                title: "3. 配送时间",
                body: "配送时间仅为预估，可能因海关、天气、公众假期、物流延误、错误信息或其他外部因素而变化。",
            },
            {
                title: "4. 包裹信息",
                body: "客户必须提供准确的寄件人、收件人、地址、电话、物品详情、重量和价值信息。",
            },
            {
                title: "5. 禁寄物品",
                body: "客户不得寄送违禁、受限制、非法、危险或海关限制的物品。HKMandu 有权拒收不符合要求的包裹。",
            },
            {
                title: "6. 海关与税费",
                body: "国际运输可能需要海关检查、关税、税费或其他费用，除非另有约定，否则由寄件人或收件人承担。",
            },
            {
                title: "7. 处理与包装",
                body: "除非特别申请包装服务，否则客户应负责妥善包装。因包装不当造成的损坏，HKMandu 不承担责任。",
            },
            {
                title: "8. 遗失、延误或损坏",
                body: "如物品遗失、延误或损坏，请尽快联系我们。处理结果取决于运输类型、申报价值、证据和快递合作方政策。",
            },
            {
                title: "9. 商品订单",
                body: "商城商品订单的配送方式、费用和时间可能因商品库存、目的地和物流情况而有所不同。",
            },
            {
                title: "10. 联系我们",
                body: "如有运输或处理相关问题，请通过电话、电子邮件或 WhatsApp 联系 HKMandu。",
            },
        ],
    },
};

const sectionIcons = [
    Truck,
    MapPin,
    Clock,
    PackageCheck,
    Ban,
    Landmark,
    Box,
    AlertTriangle,
    ShoppingBag,
    Mail,
];

export default function ShippingAndHandlingPage({ locale = "en" }) {
    const t = content[locale] || content.en;

    return (
        <main className="bg-white">
            <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-blue-50">
                <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl" />
                <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl" />

                <div className="relative mx-auto max-w-5xl px-4 py-14 sm:px-6 md:py-16 lg:px-8 lg:py-20">
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#1a4b8f] shadow-sm">
                            <Truck className="h-4 w-4" />
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
                            const Icon = sectionIcons[index] || Truck;

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