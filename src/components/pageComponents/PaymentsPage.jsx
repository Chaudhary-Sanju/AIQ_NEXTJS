"use client";

import Link from "next/link";
import {
    CreditCard,
    Wallet,
    CheckCircle2,
    BadgeDollarSign,
    Landmark,
    AlertCircle,
    ReceiptText,
    RefreshCw,
    ShieldCheck,
    Mail,
    PackageCheck,
} from "lucide-react";

const content = {
    en: {
        title: "Payments Policy",
        updated: "Last updated: 2026",
        badge: "Payments & Billing",
        subtitle:
            "This policy explains how HKMandu handles payments for product orders, courier requests, delivery services, and professional service bookings.",

        highlights: [
            "Payment methods are shown during checkout or confirmation",
            "Orders may be processed after payment is verified",
            "Refund eligibility depends on product or service status",
        ],

        sections: [
            {
                title: "1. Overview",
                body: "HKMandu accepts payments for product orders, courier requests, delivery services, and professional service bookings.",
            },
            {
                title: "2. Accepted Payment Methods",
                body: "Supported payment methods include PaymentAsia, Stripe, and Cash on Delivery where available. The methods shown at checkout may depend on the order type, customer status, destination, and service availability.",
            },
            {
                title: "3. Payment Confirmation",
                body: "Orders or service requests may only be processed after payment is received, verified, or confirmed by HKMandu.",
            },
            {
                title: "4. Pricing",
                body: "Prices may vary depending on product availability, service type, delivery route, parcel weight, distance, urgency, and other applicable charges.",
            },
            {
                title: "5. Payment Providers",
                body: "PaymentAsia and Stripe payments are processed through their respective payment systems. HKMandu may rely on the processor's payment status before confirming an order. Cash on Delivery is collected when the eligible order is delivered.",
            },
            {
                title: "6. Failed or Pending Payments",
                body: "If payment fails, remains pending, or cannot be verified, HKMandu may delay, cancel, or hold the order or service request.",
            },
            {
                title: "7. Additional Charges",
                body: "Additional fees such as customs duties, taxes, packaging, handling, delivery adjustments, or third-party charges may apply where relevant.",
            },
            {
                title: "8. Refunds",
                body: "Refund eligibility depends on the product or service, fulfilment status, cancellation timing, and the applicable Refund & Return Policy. Approved refunds are processed according to the original payment method and payment-provider rules.",
            },
            {
                title: "9. Payment Security",
                body: "HKMandu takes reasonable steps to keep payment-related information secure. Customers should avoid sharing sensitive payment details through unsecured channels.",
            },
            {
                title: "10. Contact",
                body: "For payment-related questions, please contact HKMandu by phone, email, or WhatsApp.",
            },
        ],
    },

    ne: {
        title: "भुक्तानी नीति",
        updated: "अन्तिम अपडेट: 2026",
        badge: "भुक्तानी र बिलिङ",
        subtitle:
            "यो नीतिले HKMandu ले उत्पादन अर्डर, कुरियर अनुरोध, डेलिभरी सेवा र व्यावसायिक सेवा बुकिङका भुक्तानी कसरी व्यवस्थापन गर्छ भन्ने जानकारी दिन्छ।",

        highlights: [
            "भुक्तानी विकल्प checkout वा पुष्टि समयमा देखाइन्छ",
            "भुक्तानी प्रमाणित भएपछि अर्डर प्रक्रिया हुन सक्छ",
            "Refund योग्यता उत्पादन वा सेवाको स्थितिमा निर्भर हुन्छ",
        ],

        sections: [
            {
                title: "1. परिचय",
                body: "HKMandu ले उत्पादन अर्डर, कुरियर अनुरोध, डेलिभरी सेवा र व्यावसायिक सेवा बुकिङका लागि भुक्तानी स्वीकार गर्दछ।",
            },
            {
                title: "2. स्वीकार गरिने भुक्तानी माध्यम",
                body: "समर्थित भुक्तानी माध्यममा उपलब्धताअनुसार PaymentAsia, Stripe र Cash on Delivery पर्छन्। Checkout मा देखिने विकल्प order type, customer status, destination र service availability अनुसार फरक हुन सक्छ।",
            },
            {
                title: "3. भुक्तानी पुष्टि",
                body: "अर्डर वा सेवा अनुरोध HKMandu ले भुक्तानी प्राप्त, प्रमाणित वा पुष्टि गरेपछि मात्र प्रक्रिया हुन सक्छ।",
            },
            {
                title: "4. मूल्य",
                body: "मूल्य उत्पादन उपलब्धता, सेवा प्रकार, डेलिभरी रुट, पार्सल तौल, दूरी, urgency र अन्य शुल्कअनुसार फरक हुन सक्छ।",
            },
            {
                title: "5. Payment Providers",
                body: "PaymentAsia र Stripe भुक्तानी सम्बन्धित payment system मार्फत process हुन्छ। Order confirm गर्नु अघि HKMandu ले processor को payment status मा निर्भर गर्न सक्छ। Eligible Cash on Delivery order मा delivery समयमा cash संकलन गरिन्छ।",
            },
            {
                title: "6. असफल वा Pending भुक्तानी",
                body: "भुक्तानी असफल, pending वा प्रमाणित गर्न नसकिने भए HKMandu ले अर्डर वा सेवा अनुरोध ढिलो, रद्द वा hold गर्न सक्छ।",
            },
            {
                title: "7. थप शुल्क",
                body: "भन्सार शुल्क, कर, प्याकेजिङ, ह्यान्डलिङ, डेलिभरी adjustment वा तेस्रो पक्ष शुल्क लागू हुन सक्छ।",
            },
            {
                title: "8. Refund",
                body: "Refund eligibility उत्पादन वा सेवा, fulfilment status, cancellation समय र लागू Refund & Return Policy मा निर्भर हुन्छ। स्वीकृत refund मूल payment method र payment-provider rules अनुसार process हुन्छ।",
            },
            {
                title: "9. भुक्तानी सुरक्षा",
                body: "HKMandu ले भुक्तानी सम्बन्धी जानकारी सुरक्षित राख्न उचित प्रयास गर्दछ। ग्राहकले असुरक्षित माध्यमबाट संवेदनशील जानकारी share गर्नु हुँदैन।",
            },
            {
                title: "10. सम्पर्क",
                body: "भुक्तानी सम्बन्धी प्रश्नका लागि HKMandu लाई फोन, इमेल वा WhatsApp मार्फत सम्पर्क गर्नुहोस्।",
            },
        ],
    },

    zh: {
        title: "付款政策",
        updated: "最后更新：2026",
        badge: "付款与账单",
        subtitle:
            "本政策说明 HKMandu 如何处理商品订单、快递请求、配送服务和专业服务预约的付款。",

        highlights: [
            "付款方式会在结账或确认时显示",
            "付款验证后订单可能才会处理",
            "退款资格取决于商品或服务状态",
        ],

        sections: [
            {
                title: "1. 概述",
                body: "HKMandu 接受商品订单、快递请求、配送服务和专业服务预约的付款。",
            },
            {
                title: "2. 可接受的付款方式",
                body: "支援的付款方式包括在適用情況下使用 PaymentAsia、Stripe 及貨到付款。結帳時顯示的方式可能視訂單類型、客戶狀態、目的地及服務供應情況而有所不同。",
            },
            {
                title: "3. 付款确认",
                body: "订单或服务请求可能仅在 HKMandu 收到、验证或确认付款后处理。",
            },
            {
                title: "4. 价格",
                body: "价格可能因商品库存、服务类型、配送路线、包裹重量、距离、紧急程度和其他适用费用而变化。",
            },
            {
                title: "5. 付款服務供應商",
                body: "PaymentAsia 及 Stripe 付款會透過各自的付款系統處理。HKMandu 可在確認訂單前依據付款服務供應商的交易狀態。合資格的貨到付款訂單會在送達時收取現金。",
            },
            {
                title: "6. 失败或待处理付款",
                body: "如果付款失败、待处理或无法验证，HKMandu 可能会延迟、取消或暂停订单或服务请求。",
            },
            {
                title: "7. 额外费用",
                body: "在相关情况下，可能会产生海关税费、包装费、处理费、配送调整费或第三方费用。",
            },
            {
                title: "8. 退款",
                body: "退款資格取決於商品或服務、履行狀態、取消時間及適用的退款及退貨政策。獲批退款會按原付款方式及付款服務供應商規則處理。",
            },
            {
                title: "9. 付款安全",
                body: "HKMandu 会采取合理措施保护付款相关信息。客户应避免通过不安全渠道分享敏感付款信息。",
            },
            {
                title: "10. 联系我们",
                body: "如有付款相关问题，请通过电话、电子邮件或 WhatsApp 联系 HKMandu。",
            },
        ],
    },
};

const sectionIcons = [
    CreditCard,
    Wallet,
    CheckCircle2,
    BadgeDollarSign,
    Landmark,
    AlertCircle,
    ReceiptText,
    RefreshCw,
    ShieldCheck,
    Mail,
];

export default function PaymentsPage({ locale = "en" }) {
    const t = content[locale] || content.en;

    return (
        <main className="bg-white">
            <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-blue-50">
                <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl" />
                <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl" />

                <div className="relative mx-auto max-w-5xl px-4 py-14 sm:px-6 md:py-16 lg:px-8 lg:py-20">
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#1a4b8f] shadow-sm">
                            <CreditCard className="h-4 w-4" />
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
                                    <PackageCheck className="h-4 w-4" />
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
                            const Icon = sectionIcons[index] || CreditCard;

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

                    <div className="mt-7 flex justify-center">
                        <Link
                            href={`/${locale}/support/refund-policy`}
                            className="inline-flex items-center gap-2 rounded-full bg-[#1a4b8f] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#153f78]"
                        >
                            <RefreshCw className="h-4 w-4" />
                            {locale === "ne"
                                ? "पूर्ण रिफन्ड नीति हेर्नुहोस्"
                                : locale === "zh"
                                  ? "查看完整退款政策"
                                  : "View full Refund & Return Policy"}
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}