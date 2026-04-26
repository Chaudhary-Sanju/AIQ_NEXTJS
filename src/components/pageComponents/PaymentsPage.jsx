"use client";

const content = {
    en: {
        title: "Payments Policy",
        updated: "Last updated: 2026",
        sections: [
            {
                title: "1. Overview",
                body: "HKMandu accepts payments for product orders, courier requests, delivery services, and professional service bookings.",
            },
            {
                title: "2. Accepted Payment Methods",
                body: "Available payment methods may include cash, bank transfer, online payment, or other supported options shown during checkout or service confirmation.",
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
                title: "5. Bank Transfer",
                body: "For bank transfer payments, customers may be required to provide proof of payment. Processing may be delayed until payment is verified.",
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
                body: "Refund eligibility depends on the product, service, courier status, cancellation timing, and applicable policy. Approved refunds may take time to process.",
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
        sections: [
            {
                title: "1. परिचय",
                body: "HKMandu ले उत्पादन अर्डर, कुरियर अनुरोध, डेलिभरी सेवा र व्यावसायिक सेवा बुकिङका लागि भुक्तानी स्वीकार गर्दछ।",
            },
            {
                title: "2. स्वीकार गरिने भुक्तानी माध्यम",
                body: "भुक्तानी माध्यममा नगद, बैंक ट्रान्सफर, अनलाइन भुक्तानी वा checkout/सेवा पुष्टि गर्दा देखाइएका अन्य विकल्पहरू हुन सक्छन्।",
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
                title: "5. बैंक ट्रान्सफर",
                body: "बैंक ट्रान्सफरका लागि ग्राहकले भुक्तानी प्रमाण पठाउनुपर्ने हुन सक्छ। भुक्तानी प्रमाणित नभएसम्म प्रक्रिया ढिलो हुन सक्छ।",
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
                body: "Refund योग्यता उत्पादन, सेवा, कुरियर स्थिति, cancellation समय र लागू नीतिमा निर्भर हुन्छ। स्वीकृत refund process हुन समय लाग्न सक्छ।",
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
        sections: [
            {
                title: "1. 概述",
                body: "HKMandu 接受商品订单、快递请求、配送服务和专业服务预约的付款。",
            },
            {
                title: "2. 可接受的付款方式",
                body: "付款方式可能包括现金、银行转账、在线付款，或结账/服务确认时显示的其他支持方式。",
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
                title: "5. 银行转账",
                body: "银行转账付款可能需要客户提供付款证明。在付款验证前，处理可能会延迟。",
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
                body: "退款资格取决于商品、服务、快递状态、取消时间和适用政策。批准的退款可能需要时间处理。",
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

export default function PaymentsPage({ locale = "en" }) {
    const t = content[locale] || content.en;

    return (
        <main className="bg-white">
            <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-black text-neutral-950">{t.title}</h1>

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