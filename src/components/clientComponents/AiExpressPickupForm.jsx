"use client";

import { useMemo, useState } from "react";
import {
    ArrowRight,
    Box,
    CalendarDays,
    CheckCircle2,
    CreditCard,
    Globe2,
    Home,
    Loader2,
    Lock,
    Mail,
    MapPin,
    Package,
    Phone,
    PlaneLanding,
    PlaneTakeoff,
    RefreshCcw,
    ShieldCheck,
    User,
    Truck,
    Clock3,
    Scale,
    Hash,
    AlertTriangle,
} from "lucide-react";

import http from "@/http";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

const COPY = {
    en: {
        eyebrow: "AI EXPRESS",
        titleA: "Submit",
        titleC: "request",

        senderInfo: "Sender Information",
        receiverInfo: "Receiver Information",
        packageInfo: "Package Information",
        verificationInfo: "Verification",

        senderName: "Sender Name",
        senderPhone: "Sender Phone",
        senderEmail: "Sender Email",
        receiverName: "Receiver Name",
        receiverPhone: "Receiver Phone",

        deliveryType: "Delivery Type",
        pickupAddress: "Pickup Address",
        pickupDate: "Pickup Date",
        pickupTimeSlot: "Pickup Time Slot",
        serviceSpeed: "Service Speed",
        deliveryAddress: "Delivery Address",

        packageType: "Package Type",
        weight: "Weight (kg)",
        quantity: "Quantity",
        dimensions: "Dimensions (L x W x H)",
        isFragile: "Fragile Item",
        paymentMethod: "Payment Method",
        specialInstructions: "Special Instructions",
        verificationMethod: "Verification Method",
        confirmRequest:
            "I confirm that the shipment details are correct and the package does not contain prohibited items.",

        placeholders: {
            senderName: "Sender name",
            senderPhone: "9800000000",
            senderEmail: "sender@example.com",
            receiverName: "Receiver name",
            receiverPhone: "90000000",
            pickupAddress: "Pickup address",
            pickupDate: "",
            pickupTimeSlot: "10:00 AM - 1:00 PM",
            deliveryAddress: "Delivery address",
            packageType: "e.g. documents",
            weight: "e.g. 2.5",
            quantity: "e.g. 1",
            dimensions: "e.g. 10x8x2 ft",
            specialInstructions: "e.g. Call before pickup",
            otp: "Enter OTP",
        },

        deliveryTypes: [
            { value: "door2door", label: "Door to Door" },
            { value: "door2branch", label: "Door to Branch" },
        ],
        serviceSpeeds: [
            { value: "standard", label: "Standard" },
            { value: "express", label: "Express" },
            { value: "same-day", label: "Same Day" },
        ],
        paymentMethods: [
            { value: "card / cheque", label: "Card / Cheque" },
            { value: "bank deposit / transfer", label: "Bank Deposit / Transfer" },
            {
                value: "online transfer / credit card",
                label: "Online Transfer / Credit Card",
            },
        ],
        verificationMethods: [
            { value: "email", label: "Email" },
            { value: "phone", label: "Phone" },
        ],

        yes: "Yes",
        no: "No",
        choose: "Select",
        submit: "Submit Pickup Request",
        sending: "Submitting...",
        verifyTitle: "Verify your request",
        verifyText:
            "We sent a one-time code to your selected verification method. Enter it below to confirm your pickup request.",
        otpLabel: "Verification Code",
        verify: "Verify OTP",
        verifying: "Verifying...",
        resend: "Resend OTP",
        resending: "Resending...",
        reset: "Submit Another Request",
        secure: "Your pickup request information is kept private and secure.",
        successTitle: "Pickup request verified successfully",
        successText:
            "Your courier pickup request has been confirmed. Our team will process it and contact you soon.",

        required: "This field is required.",
        invalidEmail: "Please enter a valid email address.",
        invalidSenderPhone:
            "Enter 8 digits for Hong Kong or 10 digits for Nepal.",

        invalidReceiverPhone:
            "Enter 8 digits for Hong Kong or 10 digits for Nepal.",
        invalidWeight: "Please enter a valid positive weight.",
        invalidQuantity: "Quantity must be at least 1.",
        invalidOtp: "Please enter the OTP code.",
        confirmRequired: "You must confirm the request before submitting.",
        emailRequiredForVerification:
            "Sender email is required when verification method is email.",
        selectPickupDateFirst: "Select pickup date first",
        captchaRequired: "Please complete reCAPTCHA verification.",
        serviceType: "Service Type",
        route: "Route",
    },

    ne: {
        eyebrow: "एआई एक्सप्रेस",
        titleA: "कुरियर",
        titleC: "अनुरोध पठाउनुहोस्",

        senderInfo: "पठाउने व्यक्तिको जानकारी",
        receiverInfo: "प्राप्त गर्ने व्यक्तिको जानकारी",
        packageInfo: "पार्सल जानकारी",
        verificationInfo: "प्रमाणीकरण",

        senderName: "पठाउने व्यक्तिको नाम",
        senderPhone: "पठाउने व्यक्तिको फोन",
        senderEmail: "पठाउने व्यक्तिको इमेल",
        receiverName: "प्राप्त गर्ने व्यक्तिको नाम",
        receiverPhone: "प्राप्त गर्ने व्यक्तिको फोन",

        deliveryType: "डेलिभरी प्रकार",
        pickupAddress: "पिकअप ठेगाना",
        pickupDate: "पिकअप मिति",
        pickupTimeSlot: "पिकअप समय",
        serviceSpeed: "सेवा गति",
        deliveryAddress: "डेलिभरी ठेगाना",

        packageType: "पार्सल प्रकार",
        weight: "तौल (केजी)",
        quantity: "संख्या",
        dimensions: "आकार (L x W x H)",
        isFragile: "नाजुक सामान",
        paymentMethod: "भुक्तानी विधि",
        specialInstructions: "विशेष निर्देशन",
        verificationMethod: "प्रमाणीकरण विधि",
        confirmRequest:
            "म पुष्टि गर्छु कि ढुवानी विवरण सही छन् र पार्सलमा निषेधित वस्तुहरू समावेश छैनन्।",

        placeholders: {
            senderName: "पठाउने व्यक्तिको नाम",
            senderPhone: "9800000000",
            senderEmail: "sender@example.com",
            receiverName: "प्राप्त गर्ने व्यक्तिको नाम",
            receiverPhone: "90000000",
            pickupAddress: "पिकअप ठेगाना",
            pickupDate: "",
            pickupTimeSlot: "10:00 AM - 1:00 PM",
            deliveryAddress: "डेलिभरी ठेगाना",
            packageType: "जस्तै: कागजात",
            weight: "जस्तै: 2.5",
            quantity: "जस्तै: 1",
            dimensions: "जस्तै: 10x8x2 ft",
            specialInstructions: "जस्तै: पिकअप अघि फोन गर्नुहोस्",
            otp: "OTP हाल्नुहोस्",
        },

        deliveryTypes: [
            { value: "door2door", label: "घरदेखि घरसम्म" },
            { value: "door2branch", label: "घरदेखि शाखासम्म" },
        ],
        serviceSpeeds: [
            { value: "standard", label: "साधारण" },
            { value: "express", label: "एक्सप्रेस" },
            { value: "same-day", label: "उही दिन" },
        ],
        paymentMethods: [
            { value: "card / cheque", label: "कार्ड / चेक" },
            {
                value: "bank deposit / transfer",
                label: "बैंक जम्मा / ट्रान्सफर",
            },
            {
                value: "online transfer / credit card",
                label: "अनलाइन ट्रान्सफर / क्रेडिट कार्ड",
            },
        ],
        verificationMethods: [
            { value: "email", label: "इमेल" },
            { value: "phone", label: "फोन" },
        ],

        yes: "हो",
        no: "होइन",
        choose: "छान्नुहोस्",
        submit: "पिकअप अनुरोध पठाउनुहोस्",
        sending: "पठाइँदैछ...",
        verifyTitle: "आफ्नो अनुरोध प्रमाणित गर्नुहोस्",
        verifyText:
            "हामीले तपाईंले रोजेको प्रमाणीकरण माध्यममा OTP पठाएका छौँ। अनुरोध पुष्टि गर्न तल हाल्नुहोस्।",
        otpLabel: "प्रमाणीकरण कोड",
        verify: "OTP प्रमाणित गर्नुहोस्",
        verifying: "प्रमाणित हुँदैछ...",
        resend: "OTP फेरि पठाउनुहोस्",
        resending: "फेरि पठाइँदैछ...",
        reset: "फेरि अर्को अनुरोध पठाउनुहोस्",
        secure: "तपाईंको पिकअप अनुरोध जानकारी निजी र सुरक्षित राखिन्छ।",
        successTitle: "पिकअप अनुरोध सफलतापूर्वक प्रमाणित भयो",
        successText:
            "तपाईंको कुरियर पिकअप अनुरोध पुष्टि भएको छ। हाम्रो टोलीले छिट्टै प्रक्रिया अघि बढाउनेछ।",

        required: "यो फिल्ड आवश्यक छ।",
        invalidEmail: "कृपया मान्य इमेल हाल्नुहोस्।",
        invalidSenderPhone:
            "मान्य नेपाल (9XXXXXXXXX) वा हङकङ (8XXXXXXX) नम्बर हाल्नुहोस्।",
        invalidReceiverPhone:
            "मान्य नेपाल (9XXXXXXXXX) वा हङकङ (8XXXXXXX) नम्बर हाल्नुहोस्।",
        invalidWeight: "कृपया मान्य धनात्मक तौल हाल्नुहोस्।",
        invalidQuantity: "संख्या कम्तीमा १ हुनुपर्छ।",
        invalidOtp: "कृपया OTP हाल्नुहोस्।",
        confirmRequired: "पठाउनु अघि अनुरोध पुष्टि गर्नुपर्छ।",
        emailRequiredForVerification:
            "प्रमाणीकरण विधि इमेल भएमा पठाउने व्यक्तिको इमेल आवश्यक हुन्छ।",
        selectPickupDateFirst: "पहिले पिकअप मिति छान्नुहोस्",
        captchaRequired: "कृपया reCAPTCHA प्रमाणिकरण पूरा गर्नुहोस्।",
        serviceType: "सेवा प्रकार",
        route: "रुट",
    },

    zh: {
        eyebrow: "AI EXPRESS",
        titleA: "提交",
        titleC: "请求",

        senderInfo: "寄件人资料",
        receiverInfo: "收件人资料",
        packageInfo: "包裹资料",
        verificationInfo: "验证",

        senderName: "寄件人姓名",
        senderPhone: "寄件人电话",
        senderEmail: "寄件人邮箱",
        receiverName: "收件人姓名",
        receiverPhone: "收件人电话",

        deliveryType: "配送类型",
        pickupAddress: "取件地址",
        pickupDate: "取件日期",
        pickupTimeSlot: "取件时段",
        serviceSpeed: "服务速度",
        deliveryAddress: "送达地址",

        packageType: "包裹类型",
        weight: "重量 (kg)",
        quantity: "数量",
        dimensions: "尺寸 (L x W x H)",
        isFragile: "易碎物品",
        paymentMethod: "付款方式",
        specialInstructions: "特别说明",
        verificationMethod: "验证方式",
        confirmRequest: "我确认货运资料正确无误，且包裹内不含违禁物品。",

        placeholders: {
            senderName: "寄件人姓名",
            senderPhone: "9800000000",
            senderEmail: "sender@example.com",
            receiverName: "收件人姓名",
            receiverPhone: "90000000",
            pickupAddress: "取件地址",
            pickupDate: "",
            pickupTimeSlot: "10:00 AM - 1:00 PM",
            deliveryAddress: "送达地址",
            packageType: "例如：documents",
            weight: "例如：2.5",
            quantity: "例如：1",
            dimensions: "例如：10x8x2 ft",
            specialInstructions: "例如：取件前请致电",
            otp: "输入 OTP",
        },

        deliveryTypes: [
            { value: "door2door", label: "门到门" },
            { value: "door2branch", label: "门到直营网点" },
        ],
        serviceSpeeds: [
            { value: "standard", label: "标准" },
            { value: "express", label: "特快" },
            { value: "same-day", label: "即日" },
        ],
        paymentMethods: [
            { value: "card / cheque", label: "银行卡 / 支票" },
            { value: "bank deposit / transfer", label: "银行入数 / 转账" },
            {
                value: "online transfer / credit card",
                label: "网上转账 / 信用卡",
            },
        ],
        verificationMethods: [
            { value: "email", label: "邮箱" },
            { value: "phone", label: "电话" },
        ],

        yes: "是",
        no: "否",
        choose: "请选择",
        submit: "提交取件请求",
        sending: "提交中...",
        verifyTitle: "验证您的请求",
        verifyText:
            "我们已将一次性验证码发送到您选择的验证方式，请在下方输入以确认您的取件请求。",
        otpLabel: "验证码",
        verify: "验证 OTP",
        verifying: "验证中...",
        resend: "重新发送 OTP",
        resending: "重新发送中...",
        reset: "再次提交请求",
        secure: "您的取件请求资料将被安全及私密地保存。",
        successTitle: "取件请求验证成功",
        successText: "您的快递取件请求已确认，我们的团队会尽快处理并联系您。",

        required: "此字段为必填。",
        invalidEmail: "请输入有效邮箱地址。",
        invalidSenderPhone:
            "请输入有效的尼泊尔 (9XXXXXXXXX) 或香港 (8XXXXXXX) 电话号码。",
        invalidReceiverPhone:
            "请输入有效的尼泊尔 (9XXXXXXXXX) 或香港 (8XXXXXXX) 电话号码。",
        invalidWeight: "请输入有效的正数重量。",
        invalidQuantity: "数量必须至少为 1。",
        invalidOtp: "请输入验证码。",
        confirmRequired: "提交前必须确认请求。",
        emailRequiredForVerification: "当验证方式为邮箱时，寄件人邮箱为必填。",
        selectPickupDateFirst: "请先选择取件日期",
        captchaRequired: "请先完成 reCAPTCHA 验证。",
        serviceType: "服务类型",
        route: "路线",
    },
};

const initialForm = {
    senderName: "",
    senderPhone: "",
    senderEmail: "",
    deliveryType: "door2door",
    pickupAddress: "",
    pickupDate: "",
    pickupTimeSlot: "",
    serviceSpeed: "standard",
    receiverName: "",
    receiverPhone: "",
    deliveryAddress: "",
    pickupAddressHK: {
        street: "",
        floor: "",
        district: "",
    },
    deliveryAddressHK: {
        street: "",
        floor: "",
        district: "",
    },
    packageType: "",
    weight: "",
    quantity: 1,
    dimensions: "",
    isFragile: false,
    paymentMethod: "card / cheque",
    specialInstructions: "",
    isConfirmed: false,
    verificationMethod: "phone",
};

const SERVICE_CONFIG = {
    "door-to-door": {
        icon: Home,
        theme: {
            sectionBg: "bg-[#f6f3ef]",
            softBg: "bg-emerald-50",
            softBorder: "border-emerald-200",
            softText: "text-emerald-700",
            iconBg: "bg-emerald-100",
            iconText: "text-emerald-700",
            gradient:
                "bg-[linear-gradient(90deg,#bbf7d0_0%,#22c55e_45%,#15803d_100%)]",
            button:
                "bg-[linear-gradient(90deg,#22c55e_0%,#16a34a_45%,#15803d_100%)] shadow-[0_18px_40px_rgba(34,197,94,0.28)]",
            focusColor: "#22c55e",
        },
        label: {
            en: "Door to Door",
            ne: "घरदेखि घरसम्म",
            zh: "门到门",
        },
        badge: {
            en: "Local Delivery",
            ne: "स्थानीय डेलिभरी",
            zh: "本地配送",
        },
        routeFrom: {
            en: "Pickup Address",
            ne: "पिकअप ठेगाना",
            zh: "取件地址",
        },
        routeTo: {
            en: "Delivery Address",
            ne: "डेलिभरी ठेगाना",
            zh: "送达地址",
        },
        titleB: {
            en: "door to door",
            ne: "घरदेखि घरसम्म",
            zh: "门到门",
        },
        subtitle: {
            en: "Book a local pickup and delivery request from one address directly to another.",
            ne: "एक स्थानीय ठेगानाबाट अर्को ठेगानासम्म सिधै पिकअप र डेलिभरी अनुरोध गर्नुहोस्।",
            zh: "预约本地从一个地址直接送到另一个地址的取件服务。",
        },
        note: {
            en: "Use this form when both pickup and delivery are local. Example: within Hong Kong, within Kathmandu, or city-to-city local delivery.",
            ne: "पिकअप र डेलिभरी दुवै स्थानीय हुँदा यो फारम प्रयोग गर्नुहोस्। जस्तै: हङकङ भित्र, काठमाडौं भित्र, वा स्थानीय शहरदेखि शहर डेलिभरी।",
            zh: "当取件和派送都属于本地配送时使用此表格。例如：香港本地、加德满都市内或本地城市之间配送。",
        },
        pickupAddressLabel: {
            en: "Pickup Address",
            ne: "पिकअप ठेगाना",
            zh: "取件地址",
        },
        deliveryAddressLabel: {
            en: "Delivery Address",
            ne: "डेलिभरी ठेगाना",
            zh: "送达地址",
        },
        pickupPlaceholder: {
            en: "Enter pickup address",
            ne: "पिकअप ठेगाना हाल्नुहोस्",
            zh: "输入取件地址",
        },
        deliveryPlaceholder: {
            en: "Enter delivery address",
            ne: "डेलिभरी ठेगाना हाल्नुहोस्",
            zh: "输入送达地址",
        },
        deliveryType: "door2door",
        lockDeliveryType: true,
    },

    "hk-to-nepal": {
        icon: PlaneTakeoff,
        theme: {
            sectionBg: "bg-[#f5f7ff]",
            softBg: "bg-blue-50",
            softBorder: "border-blue-200",
            softText: "text-blue-700",
            iconBg: "bg-blue-100",
            iconText: "text-blue-700",
            gradient:
                "bg-[linear-gradient(90deg,#dbeafe_0%,#3b82f6_45%,#1d4ed8_100%)]",
            button:
                "bg-[linear-gradient(90deg,#3b82f6_0%,#2563eb_45%,#1d4ed8_100%)] shadow-[0_18px_40px_rgba(59,130,246,0.30)]",
            focusColor: "#3b82f6",
        },
        label: {
            en: "HK to Nepal",
            ne: "हङकङदेखि नेपाल",
            zh: "香港到尼泊尔",
        },
        badge: {
            en: "International Courier",
            ne: "अन्तर्राष्ट्रिय कुरियर",
            zh: "国际快递",
        },
        routeFrom: {
            en: "Hong Kong",
            ne: "हङकङ",
            zh: "香港",
        },
        routeTo: {
            en: "Nepal",
            ne: "नेपाल",
            zh: "尼泊尔",
        },
        titleB: {
            en: "HK to Nepal",
            ne: "हङकङदेखि नेपाल",
            zh: "香港到尼泊尔",
        },
        subtitle: {
            en: "Send parcels from Hong Kong to Nepal with secure pickup and tracking support.",
            ne: "हङकङबाट नेपालमा सुरक्षित पिकअप र ट्र्याकिङसहित पार्सल पठाउनुहोस्।",
            zh: "从香港寄送包裹到尼泊尔，支持安全取件及追踪。",
        },
        note: {
            en: "Use this form when the parcel starts from Hong Kong and the final receiver is in Nepal.",
            ne: "पार्सल हङकङबाट सुरु भएर अन्तिम प्राप्तकर्ता नेपालमा हुँदा यो फारम प्रयोग गर्नुहोस्।",
            zh: "当包裹从香港寄出，最终收件人在尼泊尔时使用此表格。",
        },
        pickupAddressLabel: {
            en: "Pickup Address in Hong Kong",
            ne: "हङकङको पिकअप ठेगाना",
            zh: "香港取件地址",
        },
        deliveryAddressLabel: {
            en: "Delivery Address in Nepal",
            ne: "नेपालको डेलिभरी ठेगाना",
            zh: "尼泊尔送达地址",
        },
        pickupPlaceholder: {
            en: "Hong Kong pickup address",
            ne: "हङकङको पिकअप ठेगाना",
            zh: "香港取件地址",
        },
        deliveryPlaceholder: {
            en: "Nepal delivery address",
            ne: "नेपालको डेलिभरी ठेगाना",
            zh: "尼泊尔送达地址",
        },
        deliveryType: "door2door",
        lockDeliveryType: false,
    },

    "nepal-to-hk": {
        icon: PlaneLanding,
        theme: {
            sectionBg: "bg-[#fff7ed]",
            softBg: "bg-orange-50",
            softBorder: "border-orange-200",
            softText: "text-orange-700",
            iconBg: "bg-orange-100",
            iconText: "text-orange-700",
            gradient:
                "bg-[linear-gradient(90deg,#ffedd5_0%,#f97316_45%,#c2410c_100%)]",
            button:
                "bg-[linear-gradient(90deg,#fb923c_0%,#f97316_45%,#c2410c_100%)] shadow-[0_18px_40px_rgba(249,115,22,0.30)]",
            focusColor: "#f97316",
        },
        label: {
            en: "Nepal to HK",
            ne: "नेपालदेखि हङकङ",
            zh: "尼泊尔到香港",
        },
        badge: {
            en: "International Courier",
            ne: "अन्तर्राष्ट्रिय कुरियर",
            zh: "国际快递",
        },
        routeFrom: {
            en: "Nepal",
            ne: "नेपाल",
            zh: "尼泊尔",
        },
        routeTo: {
            en: "Hong Kong",
            ne: "हङकङ",
            zh: "香港",
        },
        titleB: {
            en: "Nepal to HK",
            ne: "नेपालदेखि हङकङ",
            zh: "尼泊尔到香港",
        },
        subtitle: {
            en: "Send parcels from Nepal to Hong Kong with verified courier pickup service.",
            ne: "नेपालबाट हङकङमा प्रमाणित कुरियर पिकअप सेवासहित पार्सल पठाउनुहोस्।",
            zh: "从尼泊尔寄送包裹到香港，提供验证快递取件服务。",
        },
        note: {
            en: "Use this form when the parcel starts from Nepal and the final receiver is in Hong Kong.",
            ne: "पार्सल नेपालबाट सुरु भएर अन्तिम प्राप्तकर्ता हङकङमा हुँदा यो फारम प्रयोग गर्नुहोस्।",
            zh: "当包裹从尼泊尔寄出，最终收件人在香港时使用此表格。",
        },
        pickupAddressLabel: {
            en: "Pickup Address in Nepal",
            ne: "नेपालको पिकअप ठेगाना",
            zh: "尼泊尔取件地址",
        },
        deliveryAddressLabel: {
            en: "Delivery Address in Hong Kong",
            ne: "हङकङको डेलिभरी ठेगाना",
            zh: "香港送达地址",
        },
        pickupPlaceholder: {
            en: "Nepal pickup address",
            ne: "नेपालको पिकअप ठेगाना",
            zh: "尼泊尔取件地址",
        },
        deliveryPlaceholder: {
            en: "Hong Kong delivery address",
            ne: "हङकङको डेलिभरी ठेगाना",
            zh: "香港送达地址",
        },
        deliveryType: "door2door",
        lockDeliveryType: false,
    },
};

function pick(obj, locale = "en", fallback = "") {
    return obj?.[locale] || obj?.en || fallback;
}

function getErrorText(err) {
    const data = err?.response?.data;
    const message =
        data?.message ||
        data?.error ||
        data?.success ||
        (Array.isArray(data?.errors) ? data.errors[0] : null) ||
        err?.message;

    if (typeof message === "string") return message;

    if (message && typeof message === "object") {
        const first = Object.values(message).flat().find(Boolean);
        if (typeof first === "string") return first;
    }

    return "Something went wrong. Please try again.";
}

function Field({ label, icon: Icon, required = true, error, children, color = "#4b63ff" }) {
    return (
        <label className="block space-y-2">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
                {Icon ? <Icon className="h-3.5 w-3.5" style={{ color }} /> : null}
                {label}
                {required ? <span style={{ color }}>*</span> : null}
            </span>
            {children}
            {error ? <p className="text-xs text-red-500">{error}</p> : null}
        </label>
    );
}

function SectionTitle({ title }) {
    return (
        <div className="mb-2 pt-2">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-700">
                {title}
            </h3>
        </div>
    );
}

function inputClass(hasError) {
    return [
        "w-full rounded-2xl border bg-white px-4 text-sm text-neutral-800 outline-none transition",
        "placeholder:text-neutral-400 focus:ring-4",
        hasError
            ? "border-red-300 focus:border-red-400 focus:ring-red-100"
            : "border-neutral-200 focus:border-[#4b63ff] focus:ring-[#4b63ff]/10",
    ].join(" ");
}

function handlePhoneBlur(name, value, setForm) {
    const formatted = normalizePhone(value);

    setForm((prev) => ({
        ...prev,
        [name]: formatted,
    }));
}

function normalizePhone(value = "") {
    const raw = value.trim();

    // Remove everything except digits
    const digits = raw.replace(/\D/g, "");

    // Nepal number (10 digits)
    if (digits.length === 10) {
        return `+977-${digits}`;
    }

    // Hong Kong number (8 digits)
    if (digits.length === 8) {
        return `+852-${digits}`;
    }

    // If user typed country code manually
    if (digits.startsWith("977") && digits.length === 13) {
        return `+977-${digits.slice(3)}`;
    }

    if (digits.startsWith("852") && digits.length === 11) {
        return `+852-${digits.slice(3)}`;
    }

    return raw;
}

function isValidPhone(value = "") {
    const cleaned = value.replace(/\s/g, "");

    return (
        /^\+977-\d{10}$/.test(cleaned) ||
        /^\+852-\d{8}$/.test(cleaned) ||
        /^\d{10}$/.test(cleaned) ||
        /^\d{8}$/.test(cleaned)
    );
}

function formatSlotLabel(startHour) {
    const endHour = startHour + 2;

    const formatHour = (hour) => {
        const suffix = hour >= 12 ? "PM" : "AM";
        const normalized = hour % 12 === 0 ? 12 : hour % 12;
        return `${normalized}:00 ${suffix}`;
    };

    return `${formatHour(startHour)} - ${formatHour(endHour)}`;
}

function getTimeSlotsForDate(dateStr) {
    const slotStarts = [9, 11, 13, 15, 17, 19];

    if (!dateStr) {
        return slotStarts.map((hour) => ({
            value: formatSlotLabel(hour),
            label: formatSlotLabel(hour),
        }));
    }

    const now = new Date();
    const selectedDate = new Date(`${dateStr}T00:00:00`);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const minAllowed = new Date(now.getTime() + 60 * 60 * 1000);

    return slotStarts
        .filter((startHour) => {
            const slotStart = new Date(selectedDate);
            slotStart.setHours(startHour, 0, 0, 0);

            if (selectedDate.getTime() !== today.getTime()) return true;

            return slotStart >= minAllowed;
        })
        .map((hour) => ({
            value: formatSlotLabel(hour),
            label: formatSlotLabel(hour),
        }));
}

const HK_DISTRICTS = [
    "Central and Western",
    "Eastern",
    "Southern",
    "Wan Chai",
    "Sham Shui Po",
    "Kowloon City",
    "Kwun Tong",
    "Wong Tai Sin",
    "Yau Tsim Mong",
    "Islands",
    "Kwai Tsing",
    "North",
    "Sai Kung",
    "Sha Tin",
    "Tai Po",
    "Tsuen Wan",
    "Tuen Mun",
    "Yuen Long",
];

function formatHongKongAddress(address) {
    return [
        `Street / Building: ${address.street?.trim() || ""}`,
        `Floor / Unit: ${address.floor?.trim() || ""}`,
        `District: ${address.district?.trim() || ""}`,
    ].join(", ");
}

function shouldUseHongKongPickup(serviceType) {
    return (
        serviceType === "door-to-door" ||
        serviceType === "hk-to-nepal"
    );
}

function shouldUseHongKongDelivery(serviceType) {
    return (
        serviceType === "door-to-door" ||
        serviceType === "nepal-to-hk"
    );
}

export default function AiExpressPickupForm({
    locale = "en",
    serviceType = "door-to-door",
}) {
    const t = COPY[locale] || COPY.en;

    const activeService =
        SERVICE_CONFIG[serviceType] || SERVICE_CONFIG["door-to-door"];

    const ServiceIcon = activeService.icon || Truck;
    const theme = activeService.theme;

    const serviceTitle = pick(activeService.titleB, locale, "Door to Door");
    const serviceSubtitle = pick(activeService.subtitle, locale, "");
    const serviceBadge = pick(activeService.badge, locale, serviceTitle);
    const serviceNote = pick(activeService.note, locale, serviceSubtitle);
    const routeFrom = pick(activeService.routeFrom, locale, "");
    const routeTo = pick(activeService.routeTo, locale, "");

    const pickupAddressLabel = pick(
        activeService.pickupAddressLabel,
        locale,
        t.pickupAddress
    );
    const deliveryAddressLabel = pick(
        activeService.deliveryAddressLabel,
        locale,
        t.deliveryAddress
    );
    const pickupAddressPlaceholder = pick(
        activeService.pickupPlaceholder,
        locale,
        t.placeholders.pickupAddress
    );
    const deliveryAddressPlaceholder = pick(
        activeService.deliveryPlaceholder,
        locale,
        t.placeholders.deliveryAddress
    );

    const [form, setForm] = useState({
        ...initialForm,
        deliveryType: activeService.deliveryType || initialForm.deliveryType,
    });

    const [errors, setErrors] = useState({});
    const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
    const [requestMeta, setRequestMeta] = useState(null);
    const [step, setStep] = useState("form");
    const [submitLoading, setSubmitLoading] = useState(false);
    const [verifyLoading, setVerifyLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [banner, setBanner] = useState({ type: "", text: "" });

    const otpRefs = useMemo(
        () => Array.from({ length: 6 }, () => ({ current: null })),
        []
    );

    const { executeRecaptcha } = useGoogleReCaptcha();

    const availableTimeSlots = useMemo(() => {
        return getTimeSlotsForDate(form.pickupDate);
    }, [form.pickupDate]);

    const verificationValue = useMemo(() => {
        return form.verificationMethod === "phone"
            ? form.senderPhone
            : form.senderEmail;
    }, [form.verificationMethod, form.senderPhone, form.senderEmail]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        const isNested =
            name.startsWith("pickupAddressHK.") ||
            name.startsWith("deliveryAddressHK.");

        setForm((prev) => {
            let updated = { ...prev };

            if (isNested) {
                const [parent, child] = name.split(".");

                updated[parent] = {
                    ...prev[parent],
                    [child]: value,
                };
            } else {
                let updatedValue = type === "checkbox" ? checked : value;

                updated[name] = updatedValue;
            }

            if (name === "pickupDate") {
                updated.pickupTimeSlot = "";
            }

            return updated;
        });

        setErrors((prev) => ({ ...prev, [name]: "", pickupTimeSlot: "" }));
        setBanner({ type: "", text: "" });
    };

    const handleOtpChange = (index, value) => {
        const cleaned = value
            .replace(/[^a-zA-Z0-9]/g, "")
            .slice(-1)
            .toUpperCase();

        setOtpValues((prev) => {
            const next = [...prev];
            next[index] = cleaned;
            return next;
        });

        setErrors((prev) => ({ ...prev, otp: "" }));

        if (cleaned && index < 5) {
            otpRefs[index + 1]?.current?.focus();
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();

        const pasted = e.clipboardData
            .getData("text")
            .replace(/[^a-zA-Z0-9]/g, "")
            .slice(0, 6)
            .toUpperCase();

        if (!pasted) return;

        const next = ["", "", "", "", "", ""];
        pasted.split("").forEach((char, i) => {
            next[i] = char;
        });

        setOtpValues(next);
        setErrors((prev) => ({ ...prev, otp: "" }));

        const focusIndex = Math.min(pasted.length, 5);
        otpRefs[focusIndex]?.current?.focus();
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === "Backspace") {
            if (otpValues[index]) {
                setOtpValues((prev) => {
                    const next = [...prev];
                    next[index] = "";
                    return next;
                });
            } else if (index > 0) {
                otpRefs[index - 1]?.current?.focus();
                setOtpValues((prev) => {
                    const next = [...prev];
                    next[index - 1] = "";
                    return next;
                });
            }
        }

        if (e.key === "ArrowLeft" && index > 0) {
            otpRefs[index - 1]?.current?.focus();
        }

        if (e.key === "ArrowRight" && index < 5) {
            otpRefs[index + 1]?.current?.focus();
        }
    };

    const clearOtp = () => {
        setOtpValues(["", "", "", "", "", ""]);
        setErrors((prev) => ({ ...prev, otp: "" }));
        otpRefs[0]?.current?.focus();
    };

    const validate = () => {
        const nextErrors = {};
        const pickupUsesHK = shouldUseHongKongPickup(serviceType);
        const deliveryUsesHK = shouldUseHongKongDelivery(serviceType);

        if (!form.senderName.trim()) nextErrors.senderName = t.required;
        const senderDigits = form.senderPhone.replace(/\D/g, "");
        const receiverDigits = form.receiverPhone.replace(/\D/g, "");

        // Sender phone validation
        if (!form.senderPhone.trim()) {
            nextErrors.senderPhone = t.required;
        } else if (
            senderDigits.length !== 8 &&
            senderDigits.length !== 10 &&
            senderDigits.length !== 11 &&
            senderDigits.length !== 13
        ) {
            nextErrors.senderPhone =
                "Phone number must be 8 digits (Hong Kong) or 10 digits (Nepal).";
        } else if (
            senderDigits.length === 8 &&
            !/^\d{8}$/.test(senderDigits)
        ) {
            nextErrors.senderPhone =
                "Hong Kong number must contain exactly 8 digits.";
        } else if (
            senderDigits.length === 10 &&
            !/^\d{10}$/.test(senderDigits)
        ) {
            nextErrors.senderPhone =
                "Nepal number must contain exactly 10 digits.";
        } else if (
            senderDigits.length === 11 &&
            !/^852\d{8}$/.test(senderDigits)
        ) {
            nextErrors.senderPhone =
                "Hong Kong number format should be +852-XXXXXXXX.";
        } else if (
            senderDigits.length === 13 &&
            !/^977\d{10}$/.test(senderDigits)
        ) {
            nextErrors.senderPhone =
                "Nepal number format should be +977-XXXXXXXXXX.";
        }

        if (form.senderEmail.trim() && !/^\S+@\S+\.\S+$/.test(form.senderEmail)) {
            nextErrors.senderEmail = t.invalidEmail;
        }

        if (!form.deliveryType) nextErrors.deliveryType = t.required;
        if (!form.pickupDate) nextErrors.pickupDate = t.required;
        if (!form.pickupTimeSlot.trim()) nextErrors.pickupTimeSlot = t.required;
        if (!form.serviceSpeed) nextErrors.serviceSpeed = t.required;

        if (!form.receiverName.trim()) nextErrors.receiverName = t.required;
        // Receiver phone validation
        if (!form.receiverPhone.trim()) {
            nextErrors.receiverPhone = t.required;
        } else if (
            receiverDigits.length !== 8 &&
            receiverDigits.length !== 10 &&
            receiverDigits.length !== 11 &&
            receiverDigits.length !== 13
        ) {
            nextErrors.receiverPhone =
                "Phone number must be 8 digits (Hong Kong) or 10 digits (Nepal).";
        } else if (
            receiverDigits.length === 8 &&
            !/^\d{8}$/.test(receiverDigits)
        ) {
            nextErrors.receiverPhone =
                "Hong Kong number must contain exactly 8 digits.";
        } else if (
            receiverDigits.length === 10 &&
            !/^\d{10}$/.test(receiverDigits)
        ) {
            nextErrors.receiverPhone =
                "Nepal number must contain exactly 10 digits.";
        } else if (
            receiverDigits.length === 11 &&
            !/^852\d{8}$/.test(receiverDigits)
        ) {
            nextErrors.receiverPhone =
                "Hong Kong number format should be +852-XXXXXXXX.";
        } else if (
            receiverDigits.length === 13 &&
            !/^977\d{10}$/.test(receiverDigits)
        ) {
            nextErrors.receiverPhone =
                "Nepal number format should be +977-XXXXXXXXXX.";
        }

        if (!form.packageType.trim()) nextErrors.packageType = t.required;

        if (form.weight === "" || form.weight === null || form.weight === undefined) {
            nextErrors.weight = t.required;
        } else if (!(Number(form.weight) > 0)) {
            nextErrors.weight = t.invalidWeight;
        }

        if (
            form.quantity === "" ||
            form.quantity === null ||
            form.quantity === undefined
        ) {
            nextErrors.quantity = t.required;
        } else if (!(Number(form.quantity) >= 1)) {
            nextErrors.quantity = t.invalidQuantity;
        }

        if (!form.paymentMethod) nextErrors.paymentMethod = t.required;
        if (!form.verificationMethod) nextErrors.verificationMethod = t.required;

        if (form.verificationMethod === "email" && !form.senderEmail.trim()) {
            nextErrors.senderEmail = t.emailRequiredForVerification;
        }

        if (!form.isConfirmed) {
            nextErrors.isConfirmed = t.confirmRequired;
        }

        if (pickupUsesHK) {
            if (!form.pickupAddressHK.street.trim()) {
                nextErrors["pickupAddressHK.street"] = t.required;
            }

            if (!form.pickupAddressHK.floor.trim()) {
                nextErrors["pickupAddressHK.floor"] = t.required;
            }

            if (!form.pickupAddressHK.district.trim()) {
                nextErrors["pickupAddressHK.district"] = t.required;
            }
        } else {
            if (!form.pickupAddress.trim()) {
                nextErrors.pickupAddress = t.required;
            }
        }

        if (deliveryUsesHK) {
            if (!form.deliveryAddressHK.street.trim()) {
                nextErrors["deliveryAddressHK.street"] = t.required;
            }

            if (!form.deliveryAddressHK.floor.trim()) {
                nextErrors["deliveryAddressHK.floor"] = t.required;
            }

            if (!form.deliveryAddressHK.district.trim()) {
                nextErrors["deliveryAddressHK.district"] = t.required;
            }
        } else {
            if (!form.deliveryAddress.trim()) {
                nextErrors.deliveryAddress = t.required;
            }
        }

        console.log("VALIDATION ERRORS:", nextErrors);

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        if (!executeRecaptcha) {
            setErrors((prev) => ({
                ...prev,
                captcha: t.captchaRequired,
            }));
            return;
        }

        setSubmitLoading(true);
        setBanner({ type: "", text: "" });

        try {
            const recaptchaToken = await executeRecaptcha("courier_pickup_submit");

            if (!recaptchaToken || typeof recaptchaToken !== "string") {
                setErrors((prev) => ({
                    ...prev,
                    captcha: t.captchaRequired,
                }));
                setBanner({
                    type: "error",
                    text: t.captchaRequired,
                });
                return;
            }

            const finalPickupAddress = shouldUseHongKongPickup(serviceType)
                ? formatHongKongAddress(form.pickupAddressHK)
                : form.pickupAddress.trim();

            const finalDeliveryAddress = shouldUseHongKongDelivery(serviceType)
                ? formatHongKongAddress(form.deliveryAddressHK)
                : form.deliveryAddress.trim();

            const payload = {
                serviceType,
                senderName: form.senderName.trim(),
                senderPhone: form.senderPhone.trim(),
                senderEmail: form.senderEmail.trim() || null,
                deliveryType: form.deliveryType,
                pickupAddress: finalPickupAddress,
                deliveryAddress: finalDeliveryAddress,
                pickupDate: form.pickupDate,
                pickupTimeSlot: form.pickupTimeSlot.trim(),
                serviceSpeed: form.serviceSpeed,
                receiverName: form.receiverName.trim(),
                receiverPhone: form.receiverPhone.trim(),
                packageType: form.packageType.trim(),
                weight: Number(form.weight),
                quantity: Number(form.quantity),
                dimensions: form.dimensions.trim() || null,
                isFragile: Boolean(form.isFragile),
                paymentMethod: form.paymentMethod,
                specialInstructions: form.specialInstructions.trim() || null,
                isConfirmed: true,
                verificationMethod: form.verificationMethod,
                recaptchaToken,
            };

            const res = await http.post(
                "/frontend/courierPickupForm/submit",
                payload
            );

            const data = res?.data || {};

            setRequestMeta({
                id: data?.id,
                expiresAt: data?.expiresAt,
            });

            setStep("otp");
            setOtpValues(["", "", "", "", "", ""]);
            setErrors((prev) => ({ ...prev, otp: "" }));
            setBanner({
                type: "success",
                text: data?.success || t.verifyText,
            });
        } catch (err) {
            setBanner({ type: "error", text: getErrorText(err) });
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();

        const otp = otpValues.join("").trim();

        if (otp.length !== 6) {
            setErrors((prev) => ({ ...prev, otp: t.invalidOtp }));
            return;
        }

        setVerifyLoading(true);
        setBanner({ type: "", text: "" });

        try {
            const res = await http.post(
                "/frontend/courierPickupForm/verify-otp",
                {
                    id: requestMeta?.id,
                    otp: otp.trim(),
                }
            );

            setStep("success");
            setBanner({
                type: "success",
                text: res?.data?.success || t.successText,
            });
        } catch (err) {
            setBanner({ type: "error", text: getErrorText(err) });
        } finally {
            setVerifyLoading(false);
        }
    };

    const handleResend = async () => {
        if (!requestMeta?.id) return;

        setResendLoading(true);
        setBanner({ type: "", text: "" });

        try {
            const res = await http.post(
                "/frontend/courierPickupForm/resend-otp",
                {
                    id: requestMeta.id,
                }
            );

            setRequestMeta((prev) => ({
                ...prev,
                expiresAt: res?.data?.expiresAt || prev?.expiresAt,
            }));

            setBanner({
                type: "success",
                text: res?.data?.success || `${t.resend}.`,
            });
        } catch (err) {
            setBanner({ type: "error", text: getErrorText(err) });
        } finally {
            setResendLoading(false);
        }
    };

    const resetAll = () => {
        setForm({
            ...initialForm,
            deliveryType: activeService.deliveryType || initialForm.deliveryType,
        });
        setErrors({});
        setOtpValues(["", "", "", "", "", ""]);
        setRequestMeta(null);
        setStep("form");
        setBanner({ type: "", text: "" });
    };

    return (
        <section
            className={`relative overflow-hidden px-4 py-14 sm:px-6 lg:px-8 lg:py-20 ${theme.sectionBg}`}
        >
            <div className="absolute inset-x-0 top-0 h-[340px] bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.20)_0%,rgba(246,243,239,0)_60%)]" />

            <div className="relative mx-auto max-w-5xl">
                <div className="mb-8 text-center sm:mb-10 sm:text-left">
                    <div className="mb-4 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-neutral-500">
                        <span className="h-px w-10 bg-neutral-300" />
                        {t.eyebrow}
                    </div>

                    <h1 className="max-w-3xl text-4xl font-medium leading-tight text-neutral-900 sm:text-5xl">
                        {t.titleA}{" "}
                        <span className={`font-serif italic ${theme.softText}`}>
                            {serviceTitle}
                        </span>
                        <br />
                        {t.titleC}
                    </h1>

                    <p className="mt-5 max-w-2xl text-sm leading-7 text-neutral-500 sm:text-base">
                        {serviceSubtitle}
                    </p>
                </div>

                <div className="rounded-[30px] border border-black/5 bg-white/90 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.10)] backdrop-blur sm:p-8">
                    <div className={`mb-6 h-1 w-full rounded-full ${theme.gradient}`} />

                    <div
                        className={`mb-6 rounded-3xl border p-5 ${theme.softBg} ${theme.softBorder}`}
                    >
                        <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
                            <div className="flex gap-4">
                                <div
                                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${theme.iconBg} ${theme.iconText}`}
                                >
                                    <ServiceIcon className="h-6 w-6" />
                                </div>

                                <div>
                                    <div
                                        className={`mb-2 inline-flex rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] shadow-sm ${theme.softText}`}
                                    >
                                        {serviceBadge}
                                    </div>

                                    <h2 className="text-xl font-semibold text-neutral-900">
                                        {serviceTitle}
                                    </h2>

                                    <p className="mt-2 text-sm leading-7 text-neutral-600">
                                        {serviceNote}
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-2xl bg-white p-4 shadow-sm">
                                <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
                                    <Globe2 className="h-3.5 w-3.5" />
                                    {t.route}
                                </div>

                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <div className="text-xs text-neutral-400">From</div>
                                        <div className="text-sm font-semibold text-neutral-900">
                                            {routeFrom}
                                        </div>
                                    </div>

                                    <ArrowRight className={`h-4 w-4 ${theme.softText}`} />

                                    <div className="text-right">
                                        <div className="text-xs text-neutral-400">To</div>
                                        <div className="text-sm font-semibold text-neutral-900">
                                            {routeTo}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 rounded-xl bg-neutral-50 px-3 py-2">
                                    <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
                                        {t.serviceType}
                                    </div>
                                    <div className={`mt-1 text-sm font-semibold ${theme.softText}`}>
                                        {serviceTitle}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {banner.text ? (
                        <div
                            className={[
                                "mb-5 rounded-2xl border px-4 py-3 text-sm",
                                banner.type === "error"
                                    ? "border-red-200 bg-red-50 text-red-700"
                                    : "border-emerald-200 bg-emerald-50 text-emerald-700",
                            ].join(" ")}
                        >
                            {banner.text}
                        </div>
                    ) : null}

                    {step === "form" ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <SectionTitle title={t.senderInfo} />

                            <div className="grid gap-5 md:grid-cols-2">
                                <Field
                                    label={t.senderName}
                                    icon={User}
                                    error={errors.senderName}
                                    color={theme.focusColor}
                                >
                                    <input
                                        name="senderName"
                                        value={form.senderName}
                                        onChange={handleChange}
                                        placeholder={t.placeholders.senderName}
                                        className={`${inputClass(!!errors.senderName)} h-12`}
                                    />
                                </Field>

                                <Field
                                    label={t.senderPhone}
                                    icon={Phone}
                                    error={errors.senderPhone}
                                    color={theme.focusColor}
                                >
                                    <input
                                        name="senderPhone"
                                        value={form.senderPhone}
                                        onChange={handleChange}
                                        onBlur={(e) =>
                                            handlePhoneBlur(
                                                "senderPhone",
                                                e.target.value,
                                                setForm
                                            )
                                        }
                                        placeholder="9800000000 or 91234567"
                                        className={`${inputClass(!!errors.senderPhone)} h-12`}
                                    />
                                </Field>
                            </div>

                            <Field
                                label={t.senderEmail}
                                icon={Mail}
                                error={errors.senderEmail}
                                required={false}
                                color={theme.focusColor}
                            >
                                <input
                                    type="email"
                                    name="senderEmail"
                                    value={form.senderEmail}
                                    onChange={handleChange}
                                    placeholder={t.placeholders.senderEmail}
                                    className={`${inputClass(!!errors.senderEmail)} h-12`}
                                />
                            </Field>

                            <div className="grid gap-5 md:grid-cols-2">
                                <Field
                                    label={t.deliveryType}
                                    icon={Truck}
                                    error={errors.deliveryType}
                                    color={theme.focusColor}
                                >
                                    <select
                                        name="deliveryType"
                                        value={form.deliveryType}
                                        onChange={handleChange}
                                        disabled={activeService.lockDeliveryType}
                                        className={`${inputClass(
                                            !!errors.deliveryType
                                        )} h-12 ${activeService.lockDeliveryType
                                            ? "cursor-not-allowed bg-neutral-50"
                                            : ""
                                            }`}
                                    >
                                        {t.deliveryTypes.map((item) => (
                                            <option key={item.value} value={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                    </select>
                                </Field>

                                <Field
                                    label={t.serviceSpeed}
                                    icon={Clock3}
                                    error={errors.serviceSpeed}
                                    color={theme.focusColor}
                                >
                                    <select
                                        name="serviceSpeed"
                                        value={form.serviceSpeed}
                                        onChange={handleChange}
                                        className={`${inputClass(!!errors.serviceSpeed)} h-12`}
                                    >
                                        {t.serviceSpeeds.map((item) => (
                                            <option key={item.value} value={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                    </select>
                                </Field>
                            </div>

                            {/* <Field
                                label={pickupAddressLabel}
                                icon={MapPin}
                                error={errors.pickupAddress}
                                color={theme.focusColor}
                            >
                                <input
                                    name="pickupAddress"
                                    value={form.pickupAddress}
                                    onChange={handleChange}
                                    placeholder={pickupAddressPlaceholder}
                                    className={`${inputClass(!!errors.pickupAddress)} h-12`}
                                />
                            </Field> */}

                            {shouldUseHongKongPickup(serviceType) ? (
                                <div className="space-y-5">
                                    <div className="grid gap-5 md:grid-cols-2">
                                        <Field
                                            label="Street / Building"
                                            icon={MapPin}
                                            error={errors["pickupAddressHK.street"]}
                                            color={theme.focusColor}
                                        >
                                            <input
                                                name="pickupAddressHK.street"
                                                value={form.pickupAddressHK.street}
                                                onChange={handleChange}
                                                placeholder="Street number, building name, block"
                                                className={`${inputClass(
                                                    !!errors["pickupAddressHK.street"]
                                                )} h-12`}
                                            />
                                        </Field>

                                        <Field
                                            label="Floor / Unit"
                                            icon={Home}
                                            error={errors["pickupAddressHK.floor"]}
                                            color={theme.focusColor}
                                        >
                                            <input
                                                name="pickupAddressHK.floor"
                                                value={form.pickupAddressHK.floor}
                                                onChange={handleChange}
                                                placeholder="Floor, flat or unit number"
                                                className={`${inputClass(
                                                    !!errors["pickupAddressHK.floor"]
                                                )} h-12`}
                                            />
                                        </Field>
                                    </div>

                                    <Field
                                        label="Hong Kong District"
                                        icon={Globe2}
                                        error={errors["pickupAddressHK.district"]}
                                        color={theme.focusColor}
                                    >
                                        <select
                                            name="pickupAddressHK.district"
                                            value={form.pickupAddressHK.district}
                                            onChange={handleChange}
                                            className={`${inputClass(
                                                !!errors["pickupAddressHK.district"]
                                            )} h-12`}
                                        >
                                            <option value="">Select District</option>

                                            {HK_DISTRICTS.map((district) => (
                                                <option key={district} value={district}>
                                                    {district}
                                                </option>
                                            ))}
                                        </select>
                                    </Field>
                                </div>
                            ) : (
                                <Field
                                    label={pickupAddressLabel}
                                    icon={MapPin}
                                    error={errors.pickupAddress}
                                    color={theme.focusColor}
                                >
                                    <input
                                        name="pickupAddress"
                                        value={form.pickupAddress}
                                        onChange={handleChange}
                                        placeholder={pickupAddressPlaceholder}
                                        className={`${inputClass(!!errors.pickupAddress)} h-12`}
                                    />
                                </Field>
                            )}

                            <div className="grid gap-5 md:grid-cols-2">
                                <Field
                                    label={t.pickupDate}
                                    icon={CalendarDays}
                                    error={errors.pickupDate}
                                    color={theme.focusColor}
                                >
                                    <input
                                        type="date"
                                        name="pickupDate"
                                        value={form.pickupDate}
                                        onChange={handleChange}
                                        min={new Date().toISOString().split("T")[0]}
                                        className={`${inputClass(!!errors.pickupDate)} h-12`}
                                    />
                                </Field>

                                <Field
                                    label={t.pickupTimeSlot}
                                    icon={Clock3}
                                    error={errors.pickupTimeSlot}
                                    color={theme.focusColor}
                                >
                                    <select
                                        name="pickupTimeSlot"
                                        value={form.pickupTimeSlot}
                                        onChange={handleChange}
                                        disabled={!form.pickupDate}
                                        className={`${inputClass(
                                            !!errors.pickupTimeSlot
                                        )} h-12`}
                                    >
                                        <option value="">
                                            {form.pickupDate
                                                ? t.choose
                                                : t.selectPickupDateFirst}
                                        </option>

                                        {availableTimeSlots.map((slot) => (
                                            <option key={slot.value} value={slot.value}>
                                                {slot.label}
                                            </option>
                                        ))}
                                    </select>
                                </Field>
                            </div>

                            <SectionTitle title={t.receiverInfo} />

                            <div className="grid gap-5 md:grid-cols-2">
                                <Field
                                    label={t.receiverName}
                                    icon={User}
                                    error={errors.receiverName}
                                    color={theme.focusColor}
                                >
                                    <input
                                        name="receiverName"
                                        value={form.receiverName}
                                        onChange={handleChange}
                                        placeholder={t.placeholders.receiverName}
                                        className={`${inputClass(!!errors.receiverName)} h-12`}
                                    />
                                </Field>

                                <Field
                                    label={t.receiverPhone}
                                    icon={Phone}
                                    error={errors.receiverPhone}
                                    color={theme.focusColor}
                                >
                                    <input
                                        name="receiverPhone"
                                        value={form.receiverPhone}
                                        onChange={handleChange}
                                        onBlur={(e) =>
                                            handlePhoneBlur(
                                                "receiverPhone",
                                                e.target.value,
                                                setForm
                                            )
                                        }
                                        placeholder="9800000000 or 91234567"
                                        className={`${inputClass(!!errors.receiverPhone)} h-12`}
                                    />
                                </Field>
                            </div>

                            {/* <Field
                                label={deliveryAddressLabel}
                                icon={MapPin}
                                error={errors.deliveryAddress}
                                color={theme.focusColor}
                            >
                                <input
                                    name="deliveryAddress"
                                    value={form.deliveryAddress}
                                    onChange={handleChange}
                                    placeholder={deliveryAddressPlaceholder}
                                    className={`${inputClass(!!errors.deliveryAddress)} h-12`}
                                />
                            </Field> */}

                            {shouldUseHongKongDelivery(serviceType) ? (
                                <div className="space-y-5">
                                    <div className="grid gap-5 md:grid-cols-2">
                                        <Field
                                            label="Street / Building"
                                            icon={MapPin}
                                            error={errors["deliveryAddressHK.street"]}
                                            color={theme.focusColor}
                                        >
                                            <input
                                                name="deliveryAddressHK.street"
                                                value={form.deliveryAddressHK.street}
                                                onChange={handleChange}
                                                placeholder="Street number, building name, block"
                                                className={`${inputClass(
                                                    !!errors["deliveryAddressHK.street"]
                                                )} h-12`}
                                            />
                                        </Field>

                                        <Field
                                            label="Floor / Unit"
                                            icon={Home}
                                            error={errors["deliveryAddressHK.floor"]}
                                            color={theme.focusColor}
                                        >
                                            <input
                                                name="deliveryAddressHK.floor"
                                                value={form.deliveryAddressHK.floor}
                                                onChange={handleChange}
                                                placeholder="Floor, flat or unit number"
                                                className={`${inputClass(
                                                    !!errors["deliveryAddressHK.floor"]
                                                )} h-12`}
                                            />
                                        </Field>
                                    </div>

                                    <Field
                                        label="Hong Kong District"
                                        icon={Globe2}
                                        error={errors["deliveryAddressHK.district"]}
                                        color={theme.focusColor}
                                    >
                                        <select
                                            name="deliveryAddressHK.district"
                                            value={form.deliveryAddressHK.district}
                                            onChange={handleChange}
                                            className={`${inputClass(
                                                !!errors["deliveryAddressHK.district"]
                                            )} h-12`}
                                        >
                                            <option value="">Select District</option>

                                            {HK_DISTRICTS.map((district) => (
                                                <option key={district} value={district}>
                                                    {district}
                                                </option>
                                            ))}
                                        </select>
                                    </Field>
                                </div>
                            ) : (
                                <Field
                                    label={deliveryAddressLabel}
                                    icon={MapPin}
                                    error={errors.deliveryAddress}
                                    color={theme.focusColor}
                                >
                                    <input
                                        name="deliveryAddress"
                                        value={form.deliveryAddress}
                                        onChange={handleChange}
                                        placeholder={deliveryAddressPlaceholder}
                                        className={`${inputClass(!!errors.deliveryAddress)} h-12`}
                                    />
                                </Field>
                            )}

                            <SectionTitle title={t.packageInfo} />

                            <div className="grid gap-5 md:grid-cols-2">
                                <Field
                                    label={t.packageType}
                                    icon={Package}
                                    error={errors.packageType}
                                    color={theme.focusColor}
                                >
                                    <input
                                        name="packageType"
                                        value={form.packageType}
                                        onChange={handleChange}
                                        placeholder={t.placeholders.packageType}
                                        className={`${inputClass(!!errors.packageType)} h-12`}
                                    />
                                </Field>

                                <Field
                                    label={t.weight}
                                    icon={Scale}
                                    error={errors.weight}
                                    color={theme.focusColor}
                                >
                                    <input
                                        type="number"
                                        name="weight"
                                        value={form.weight}
                                        onChange={handleChange}
                                        placeholder={t.placeholders.weight}
                                        min="0"
                                        step="0.01"
                                        className={`${inputClass(!!errors.weight)} h-12`}
                                    />
                                </Field>
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">
                                <Field
                                    label={t.quantity}
                                    icon={Hash}
                                    error={errors.quantity}
                                    color={theme.focusColor}
                                >
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={form.quantity}
                                        onChange={handleChange}
                                        placeholder={t.placeholders.quantity}
                                        min="1"
                                        step="1"
                                        className={`${inputClass(!!errors.quantity)} h-12`}
                                    />
                                </Field>

                                <Field
                                    label={t.dimensions}
                                    icon={Box}
                                    error={errors.dimensions}
                                    required={false}
                                    color={theme.focusColor}
                                >
                                    <input
                                        name="dimensions"
                                        value={form.dimensions}
                                        onChange={handleChange}
                                        placeholder={t.placeholders.dimensions}
                                        className={`${inputClass(!!errors.dimensions)} h-12`}
                                    />
                                </Field>
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">
                                <Field
                                    label={t.isFragile}
                                    icon={AlertTriangle}
                                    error={errors.isFragile}
                                    color={theme.focusColor}
                                >
                                    <select
                                        name="isFragile"
                                        value={String(form.isFragile)}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                isFragile: e.target.value === "true",
                                            }))
                                        }
                                        className={`${inputClass(!!errors.isFragile)} h-12`}
                                    >
                                        <option value="false">{t.no}</option>
                                        <option value="true">{t.yes}</option>
                                    </select>
                                </Field>

                                <Field
                                    label={t.paymentMethod}
                                    icon={CreditCard}
                                    error={errors.paymentMethod}
                                    color={theme.focusColor}
                                >
                                    <select
                                        name="paymentMethod"
                                        value={form.paymentMethod}
                                        onChange={handleChange}
                                        className={`${inputClass(!!errors.paymentMethod)} h-12`}
                                    >
                                        {t.paymentMethods.map((item) => (
                                            <option key={item.value} value={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                    </select>
                                </Field>
                            </div>

                            <Field
                                label={t.specialInstructions}
                                icon={ShieldCheck}
                                error={errors.specialInstructions}
                                required={false}
                                color={theme.focusColor}
                            >
                                <textarea
                                    name="specialInstructions"
                                    value={form.specialInstructions}
                                    onChange={handleChange}
                                    placeholder={t.placeholders.specialInstructions}
                                    rows={4}
                                    className={`${inputClass(
                                        !!errors.specialInstructions
                                    )} min-h-[110px] resize-none py-3`}
                                />
                            </Field>

                            <SectionTitle title={t.verificationInfo} />

                            <Field
                                label={t.verificationMethod}
                                icon={ShieldCheck}
                                error={errors.verificationMethod}
                                color={theme.focusColor}
                            >
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {t.verificationMethods.map((item) => {
                                        const active = form.verificationMethod === item.value;
                                        const disabled =
                                            item.value === "email" &&
                                            !form.senderEmail.trim();

                                        return (
                                            <button
                                                key={item.value}
                                                type="button"
                                                disabled={disabled}
                                                onClick={() =>
                                                    setForm((prev) => ({
                                                        ...prev,
                                                        verificationMethod: item.value,
                                                    }))
                                                }
                                                className={[
                                                    "rounded-2xl border px-4 py-3 text-left transition",
                                                    active
                                                        ? `${theme.softBorder} ${theme.softBg} shadow-[0_10px_25px_rgba(15,23,42,0.08)]`
                                                        : "border-neutral-200 bg-white hover:border-neutral-300",
                                                    disabled
                                                        ? "cursor-not-allowed opacity-50"
                                                        : "",
                                                ].join(" ")}
                                            >
                                                <div className="text-sm font-semibold text-neutral-900">
                                                    {item.label}
                                                </div>
                                                <div className="mt-1 text-xs text-neutral-500">
                                                    {item.value === "email"
                                                        ? form.senderEmail.trim() ||
                                                        t.placeholders.senderEmail
                                                        : form.senderPhone.trim() ||
                                                        t.placeholders.senderPhone}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </Field>

                            <label className="block">
                                <div className="flex items-start gap-3 rounded-2xl border border-neutral-200 bg-[#fafbff] px-4 py-3">
                                    <input
                                        type="checkbox"
                                        name="isConfirmed"
                                        checked={form.isConfirmed}
                                        onChange={handleChange}
                                        className="mt-1 h-4 w-4 rounded border-neutral-300"
                                        style={{ accentColor: theme.focusColor }}
                                    />
                                    <div>
                                        <div className="text-sm font-medium text-neutral-800">
                                            {t.confirmRequest}
                                        </div>
                                        {errors.isConfirmed ? (
                                            <p className="mt-1 text-xs text-red-500">
                                                {errors.isConfirmed}
                                            </p>
                                        ) : null}
                                    </div>
                                </div>
                            </label>

                            {errors.captcha ? (
                                <p className="text-sm text-red-500">{errors.captcha}</p>
                            ) : null}

                            <button
                                type="submit"
                                disabled={submitLoading}
                                className={`inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl px-6 text-sm font-semibold uppercase tracking-[0.26em] text-white transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-70 ${theme.button}`}
                            >
                                {submitLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : null}
                                {submitLoading ? t.sending : t.submit}
                                {!submitLoading ? <ArrowRight className="h-4 w-4" /> : null}
                            </button>
                        </form>
                    ) : null}

                    {step === "otp" ? (
                        <form onSubmit={handleVerify} className="space-y-6">
                            <div className={`rounded-[24px] border p-5 ${theme.softBg} ${theme.softBorder}`}>
                                <div
                                    className={`mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ${theme.softText}`}
                                >
                                    <Lock className="h-5 w-5" />
                                </div>
                                <h2 className="text-2xl font-semibold text-neutral-900">
                                    {t.verifyTitle}
                                </h2>
                                <p className="mt-2 text-sm leading-7 text-neutral-500">
                                    {t.verifyText}
                                </p>
                                <p className="mt-3 text-sm font-medium text-neutral-700">
                                    {verificationValue}
                                </p>
                                {requestMeta?.expiresAt ? (
                                    <p className="mt-1 text-xs text-neutral-500">
                                        Expires at:{" "}
                                        {new Date(requestMeta.expiresAt).toLocaleString()}
                                    </p>
                                ) : null}
                            </div>

                            <Field
                                label={t.otpLabel}
                                icon={ShieldCheck}
                                error={errors.otp}
                                color={theme.focusColor}
                            >
                                <div className="space-y-3">
                                    <div className="flex flex-wrap gap-2 sm:gap-3">
                                        {otpValues.map((digit, index) => (
                                            <input
                                                key={index}
                                                ref={(el) => {
                                                    otpRefs[index].current = el;
                                                }}
                                                type="text"
                                                inputMode="text"
                                                autoComplete={
                                                    index === 0 ? "one-time-code" : "off"
                                                }
                                                maxLength={1}
                                                value={digit}
                                                onChange={(e) =>
                                                    handleOtpChange(index, e.target.value)
                                                }
                                                onKeyDown={(e) =>
                                                    handleOtpKeyDown(index, e)
                                                }
                                                onPaste={handleOtpPaste}
                                                className={[
                                                    "h-14 w-12 rounded-2xl border bg-white text-center text-lg font-semibold uppercase outline-none transition sm:h-16 sm:w-14",
                                                    errors.otp
                                                        ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100"
                                                        : "border-neutral-200 focus:border-[#4b63ff] focus:ring-4 focus:ring-[#4b63ff]/10",
                                                ].join(" ")}
                                            />
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-neutral-500">
                                            {t.placeholders.otp}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={clearOtp}
                                            className="font-medium text-neutral-500 underline underline-offset-2 hover:text-neutral-700"
                                        >
                                            Clear
                                        </button>
                                    </div>
                                </div>
                            </Field>

                            <div className="grid gap-3 sm:grid-cols-2">
                                <button
                                    type="submit"
                                    disabled={verifyLoading}
                                    className={`inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70 ${theme.button}`}
                                >
                                    {verifyLoading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : null}
                                    {verifyLoading ? t.verifying : t.verify}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleResend}
                                    disabled={resendLoading}
                                    className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white px-5 text-sm font-semibold text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {resendLoading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <RefreshCcw className="h-4 w-4" />
                                    )}
                                    {resendLoading ? t.resending : t.resend}
                                </button>
                            </div>
                        </form>
                    ) : null}

                    {step === "success" ? (
                        <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 p-6 text-center">
                            <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white text-emerald-600 shadow-sm">
                                <CheckCircle2 className="h-8 w-8" />
                            </div>
                            <h2 className="text-2xl font-semibold text-neutral-900">
                                {t.successTitle}
                            </h2>
                            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-neutral-600">
                                {t.successText}
                            </p>
                            <button
                                type="button"
                                onClick={resetAll}
                                className="mt-6 inline-flex h-12 items-center justify-center rounded-2xl bg-neutral-900 px-6 text-sm font-semibold text-white transition hover:bg-neutral-800"
                            >
                                {t.reset}
                            </button>
                        </div>
                    ) : null}
                </div>

                <div className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-neutral-500">
                    <Lock className={`h-3.5 w-3.5 ${theme.softText}`} />
                    <span>{t.secure}</span>
                </div>
            </div>
        </section>
    );
}