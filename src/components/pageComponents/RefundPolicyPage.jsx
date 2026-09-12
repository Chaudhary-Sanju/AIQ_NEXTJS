"use client";

import {
    RefreshCw,
    CalendarDays,
    PackageCheck,
    Ban,
    UtensilsCrossed,
    Truck,
    BriefcaseBusiness,
    CreditCard,
    WalletCards,
    Banknote,
    ReceiptText,
    ClipboardCheck,
    Clock3,
    ShieldCheck,
    Mail,
    CheckCircle2,
    AlertTriangle,
} from "lucide-react";

const content = {
    en: {
        title: "Refund & Return Policy",
        updated: "Last updated: September 12, 2026",
        badge: "Returns & Refunds",
        subtitle:
            "This policy explains when HKMandu may approve a return, cancellation, exchange, full refund, or partial refund for marketplace products, restaurant orders, courier services, and professional services.",
        highlights: [
            "Eligible physical-product requests should be made within 7 calendar days of receipt",
            "Items must normally be unused and returned with original packaging and included accessories",
            "Approved online-payment refunds are sent through the original PaymentAsia or Stripe payment route",
        ],
        paymentTitle: "How approved refunds are paid",
        paymentSubtitle:
            "The refund route depends on how the original order was paid. Bank or wallet processing times are outside HKMandu's direct control.",
        paymentMethods: [
            {
                name: "PaymentAsia",
                description:
                    "HKMandu will initiate an approved refund through PaymentAsia for the original transaction. The refund is normally returned through the supported payment channel used for that transaction. We do not separately refund a PaymentAsia transaction in cash unless an alternative resolution is required or permitted by the payment provider.",
            },
            {
                name: "Stripe",
                description:
                    "Approved Stripe refunds are sent back to the original payment method. For card payments, the credit commonly appears about 5–10 business days after the refund is initiated, depending on the customer's bank or card issuer.",
            },
            {
                name: "Cash / Cash on Delivery",
                description:
                    "Approved cash refunds may be returned in cash after order and recipient verification. Where a cash handover is impractical, HKMandu and the customer may agree to a bank transfer or another reasonable refund method.",
            },
        ],
        sections: [
            {
                title: "1. Scope",
                body: "This policy applies to eligible purchases and services paid to HKMandu, including marketplace products, restaurant or food orders, courier and delivery services, and professional service bookings. A supplier, restaurant, courier partner, or service provider may also have category-specific conditions shown before purchase.",
            },
            {
                title: "2. When a Refund May Be Approved",
                body: "A refund, exchange, replacement, or other remedy may be considered when an item is faulty, defective, materially damaged before delivery, different from what was ordered, delivered in an incorrect quantity, missing from a paid order, charged more than once, cancelled while still eligible for cancellation, or when an agreed paid service is not provided. HKMandu may request photos, video, packaging, receipts, delivery records, or other evidence.",
            },
            {
                title: "3. Product Return Window & Conditions",
                body: "For eligible physical products, please submit the return or refund request within 7 calendar days after receiving the item. Unless the problem itself requires opening the product, the item should be unused and in its original condition, with original packaging, labels, manuals, accessories, gifts, and other included parts. Proof of the related order or payment may be required.",
            },
            {
                title: "4. Non-Returnable or Non-Refundable Cases",
                body: "A change-of-mind return may be refused for opened or used goods, goods missing original packaging or included parts, products marked non-returnable or final sale, personalised or made-to-order items, hygiene-sensitive products once opened, perishable goods, free gifts or samples on their own, damage caused after delivery by misuse or improper handling, and requests made outside the applicable period. This does not remove any rights that cannot legally be excluded.",
            },
            {
                title: "5. Restaurant & Food Orders",
                body: "Because food is perishable and often prepared specifically for an order, change-of-mind refunds are normally unavailable once preparation has started or the order has been delivered. If food is missing, incorrect, materially damaged, unsafe, or materially different from the confirmed order, contact HKMandu as soon as possible on the delivery day with the order details and supporting evidence where available.",
            },
            {
                title: "6. Courier, Delivery & Shipping Services",
                body: "A courier or delivery request cancelled before pickup, dispatch, or other committed work may be eligible for a full or partial refund. Once transportation, customs processing, packaging, pickup, or third-party logistics work has started, amounts already incurred may be non-refundable. Claims involving loss, damage, delay, or failed delivery are also subject to the shipping policy, declared value, evidence, and the applicable courier partner's terms.",
            },
            {
                title: "7. Professional Services",
                body: "For professional services, cancellation before work starts may be eligible for a refund, less any disclosed or already committed third-party costs. After work has started, any approved refund may be reduced to reflect work already completed, time spent, expenses incurred, or deliverables already supplied. Custom work already completed is normally non-refundable unless it does not materially match the agreed scope.",
            },
            {
                title: "8. Refund Method",
                body: "Approved online-payment refunds are normally returned through the same processor and original payment route used for the transaction. PaymentAsia refunds are initiated through PaymentAsia, and Stripe refunds are returned to the original payment method. Cash purchases are handled as cash refunds or another agreed method after verification. HKMandu will not ask for sensitive card credentials in order to process a refund.",
            },
            {
                title: "9. Partial Refunds, Discounts & Delivery Charges",
                body: "Where only part of an order qualifies, HKMandu may issue a partial refund for the affected item or service. Refunds are generally based on the amount actually paid after discounts or promotions. Original delivery, courier, customs, packaging, handling, or third-party charges may be non-refundable once incurred, unless the refund is required because of an error or failure attributable to HKMandu or applicable law requires otherwise.",
            },
            {
                title: "10. How to Request a Refund",
                body: "Contact HKMandu with your order number, customer name, payment method, the item or service concerned, the reason for the request, and any relevant photos or supporting documents. Do not return an item to a seller, restaurant, courier, or HKMandu location until return instructions have been confirmed, because the correct return route may depend on the order.",
            },
            {
                title: "11. Inspection & Decision",
                body: "Returned products may be inspected before a refund or exchange is approved. HKMandu may verify order records with the relevant supplier, restaurant, courier, service provider, PaymentAsia, or Stripe. If a request does not meet the applicable conditions, the return or refund may be declined and the reason will be communicated where reasonably possible.",
            },
            {
                title: "12. Refund Processing Time",
                body: "Once HKMandu approves and initiates a refund, the time for funds to appear depends on the payment channel and the customer's bank or wallet provider. Stripe card refunds commonly take around 5–10 business days to appear. PaymentAsia processing depends on the underlying supported payment channel. Cash refunds are arranged after verification. Processing delays caused by banks, card issuers, wallets, or payment networks may be outside HKMandu's control.",
            },
            {
                title: "13. Payment Disputes & Chargebacks",
                body: "If there is a problem with an order, please contact HKMandu first so we can investigate and, where appropriate, process the refund through the correct payment channel. A payment dispute or chargeback does not automatically create eligibility for a refund and may be handled under the rules of the relevant bank, card network, PaymentAsia, or Stripe.",
            },
            {
                title: "14. Contact",
                body: "For a return, cancellation, or refund request, contact HKMandu customer support and include your order reference. We may contact you for additional information needed to verify and resolve the request.",
            },
        ],
        noteTitle: "Important",
        noteBody:
            "This policy is intended to provide clear customer guidance. Category-specific terms shown on a product, restaurant, courier, or service page may apply in addition to this policy. Where applicable law gives you stronger rights, those rights continue to apply.",
    },

    ne: {
        title: "रिफन्ड तथा फिर्ता नीति",
        updated: "अन्तिम अपडेट: सेप्टेम्बर १२, २०२६",
        badge: "फिर्ता र रिफन्ड",
        subtitle:
            "यो नीतिले HKMandu मा marketplace उत्पादन, restaurant order, courier सेवा र professional service का लागि return, cancellation, exchange, full refund वा partial refund कहिले स्वीकृत हुन सक्छ भन्ने जानकारी दिन्छ।",
        highlights: [
            "योग्य भौतिक उत्पादनका अनुरोध सामान प्राप्त गरेको ७ calendar days भित्र गर्नुपर्छ",
            "सामान सामान्यतः प्रयोग नगरिएको र original packaging तथा accessories सहित हुनुपर्छ",
            "स्वीकृत online refund मूल PaymentAsia वा Stripe payment route मार्फत पठाइन्छ",
        ],
        paymentTitle: "स्वीकृत रिफन्ड कसरी फिर्ता गरिन्छ",
        paymentSubtitle:
            "रिफन्डको माध्यम मूल अर्डर कसरी भुक्तानी गरिएको थियो भन्नेमा निर्भर हुन्छ। बैंक वा wallet processing time HKMandu को प्रत्यक्ष नियन्त्रणमा हुँदैन।",
        paymentMethods: [
            {
                name: "PaymentAsia",
                description:
                    "HKMandu ले मूल transaction का लागि PaymentAsia मार्फत स्वीकृत refund सुरु गर्नेछ। सामान्यतः रकम सो transaction मा प्रयोग भएको supported payment channel मै फिर्ता जान्छ। PaymentAsia transaction लाई छुट्टै cash मा refund गरिँदैन, बाहेक payment provider ले वैकल्पिक समाधान आवश्यक वा अनुमति दिएको अवस्थामा।",
            },
            {
                name: "Stripe",
                description:
                    "स्वीकृत Stripe refund मूल payment method मै फिर्ता पठाइन्छ। Card payment मा refund सुरु भएपछि ग्राहकको bank वा card issuer अनुसार रकम देखिन करिब ५–१० business days लाग्न सक्छ।",
            },
            {
                name: "Cash / Cash on Delivery",
                description:
                    "स्वीकृत cash refund order र recipient verification पछि cash मै दिन सकिन्छ। प्रत्यक्ष cash handover व्यावहारिक नभए HKMandu र ग्राहकको सहमतिमा bank transfer वा अन्य उचित refund method प्रयोग गर्न सकिन्छ।",
            },
        ],
        sections: [
            {
                title: "1. लागू हुने क्षेत्र",
                body: "यो नीति HKMandu लाई भुक्तानी गरिएका योग्य marketplace products, restaurant वा food orders, courier/delivery services र professional service bookings मा लागू हुन्छ। Supplier, restaurant, courier partner वा service provider का category-specific conditions पनि purchase अघि देखाइएको भए लागू हुन सक्छ।",
            },
            {
                title: "2. रिफन्ड स्वीकृत हुन सक्ने अवस्था",
                body: "सामान faulty, defective, delivery अघि materially damaged, अर्डरभन्दा फरक, गलत quantity मा आएको, paid order बाट item missing भएको, duplicate charge लागेको, cancellation अझै eligible भएको, वा सहमति भएको paid service प्रदान नभएको अवस्थामा refund, exchange, replacement वा अन्य remedy विचार गर्न सकिन्छ। HKMandu ले photo, video, packaging, receipt, delivery record वा अन्य प्रमाण माग्न सक्छ।",
            },
            {
                title: "3. Product Return अवधि र सर्त",
                body: "योग्य physical product का लागि सामान प्राप्त गरेको ७ calendar days भित्र return वा refund request पठाउनुहोस्। समस्या जाँच्न product खोल्नै पर्ने अवस्था बाहेक सामान unused र original condition मा, original packaging, labels, manuals, accessories, gifts र अन्य included parts सहित हुनुपर्छ। सम्बन्धित order वा payment proof आवश्यक पर्न सक्छ।",
            },
            {
                title: "4. फिर्ता वा रिफन्ड नहुने अवस्था",
                body: "Opened/used goods, original packaging वा included parts नभएको सामान, non-returnable/final sale भनेर चिनाइएको product, personalised वा made-to-order item, खोलिसकेको hygiene-sensitive product, perishable goods, free gift/sample मात्र, delivery पछि misuse वा improper handling ले damage भएको सामान, वा लागू अवधि बाहिरको request मा change-of-mind return अस्वीकार हुन सक्छ। कानूनले हटाउन नमिल्ने ग्राहक अधिकार भने यथावत रहन्छ।",
            },
            {
                title: "5. Restaurant तथा Food Orders",
                body: "Food perishable हुने र order अनुसार तयार गरिने भएकाले preparation सुरु भएपछि वा delivery भएपछि change-of-mind refund सामान्यतः उपलब्ध हुँदैन। Food missing, incorrect, materially damaged, unsafe वा confirmed order भन्दा materially फरक भए delivery भएको दिन सकेसम्म चाँडो order details र उपलब्ध प्रमाणसहित HKMandu लाई सम्पर्क गर्नुहोस्।",
            },
            {
                title: "6. Courier, Delivery तथा Shipping Services",
                body: "Pickup, dispatch वा अन्य committed work सुरु हुनुअघि cancel गरिएको courier/delivery request full वा partial refund का लागि योग्य हुन सक्छ। Transportation, customs processing, packaging, pickup वा third-party logistics work सुरु भएपछि लागिसकेको खर्च non-refundable हुन सक्छ। Loss, damage, delay वा failed delivery claim मा shipping policy, declared value, प्रमाण र courier partner का terms पनि लागू हुन्छन्।",
            },
            {
                title: "7. Professional Services",
                body: "काम सुरु हुनुअघि service cancel भए disclosed वा already committed third-party costs कटाएर refund योग्य हुन सक्छ। काम सुरु भएपछि स्वीकृत refund मा completed work, spent time, incurred expenses वा delivered output को मूल्य घटाउन सकिन्छ। सहमत scope सँग materially नमिलेसम्म completed custom work सामान्यतः non-refundable हुन्छ।",
            },
            {
                title: "8. रिफन्डको माध्यम",
                body: "स्वीकृत online-payment refund सामान्यतः transaction मा प्रयोग भएको उही processor र original payment route मार्फत फिर्ता हुन्छ। PaymentAsia refund PaymentAsia बाट initiate गरिन्छ र Stripe refund original payment method मा फर्काइन्छ। Cash purchase को refund verification पछि cash वा सहमति भएको method बाट हुन्छ। Refund process गर्न HKMandu ले sensitive card credentials माग्दैन।",
            },
            {
                title: "9. Partial Refund, Discount तथा Delivery Charges",
                body: "Order को केही भाग मात्र eligible भए प्रभावित item वा service का लागि partial refund हुन सक्छ। Refund सामान्यतः discount/promotion पछि वास्तवमा तिरेको रकममा आधारित हुन्छ। Original delivery, courier, customs, packaging, handling वा third-party charges खर्च भइसकेपछि non-refundable हुन सक्छन्, तर HKMandu को गल्ती/सेवा failure वा लागू कानूनले refund मागेको अवस्थामा फरक हुन सक्छ।",
            },
            {
                title: "10. रिफन्ड कसरी माग्ने",
                body: "Order number, customer name, payment method, सम्बन्धित item/service, refund को कारण र आवश्यक photo/document सहित HKMandu लाई सम्पर्क गर्नुहोस्। Return instruction confirm नभएसम्म seller, restaurant, courier वा HKMandu location मा सामान नफर्काउनुहोस्, किनकि सही return route order अनुसार फरक हुन सक्छ।",
            },
            {
                title: "11. जाँच तथा निर्णय",
                body: "Refund वा exchange approve गर्नु अघि returned product जाँच हुन सक्छ। HKMandu ले supplier, restaurant, courier, service provider, PaymentAsia वा Stripe सँग order record verify गर्न सक्छ। लागू condition पूरा नभए request decline हुन सक्छ र सम्भव भएसम्म कारण जानकारी गराइनेछ।",
            },
            {
                title: "12. रिफन्ड Processing Time",
                body: "HKMandu ले refund approve र initiate गरेपछि रकम देखिन लाग्ने समय payment channel र ग्राहकको bank/wallet provider मा निर्भर हुन्छ। Stripe card refund सामान्यतः करिब ५–१० business days मा देखिन सक्छ। PaymentAsia को समय underlying payment channel अनुसार फरक हुन्छ। Cash refund verification पछि मिलाइन्छ। Bank, card issuer, wallet वा payment network का delay HKMandu को नियन्त्रण बाहिर हुन सक्छन्।",
            },
            {
                title: "13. Payment Dispute तथा Chargeback",
                body: "Order मा समस्या भए पहिले HKMandu लाई सम्पर्क गर्नुहोस् ताकि हामी जाँच गरी आवश्यक भए सही payment channel बाट refund process गर्न सकौं। Payment dispute वा chargeback ले स्वतः refund eligibility बनाउँदैन र सम्बन्धित bank, card network, PaymentAsia वा Stripe का नियम लागू हुन सक्छन्।",
            },
            {
                title: "14. सम्पर्क",
                body: "Return, cancellation वा refund request का लागि HKMandu customer support लाई order reference सहित सम्पर्क गर्नुहोस्। Request verify र resolve गर्न आवश्यक थप जानकारीका लागि हामी तपाईंलाई सम्पर्क गर्न सक्छौं।",
            },
        ],
        noteTitle: "महत्त्वपूर्ण",
        noteBody:
            "यो नीति ग्राहकलाई स्पष्ट मार्गदर्शन दिनका लागि तयार गरिएको हो। Product, restaurant, courier वा service page मा देखाइएका category-specific terms यस नीतिसँगै लागू हुन सक्छन्। लागू कानूनले अझ बलियो अधिकार दिएको अवस्थामा ती अधिकार कायम रहन्छन्।",
    },

    zh: {
        title: "退款及退貨政策",
        updated: "最後更新：2026年9月12日",
        badge: "退貨與退款",
        subtitle:
            "本政策說明 HKMandu 就商城商品、餐飲訂單、快遞服務及專業服務，在甚麼情況下可批准退貨、取消、換貨、全額退款或部分退款。",
        highlights: [
            "合資格實體商品一般應在收貨後 7 個曆日內提出申請",
            "商品一般須未經使用，並保留原包裝及隨附配件",
            "獲批的網上付款退款會經原有 PaymentAsia 或 Stripe 付款途徑退回",
        ],
        paymentTitle: "獲批退款的退回方式",
        paymentSubtitle:
            "退款方式視乎原訂單的付款方法。銀行、發卡機構或電子錢包的處理時間並非 HKMandu 可直接控制。",
        paymentMethods: [
            {
                name: "PaymentAsia",
                description:
                    "HKMandu 會就原交易透過 PaymentAsia 發起獲批退款。退款一般經該交易所使用的支援付款渠道退回。除非付款服務供應商要求或允許其他處理方式，PaymentAsia 交易不會另行以現金直接退款。",
            },
            {
                name: "Stripe",
                description:
                    "獲批的 Stripe 退款會退回原付款方式。信用卡退款在發起後通常約需 5–10 個工作天才會顯示，實際時間視乎客戶的銀行或發卡機構。",
            },
            {
                name: "現金 / 貨到付款",
                description:
                    "獲批的現金退款可在核實訂單及收款人後以現金退回。如現金交收不切實際，HKMandu 可與客戶協議以銀行轉帳或其他合理方式退款。",
            },
        ],
        sections: [
            {
                title: "1. 適用範圍",
                body: "本政策適用於向 HKMandu 支付的合資格商城商品、餐飲訂單、快遞及配送服務，以及專業服務預約。供應商、餐廳、快遞合作夥伴或服務供應商如在購買前列明個別類別條款，該等條款亦可能同時適用。",
            },
            {
                title: "2. 可考慮退款的情況",
                body: "如商品有故障、瑕疵、在交付前已嚴重損壞、與訂單不符、數量錯誤、已付款訂單缺少商品、重複扣款、訂單仍符合取消條件，或已付款的約定服務未有提供，HKMandu 可考慮退款、換貨、補發或其他補救。HKMandu 可要求相片、影片、包裝、收據、配送紀錄或其他證明。",
            },
            {
                title: "3. 商品退貨期限及條件",
                body: "合資格實體商品請在收貨後 7 個曆日內提出退貨或退款申請。除非檢查問題本身需要拆封，商品應保持未經使用及原來狀態，並保留原包裝、標籤、說明書、配件、贈品及其他隨附部分。HKMandu 可要求提供相關訂單或付款證明。",
            },
            {
                title: "4. 不接受退貨或退款的情況",
                body: "因改變主意而提出的退貨，如涉及已開封或已使用商品、欠缺原包裝或隨附配件、標示為不可退貨或最終出售的商品、個人化或訂製商品、已開封的衛生敏感商品、易腐商品、單獨退回的贈品或樣品、交付後因不當使用或處理造成的損壞，或超出適用期限的申請，均可能被拒絕。本條款不影響依法不能排除的消費者權利。",
            },
            {
                title: "5. 餐廳及食品訂單",
                body: "食品具易腐性並通常按訂單準備，因此在開始製作或完成配送後，一般不接受因改變主意而退款。如食品有遺漏、錯誤、嚴重損壞、不安全或與已確認訂單有重大差異，請在送達當日盡快聯絡 HKMandu，並提供訂單資料及可用證明。",
            },
            {
                title: "6. 快遞、配送及運輸服務",
                body: "如在取件、派送或其他已承諾工作開始前取消快遞或配送服務，可能符合全額或部分退款資格。一旦運輸、清關、包裝、取件或第三方物流工作已開始，已產生的費用可能不可退還。遺失、損壞、延誤或派送失敗的申索亦受運輸政策、申報價值、證明及相關快遞合作夥伴條款約束。",
            },
            {
                title: "7. 專業服務",
                body: "專業服務如在工作開始前取消，扣除已披露或已承擔的第三方成本後，可能符合退款資格。工作開始後，任何獲批退款可按已完成工作、已投入時間、已產生費用或已交付成果作相應扣減。已完成的訂製工作一般不可退款，除非與協定服務範圍有重大不符。",
            },
            {
                title: "8. 退款方式",
                body: "獲批的網上付款退款一般會經原交易所使用的同一付款處理商及原付款途徑退回。PaymentAsia 退款會透過 PaymentAsia 發起；Stripe 退款會退回原付款方式。現金交易在核實後以現金或雙方同意的方式退款。HKMandu 不會要求客戶提供敏感的信用卡資料來處理退款。",
            },
            {
                title: "9. 部分退款、折扣及配送費",
                body: "如訂單只有部分符合條件，HKMandu 可就受影響商品或服務作部分退款。退款一般按折扣或優惠後實際支付的金額計算。原有配送、快遞、關稅、包裝、處理或第三方費用一經產生可能不可退還；如問題由 HKMandu 的錯誤或服務失誤引起，或法律另有規定，則可能例外。",
            },
            {
                title: "10. 如何申請退款",
                body: "請向 HKMandu 提供訂單編號、客戶姓名、付款方式、涉及的商品或服務、申請原因，以及相關相片或證明文件。在退貨指示確認前，請勿自行把商品退回賣家、餐廳、快遞公司或 HKMandu 地點，因正確退貨方式可能因訂單而異。",
            },
            {
                title: "11. 檢查及審批",
                body: "退回商品可能需要先經檢查，才會批准退款或換貨。HKMandu 可與相關供應商、餐廳、快遞、服務供應商、PaymentAsia 或 Stripe 核實訂單紀錄。如申請不符合適用條件，HKMandu 可拒絕退貨或退款，並會在合理可行情況下說明原因。",
            },
            {
                title: "12. 退款處理時間",
                body: "HKMandu 批准並發起退款後，款項顯示時間取決於付款渠道及客戶的銀行或電子錢包供應商。Stripe 信用卡退款通常約需 5–10 個工作天。PaymentAsia 的實際時間視乎相關付款渠道。現金退款會在核實後安排。銀行、發卡機構、電子錢包或付款網絡造成的延誤可能不在 HKMandu 控制範圍內。",
            },
            {
                title: "13. 付款爭議及拒付",
                body: "如訂單出現問題，請先聯絡 HKMandu，讓我們調查並在適當情況下經正確付款渠道處理退款。付款爭議或拒付並不會自動產生退款資格，並可能受相關銀行、卡組織、PaymentAsia 或 Stripe 的規則約束。",
            },
            {
                title: "14. 聯絡我們",
                body: "如需申請退貨、取消或退款，請聯絡 HKMandu 客戶服務並提供訂單參考編號。我們可能會就核實及處理申請所需的其他資料與您聯絡。",
            },
        ],
        noteTitle: "重要提示",
        noteBody:
            "本政策旨在向客戶提供清晰指引。商品、餐廳、快遞或服務頁面所列的個別類別條款可與本政策一併適用。如適用法律給予您更高保障，該等權利不受本政策影響。",
    },
};

const sectionIcons = [
    ShieldCheck,
    CheckCircle2,
    CalendarDays,
    Ban,
    UtensilsCrossed,
    Truck,
    BriefcaseBusiness,
    CreditCard,
    ReceiptText,
    Mail,
    ClipboardCheck,
    Clock3,
    AlertTriangle,
    Mail,
];

const paymentIcons = [WalletCards, CreditCard, Banknote];

export default function RefundPolicyPage({ locale = "en" }) {
    const t = content[locale] || content.en;

    return (
        <main className="bg-white">
            <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-blue-50">
                <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl" />
                <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl" />

                <div className="relative mx-auto max-w-5xl px-4 py-14 sm:px-6 md:py-16 lg:px-8 lg:py-20">
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#1a4b8f] shadow-sm">
                            <RefreshCw className="h-4 w-4" />
                            {t.badge}
                        </div>

                        <h1 className="text-[34px] font-bold leading-tight tracking-tight text-neutral-950 sm:text-5xl lg:text-[56px]">
                            {t.title}
                        </h1>

                        <p className="mt-4 text-sm font-semibold text-orange-600">
                            {t.updated}
                        </p>

                        <p className="mx-auto mt-5 max-w-3xl text-[15px] leading-8 text-neutral-600 sm:text-base">
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

            <section className="border-y border-blue-100 bg-[#1a4b8f]/[0.035] py-10 sm:py-12">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">
                            {t.paymentTitle}
                        </p>
                        <p className="mt-2 text-sm leading-7 text-neutral-600 sm:text-[15px]">
                            {t.paymentSubtitle}
                        </p>
                    </div>

                    <div className="mt-6 grid gap-4 lg:grid-cols-3">
                        {t.paymentMethods.map((method, index) => {
                            const Icon = paymentIcons[index] || CreditCard;
                            return (
                                <article
                                    key={method.name}
                                    className="rounded-[24px] border border-blue-100 bg-white p-5 shadow-sm"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#1a4b8f]/10 text-[#1a4b8f]">
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <h2 className="font-bold text-neutral-950">{method.name}</h2>
                                    </div>
                                    <p className="mt-4 text-sm leading-7 text-neutral-600">
                                        {method.description}
                                    </p>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="bg-white py-12 sm:py-16">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className="space-y-4">
                        {t.sections.map((section, index) => {
                            const Icon = sectionIcons[index] || RefreshCw;

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

                    <aside className="mt-7 rounded-[26px] border border-amber-200 bg-amber-50/70 p-5 sm:p-6">
                        <div className="flex gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                                <AlertTriangle className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-neutral-950">{t.noteTitle}</h2>
                                <p className="mt-2 text-sm leading-7 text-neutral-600 sm:text-[15px]">
                                    {t.noteBody}
                                </p>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>
        </main>
    );
}
