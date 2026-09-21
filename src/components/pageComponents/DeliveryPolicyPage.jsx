"use client";

import {
    Truck,
    Store,
    MapPin,
    PhoneCall,
    ClipboardCheck,
    Clock3,
    PackageCheck,
    CircleAlert,
    Headphones,
    ShieldCheck,
    UserCheck,
    CheckCircle2,
    Route,
    FileCheck2,
} from "lucide-react";

const content = {
    en: {
        title: "Delivery Policy",
        updated: "Last updated: September 18, 2026",
        badge: "Order Delivery",
        subtitle:
            "This policy explains how HKMandu prepares and hands over eligible orders for delivery, what information may be needed by vendors and couriers, how proof of delivery may be recorded, and how delivery issues are handled.",
        highlights: [
            "Vendors and couriers receive only the order and delivery information reasonably needed to fulfil your order",
            "Couriers may contact you when necessary to locate the address, access the delivery point, or resolve a delivery issue",
            "Proof of delivery may be recorded to confirm completion and help investigate disputes or missing-order reports",
        ],
        flowTitle: "How delivery works",
        flowSubtitle:
            "The exact process can vary by order type, location, vendor, and courier partner, but the usual delivery flow is outlined below.",
        flow: [
            {
                title: "1. Order confirmed",
                body: "HKMandu receives the confirmed order and the delivery details needed to coordinate fulfilment.",
            },
            {
                title: "2. Vendor prepares it",
                body: "The relevant restaurant, shop, or fulfilment partner receives the information needed to prepare the correct order.",
            },
            {
                title: "3. Courier handoff",
                body: "The order is handed to an HKMandu delivery person or a delivery partner together with the details needed to complete the delivery.",
            },
            {
                title: "4. Delivery completed",
                body: "The courier delivers the order and may record delivery status or reasonable proof that the handoff was completed.",
            },
        ],
        sections: [
            {
                title: "1. Scope",
                body: "This policy applies to eligible HKMandu marketplace and restaurant orders that are delivered to a customer or nominated recipient. Cross-border parcels, standalone courier requests, customs handling, and shipment-specific services may also be subject to our Shipping & Handling Policy and any terms displayed for the relevant service.",
            },
            {
                title: "2. Preparing Your Order",
                body: "After an order is confirmed, HKMandu may provide the relevant restaurant, shop, supplier, or fulfilment partner with the order information reasonably required to prepare, pack, label, and hand over the order. Depending on the order, this may include the ordered items, quantities, order reference, delivery timing, and relevant fulfilment instructions.",
            },
            {
                title: "3. Vendor Contact",
                body: "A vendor may contact you through an available HKMandu communication channel or by telephone when reasonably necessary to complete the order, for example to clarify an instruction, confirm an acceptable substitution, or explain that an item is unavailable. Vendors should not use delivery contact information for unrelated marketing or personal purposes.",
            },
            {
                title: "4. Delivering Your Order",
                body: "When the order is ready, it may be assigned to an HKMandu courier or a third-party delivery partner. To complete the delivery, the courier may receive limited delivery information such as the recipient name, telephone number, delivery address or location, order reference, and delivery instructions. This information should be used only as needed to perform the delivery, provide support, meet safety requirements, or comply with applicable law.",
            },
            {
                title: "5. Courier Contact & Delivery Instructions",
                body: "A courier may contact you if assistance is needed to find the address, enter the building, confirm the recipient, arrange a safe handoff, or resolve another delivery-related issue. Please keep your telephone number and delivery instructions accurate and remain reasonably reachable around the expected delivery time. Instructions that are unsafe, unlawful, impractical, or outside the booked service may not be followed.",
            },
            {
                title: "6. Delivery Times",
                body: "Displayed delivery times are estimates unless HKMandu expressly states otherwise. Preparation time, traffic, weather, building access, order volume, vendor delays, courier availability, customs or security checks, public events, and other circumstances can affect the actual delivery time. We will take reasonable steps to provide status information where available.",
            },
            {
                title: "7. Proof of Delivery",
                body: "For some deliveries, HKMandu or the courier may record proof of delivery. Depending on the service, this may include the delivery date and time, delivery status, recipient or receiver name, a signature, a one-time confirmation, or a photo showing the delivery location or handoff. Proof of delivery may be used to confirm completion, respond to support requests, and investigate disputes, missing-order reports, or suspected misuse.",
            },
            {
                title: "8. Failed Delivery, Incorrect Address & Redelivery",
                body: "If delivery cannot be completed because the address or contact details are incorrect, the recipient cannot be reached, access is unavailable, the order is refused, or another customer-side issue prevents handoff, the courier may leave the location, return the order where appropriate, or follow the applicable service procedure. Redelivery, return, waiting, or additional handling charges may apply where disclosed or reasonably incurred.",
            },
            {
                title: "9. Missing, Incorrect or Damaged Orders",
                body: "If your delivered order is missing items, materially incorrect, damaged, or appears not to have been delivered, contact HKMandu as soon as reasonably possible and provide the order reference plus any useful photos or details. For restaurant or other perishable orders, reporting the issue on the delivery day helps us investigate while the delivery information is current. Any refund, replacement, credit, or other remedy is subject to the applicable order terms and our Refund & Return Policy.",
            },
            {
                title: "10. Customer Care",
                body: "When you ask for help with a delivery, HKMandu may use the account, order, delivery, payment-status, communication, and supporting information reasonably needed to understand and resolve the request. We may check order records with the relevant vendor, courier, payment provider, or service partner where necessary for the investigation.",
            },
            {
                title: "11. Delivery Data & Privacy",
                body: "HKMandu aims to limit delivery-related personal information to what is reasonably necessary for order fulfilment, support, safety, fraud prevention, and legal obligations. Vendors and couriers are expected to handle that information only for authorised purposes. If a vendor or courier contacts you for an unrelated purpose using information obtained through an HKMandu order, please report it to HKMandu support. More information about personal-data handling is available in our Privacy Policy.",
            },
            {
                title: "12. Customer Responsibilities",
                body: "Please provide complete and accurate delivery details, including the recipient name, reachable telephone number, delivery address, building or access information, and any important delivery instructions. Where age, identity, authorisation, signature, or another verification is required for a particular order, the recipient must be able to provide the required confirmation at delivery.",
            },
            {
                title: "13. Contact",
                body: "For a delivery issue, contact HKMandu customer support and include your order reference, the delivery address or recipient details needed to identify the order, a short description of the issue, and any relevant photos or supporting information. You can reach us at support@yaloon.com.",
            },
        ],
        noteTitle: "Important",
        noteBody:
            "Delivery procedures can differ by service, vendor, location, courier partner, and applicable law. Service-specific terms shown during ordering may apply in addition to this policy. Nothing in this policy limits rights that cannot legally be excluded.",
    },

    ne: {
        title: "डेलिभरी नीति",
        updated: "अन्तिम अपडेट: सेप्टेम्बर १८, २०२६",
        badge: "अर्डर डेलिभरी",
        subtitle:
            "यो नीतिले HKMandu ले योग्य अर्डर कसरी तयार र डेलिभरीका लागि हस्तान्तरण गर्छ, विक्रेता र कुरियरलाई कुन जानकारी आवश्यक पर्न सक्छ, डेलिभरीको प्रमाण कसरी राखिन सक्छ, र डेलिभरीसम्बन्धी समस्या कसरी समाधान गरिन्छ भन्ने बताउँछ।",
        highlights: [
            "विक्रेता र कुरियरलाई अर्डर पूरा गर्न आवश्यक पर्ने सीमित अर्डर तथा डेलिभरी जानकारी मात्र दिइन्छ",
            "ठेगाना पत्ता लगाउन, प्रवेश गर्न वा डेलिभरी समस्या समाधान गर्न आवश्यक परे कुरियरले तपाईंलाई सम्पर्क गर्न सक्छ",
            "डेलिभरी पूरा भएको पुष्टि गर्न र विवाद वा हराएको अर्डरको जाँच गर्न डेलिभरी प्रमाण राखिन सक्छ",
        ],
        flowTitle: "डेलिभरी कसरी हुन्छ",
        flowSubtitle:
            "अर्डरको प्रकार, स्थान, विक्रेता र कुरियर पार्टनरअनुसार प्रक्रिया फरक हुन सक्छ, तर सामान्य प्रवाह तल दिइएको छ।",
        flow: [
            {
                title: "1. अर्डर पुष्टि",
                body: "HKMandu ले पुष्टि भएको अर्डर र डेलिभरी समन्वयका लागि आवश्यक विवरण प्राप्त गर्छ।",
            },
            {
                title: "2. विक्रेताले तयारी गर्छ",
                body: "सम्बन्धित रेस्टुरेन्ट, पसल वा fulfilment पार्टनरले सही अर्डर तयार गर्न आवश्यक विवरण प्राप्त गर्छ।",
            },
            {
                title: "3. कुरियरलाई हस्तान्तरण",
                body: "अर्डर HKMandu डेलिभरी व्यक्ति वा डेलिभरी पार्टनरलाई आवश्यक डेलिभरी विवरणसहित दिइन्छ।",
            },
            {
                title: "4. डेलिभरी पूरा",
                body: "कुरियरले अर्डर बुझाउँछ र आवश्यक परे डेलिभरी स्थिति वा उचित प्रमाण रेकर्ड गर्न सक्छ।",
            },
        ],
        sections: [
            {
                title: "1. लागू क्षेत्र",
                body: "यो नीति ग्राहक वा तोकिएको प्राप्तकर्तालाई पुर्‍याइने योग्य HKMandu मार्केटप्लेस र रेस्टुरेन्ट अर्डरमा लागू हुन्छ। सीमापार पार्सल, छुट्टै कुरियर अनुरोध, भन्सार ह्यान्डलिङ र विशेष शिपमेन्ट सेवामा हाम्रो Shipping & Handling Policy तथा सम्बन्धित सेवामा देखाइएका अतिरिक्त सर्तहरू पनि लागू हुन सक्छन्।",
            },
            {
                title: "2. अर्डर तयारी",
                body: "अर्डर पुष्टि भएपछि HKMandu ले सम्बन्धित रेस्टुरेन्ट, पसल, आपूर्तिकर्ता वा fulfilment पार्टनरलाई अर्डर तयार गर्न, प्याक गर्न, लेबल गर्न र हस्तान्तरण गर्न आवश्यक पर्ने उचित जानकारी दिन सक्छ। यसमा अर्डर गरिएका वस्तु, मात्रा, अर्डर सन्दर्भ, डेलिभरी समय र सम्बन्धित निर्देशन समावेश हुन सक्छन्।",
            },
            {
                title: "3. विक्रेताबाट सम्पर्क",
                body: "अर्डर पूरा गर्न आवश्यक भएमा विक्रेताले उपलब्ध HKMandu सञ्चार माध्यम वा फोनबाट तपाईंलाई सम्पर्क गर्न सक्छ, जस्तै निर्देशन स्पष्ट गर्न, विकल्प स्वीकार्य छ कि छैन पुष्टि गर्न, वा कुनै वस्तु उपलब्ध नभएको जानकारी दिन। डेलिभरीका लागि प्राप्त सम्पर्क विवरण असम्बन्धित मार्केटिङ वा व्यक्तिगत प्रयोजनका लागि प्रयोग गर्नु हुँदैन।",
            },
            {
                title: "4. अर्डर डेलिभरी",
                body: "अर्डर तयार भएपछि HKMandu कुरियर वा तेस्रो-पक्ष डेलिभरी पार्टनरलाई जिम्मा दिन सकिन्छ। डेलिभरी पूरा गर्न कुरियरले प्राप्तकर्ताको नाम, फोन नम्बर, डेलिभरी ठेगाना वा स्थान, अर्डर सन्दर्भ र डेलिभरी निर्देशन जस्ता सीमित विवरण पाउन सक्छ। यस्तो जानकारी डेलिभरी, समर्थन, सुरक्षा आवश्यकताहरू वा लागू कानुन पूरा गर्न आवश्यक पर्ने हदसम्म मात्र प्रयोग हुनुपर्छ।",
            },
            {
                title: "5. कुरियर सम्पर्क र डेलिभरी निर्देशन",
                body: "ठेगाना भेट्टाउन, भवनमा प्रवेश गर्न, प्राप्तकर्ता पुष्टि गर्न, सुरक्षित रूपमा अर्डर बुझाउन वा अन्य डेलिभरी समस्या समाधान गर्न आवश्यक परे कुरियरले तपाईंलाई सम्पर्क गर्न सक्छ। अपेक्षित डेलिभरी समयमा फोन नम्बर र निर्देशन सही राख्नुहोस् र सम्भव भएसम्म सम्पर्कयोग्य रहनुहोस्। असुरक्षित, गैरकानुनी, अव्यावहारिक वा बुक गरिएको सेवाभन्दा बाहिरका निर्देशन पालना नहुन सक्छन्।",
            },
            {
                title: "6. डेलिभरी समय",
                body: "HKMandu ले स्पष्ट रूपमा अन्यथा नबताएसम्म देखाइएका डेलिभरी समय अनुमानित हुन्छन्। तयारी समय, ट्राफिक, मौसम, भवन प्रवेश, अर्डरको चाप, विक्रेता ढिलाइ, कुरियर उपलब्धता, भन्सार वा सुरक्षा जाँच, सार्वजनिक कार्यक्रम र अन्य परिस्थितिले वास्तविक समय प्रभावित गर्न सक्छ। उपलब्ध हुँदा हामी स्थिति जानकारी दिन उचित प्रयास गर्नेछौं।",
            },
            {
                title: "7. डेलिभरीको प्रमाण",
                body: "केही डेलिभरीमा HKMandu वा कुरियरले डेलिभरीको प्रमाण रेकर्ड गर्न सक्छ। सेवाअनुसार यसमा मिति र समय, डेलिभरी स्थिति, प्राप्तकर्ताको नाम, हस्ताक्षर, एकपटकको पुष्टि कोड वा डेलिभरी स्थान वा हस्तान्तरण देखाउने फोटो समावेश हुन सक्छ। यस्तो प्रमाण डेलिभरी पूरा भएको पुष्टि गर्न, सहायता अनुरोध समाधान गर्न र विवाद वा हराएको अर्डरको जाँच गर्न प्रयोग हुन सक्छ।",
            },
            {
                title: "8. असफल डेलिभरी, गलत ठेगाना र पुनःडेलिभरी",
                body: "ठेगाना वा सम्पर्क विवरण गलत भए, प्राप्तकर्तासँग सम्पर्क हुन नसके, प्रवेश नपाए, अर्डर अस्वीकार भए वा ग्राहकतर्फको अर्को कारणले हस्तान्तरण हुन नसकेमा कुरियर स्थान छोड्न, आवश्यक भए अर्डर फिर्ता लैजान वा लागू सेवा प्रक्रिया पालना गर्न सक्छ। खुलासा गरिएको वा उचित रूपमा लागेको पुनःडेलिभरी, फिर्ता, प्रतीक्षा वा अतिरिक्त ह्यान्डलिङ शुल्क लाग्न सक्छ।",
            },
            {
                title: "9. हराएको, गलत वा क्षतिग्रस्त अर्डर",
                body: "डेलिभरीपछि वस्तु हराएको, उल्लेखनीय रूपमा गलत, क्षतिग्रस्त वा डेलिभर नभएको जस्तो लागेमा सकेसम्म चाँडो HKMandu लाई अर्डर सन्दर्भ र उपयोगी फोटो वा विवरणसहित सम्पर्क गर्नुहोस्। रेस्टुरेन्ट वा छिट्टै बिग्रने वस्तुको समस्या डेलिभरीकै दिन रिपोर्ट गर्दा जाँच गर्न सहज हुन्छ। रिफन्ड, प्रतिस्थापन, क्रेडिट वा अन्य समाधान लागू अर्डर सर्त र Refund & Return Policy अनुसार हुनेछ।",
            },
            {
                title: "10. ग्राहक सहायता",
                body: "डेलिभरीबारे सहायता माग्दा HKMandu ले समस्या बुझ्न र समाधान गर्न आवश्यक पर्ने खाता, अर्डर, डेलिभरी, भुक्तानी स्थिति, सञ्चार र सहायक जानकारी प्रयोग गर्न सक्छ। आवश्यक भए सम्बन्धित विक्रेता, कुरियर, भुक्तानी प्रदायक वा सेवा पार्टनरसँग अर्डर रेकर्ड जाँच गर्न सकिन्छ।",
            },
            {
                title: "11. डेलिभरी डेटा र गोपनीयता",
                body: "HKMandu ले डेलिभरीसम्बन्धी व्यक्तिगत जानकारी अर्डर पूरा गर्न, समर्थन, सुरक्षा, ठगी रोकथाम र कानुनी दायित्वका लागि उचित रूपमा आवश्यक हदसम्म सीमित राख्ने लक्ष्य राख्छ। विक्रेता र कुरियरले यस्तो जानकारी अधिकृत प्रयोजनका लागि मात्र प्रयोग गर्नुपर्ने हुन्छ। HKMandu अर्डरबाट प्राप्त विवरण प्रयोग गरी विक्रेता वा कुरियरले असम्बन्धित प्रयोजनका लागि सम्पर्क गरेमा HKMandu समर्थनलाई जानकारी दिनुहोस्। थप विवरण Privacy Policy मा उपलब्ध छ।",
            },
            {
                title: "12. ग्राहकको जिम्मेवारी",
                body: "प्राप्तकर्ताको नाम, सम्पर्कयोग्य फोन नम्बर, डेलिभरी ठेगाना, भवन वा प्रवेश विवरण र महत्त्वपूर्ण निर्देशनसहित पूर्ण र सही जानकारी दिनुहोस्। कुनै अर्डरमा उमेर, पहिचान, अधिकार, हस्ताक्षर वा अन्य प्रमाणीकरण आवश्यक भएमा प्राप्तकर्ताले डेलिभरीको समयमा आवश्यक पुष्टि दिन सक्नुपर्छ।",
            },
            {
                title: "13. सम्पर्क",
                body: "डेलिभरी समस्याका लागि HKMandu ग्राहक समर्थनलाई सम्पर्क गर्दा अर्डर सन्दर्भ, अर्डर पहिचान गर्न आवश्यक डेलिभरी वा प्राप्तकर्ता विवरण, समस्याको छोटो विवरण र सम्बन्धित फोटो वा प्रमाण समावेश गर्नुहोस्। support@yaloon.com मा सम्पर्क गर्न सक्नुहुन्छ।",
            },
        ],
        noteTitle: "महत्त्वपूर्ण",
        noteBody:
            "डेलिभरी प्रक्रिया सेवा, विक्रेता, स्थान, कुरियर पार्टनर र लागू कानुनअनुसार फरक हुन सक्छ। अर्डर गर्दा देखाइएका सेवा-विशेष सर्तहरू यो नीतिसँगै लागू हुन सक्छन्। कानुनले हटाउन नमिल्ने अधिकारलाई यो नीतिले सीमित गर्दैन।",
    },

    zh: {
        title: "配送政策",
        updated: "最後更新：2026年9月18日",
        badge: "訂單配送",
        subtitle:
            "本政策說明 HKMandu 如何準備合資格訂單並安排配送、商戶及配送員可能需要哪些資料、如何記錄送達證明，以及如何處理配送問題。",
        highlights: [
            "商戶及配送員只會取得合理完成訂單所需的訂單及配送資料",
            "如需尋找地址、進入配送地點或處理配送問題，配送員可能會聯絡您",
            "HKMandu 可能記錄送達證明，以確認配送完成及協助調查爭議或未收到訂單的報告",
        ],
        flowTitle: "配送流程",
        flowSubtitle:
            "實際流程可因訂單類型、地點、商戶及配送合作夥伴而異，一般流程如下。",
        flow: [
            {
                title: "1. 訂單確認",
                body: "HKMandu 接收已確認的訂單及安排履行與配送所需的資料。",
            },
            {
                title: "2. 商戶準備訂單",
                body: "相關餐廳、商店或履行合作夥伴取得準備正確訂單所需的資料。",
            },
            {
                title: "3. 交予配送員",
                body: "訂單連同完成配送所需的資料交予 HKMandu 配送員或配送合作夥伴。",
            },
            {
                title: "4. 完成配送",
                body: "配送員交付訂單，並可能記錄配送狀態或合理的送達證明。",
            },
        ],
        sections: [
            {
                title: "1. 適用範圍",
                body: "本政策適用於配送至客戶或指定收件人的合資格 HKMandu 商城及餐飲訂單。跨境包裹、獨立快遞要求、清關處理及特定運送服務，亦可能受我們的「運送及處理政策」以及相關服務頁面所列條款約束。",
            },
            {
                title: "2. 準備您的訂單",
                body: "訂單確認後，HKMandu 可向相關餐廳、商店、供應商或履行合作夥伴提供準備、包裝、標示及交接訂單所合理需要的資料。視乎訂單，資料可能包括商品、數量、訂單編號、配送時間及相關履行指示。",
            },
            {
                title: "3. 商戶聯絡",
                body: "如為完成訂單而合理需要，商戶可透過 HKMandu 提供的通訊方式或電話聯絡您，例如澄清指示、確認可接受的替代品，或通知某項商品缺貨。商戶不應把因配送取得的聯絡資料用於無關的市場推廣或私人用途。",
            },
            {
                title: "4. 配送您的訂單",
                body: "訂單準備完成後，可交由 HKMandu 配送員或第三方配送合作夥伴。為完成配送，配送員可能取得有限資料，例如收件人姓名、電話號碼、配送地址或位置、訂單編號及配送指示。該等資料只應在完成配送、提供支援、符合安全要求或履行適用法律所需的範圍內使用。",
            },
            {
                title: "5. 配送員聯絡及配送指示",
                body: "如需協助尋找地址、進入大廈、確認收件人、安全交接或處理其他配送問題，配送員可能聯絡您。請確保電話號碼及配送指示準確，並在預計配送時間附近保持合理可聯絡狀態。涉及不安全、違法、不切實際或超出已預訂服務範圍的指示，可能無法執行。",
            },
            {
                title: "6. 配送時間",
                body: "除非 HKMandu 明確另有說明，顯示的配送時間只屬估算。備餐或備貨時間、交通、天氣、大廈出入、訂單量、商戶延誤、配送員供應、海關或保安檢查、公眾活動及其他情況均可能影響實際時間。可行時我們會採取合理措施提供配送狀態資訊。",
            },
            {
                title: "7. 送達證明",
                body: "部分配送可能由 HKMandu 或配送員記錄送達證明。視乎服務，資料可包括配送日期及時間、配送狀態、收件人或接收人姓名、簽名、一次性確認，或顯示配送地點或交接情況的相片。送達證明可用於確認完成配送、處理支援要求，以及調查爭議、未收到訂單的報告或涉嫌濫用情況。",
            },
            {
                title: "8. 配送失敗、地址錯誤及再次配送",
                body: "如因地址或聯絡資料錯誤、未能聯絡收件人、無法進入配送地點、收件人拒收或其他客戶方面的原因而未能完成交接，配送員可離開現場、在適當情況下退回訂單，或按適用服務流程處理。如事先披露或屬合理產生，再次配送、退回、等候或額外處理費用可能適用。",
            },
            {
                title: "9. 遺漏、錯誤或損壞的訂單",
                body: "如送達的訂單有遺漏、重大錯誤、損壞，或您認為訂單未有送達，請在合理可行情況下盡快聯絡 HKMandu，並提供訂單編號及有助調查的相片或資料。餐飲或其他易腐訂單如能在送達當日報告問題，有助我們在配送資料仍然最新時進行調查。退款、補發、帳戶額度或其他補救受適用訂單條款及「退款及退貨政策」約束。",
            },
            {
                title: "10. 客戶服務",
                body: "當您就配送尋求協助時，HKMandu 可使用合理需要的帳戶、訂單、配送、付款狀態、通訊及支援資料，以了解並處理您的要求。調查需要時，我們可與相關商戶、配送員、付款服務供應商或服務合作夥伴核對訂單紀錄。",
            },
            {
                title: "11. 配送資料及私隱",
                body: "HKMandu 致力把配送相關個人資料限制於履行訂單、提供支援、安全、預防欺詐及法律責任所合理需要的範圍。商戶及配送員應只為獲授權目的處理該等資料。如商戶或配送員使用從 HKMandu 訂單取得的資料，就無關目的聯絡您，請向 HKMandu 客戶服務報告。更多個人資料處理資訊請參閱我們的「私隱政策」。",
            },
            {
                title: "12. 客戶責任",
                body: "請提供完整及準確的配送資料，包括收件人姓名、可聯絡的電話號碼、配送地址、大廈或進入資料，以及重要配送指示。如特定訂單要求年齡、身份、授權、簽名或其他核實，收件人須能在配送時提供所需確認。",
            },
            {
                title: "13. 聯絡我們",
                body: "如有配送問題，請聯絡 HKMandu 客戶服務，並提供訂單編號、識別訂單所需的配送或收件人資料、問題簡述，以及相關相片或證明。您可電郵至 support@yaloon.com。",
            },
        ],
        noteTitle: "重要提示",
        noteBody:
            "配送程序可因服務、商戶、地點、配送合作夥伴及適用法律而不同。下單時顯示的服務特定條款可與本政策同時適用。本政策不限制依法不能排除的權利。",
    },
};

const flowIcons = [ClipboardCheck, Store, Route, PackageCheck];

const sectionIcons = [
    ShieldCheck,
    Store,
    PhoneCall,
    Truck,
    MapPin,
    Clock3,
    FileCheck2,
    CircleAlert,
    PackageCheck,
    Headphones,
    ShieldCheck,
    UserCheck,
    PhoneCall,
];

export default function DeliveryPolicyPage({ locale = "en" }) {
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

            <section className="border-y border-blue-100 bg-[#1a4b8f]/[0.035] py-10 sm:py-12">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">
                            {t.flowTitle}
                        </p>
                        <p className="mt-2 text-sm leading-7 text-neutral-600 sm:text-[15px]">
                            {t.flowSubtitle}
                        </p>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {t.flow.map((step, index) => {
                            const Icon = flowIcons[index] || Truck;
                            return (
                                <article
                                    key={step.title}
                                    className="rounded-[24px] border border-blue-100 bg-white p-5 shadow-sm"
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#1a4b8f]/10 text-[#1a4b8f]">
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <h2 className="mt-4 font-bold text-neutral-950">{step.title}</h2>
                                    <p className="mt-2 text-sm leading-7 text-neutral-600">{step.body}</p>
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

            <section className="bg-white py-10 sm:py-12">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className="rounded-[26px] border border-blue-100 bg-blue-50/50 p-5 sm:p-6">
                        <div className="flex gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#1a4b8f] text-white">
                                <CircleAlert className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-neutral-950">{t.noteTitle}</h2>
                                <p className="mt-2 text-sm leading-7 text-neutral-600 sm:text-[15px]">
                                    {t.noteBody}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
