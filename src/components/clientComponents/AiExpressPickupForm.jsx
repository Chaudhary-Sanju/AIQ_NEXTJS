"use client";

import { useEffect, useMemo, useState } from "react";
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
    Flame,
} from "lucide-react";
import http from "@/http";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useDispatch, useSelector } from "react-redux";
import { fromStorage, clearStorage } from "@/lib";
import { setUser, clearUser } from "@/store/userSlice";
import { INPUT_LIMITS } from "@/constants/inputLimits";
import CountryPhoneInput, { isValidCountryPhone, normalizeCountryPhone } from "@/components/clientComponents/CountryPhoneInput";

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
        isFlameable: "Flammable Item",
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
            noSlotsToday: "No time slots available for today",
            invalidTimeSlot: "Please select a valid future time slot.",
        },
        deliveryTypes: [
            { value: "door2door", label: "Door to Door" },
            { value: "door2branch", label: "Door to Branch" },
        ],
        paymentMethods: [
            { value: "Debit / Credit Card", label: "Debit / Credit Card" },
            { value: "Online Transfer / Payment", label: "Online Transfer / Payment" },
            { value: "Cash", label: "Cash" },
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
        invalidSenderPhone: "Enter 8 digits for Hong Kong or 10 digits for Nepal.",
        invalidReceiverPhone: "Enter 8 digits for Hong Kong or 10 digits for Nepal.",
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
        loggedInMessage: "✓ You're logged in. Your request will be submitted instantly without OTP verification.",
    },

    ne: {
        eyebrow: "AI EXPRESS",
        titleA: "अनुरोध",
        titleC: "पेश गर्नुहोस्",
        senderInfo: "पठाउने व्यक्तिको जानकारी",
        receiverInfo: "प्राप्तकर्ताको जानकारी",
        packageInfo: "पार्सल जानकारी",
        verificationInfo: "प्रमाणीकरण",
        senderName: "पठाउनेको नाम",
        senderPhone: "पठाउनेको फोन",
        senderEmail: "पठाउनेको इमेल",
        receiverName: "प्राप्तकर्ताको नाम",
        receiverPhone: "प्राप्तकर्ताको फोन",
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
        isFlameable: "ज्वलनशील सामान",
        paymentMethod: "भुक्तानी विधि",
        specialInstructions: "विशेष निर्देशन",
        verificationMethod: "प्रमाणीकरण विधि",
        confirmRequest:
            "म पुष्टि गर्छु कि ढुवानी विवरण सही छन् र पार्सलमा निषेधित सामग्री छैन।",
        placeholders: {
            senderName: "पठाउनेको नाम",
            senderPhone: "9800000000",
            senderEmail: "sender@example.com",
            receiverName: "प्राप्तकर्ताको नाम",
            receiverPhone: "90000000",
            pickupAddress: "पिकअप ठेगाना",
            pickupDate: "",
            pickupTimeSlot: "10:00 AM - 1:00 PM",
            deliveryAddress: "डेलिभरी ठेगाना",
            packageType: "जस्तै: कागजात",
            weight: "2.5",
            quantity: "1",
            dimensions: "10x8x2 ft",
            specialInstructions: "जस्तै: पिकअप अघि फोन गर्नुहोस्",
            otp: "OTP लेख्नुहोस्",
            noSlotsToday: "आजका लागि समय उपलब्ध छैन",
            invalidTimeSlot: "कृपया मान्य भविष्यको समय छान्नुहोस्।",
        },
        deliveryTypes: [
            { value: "door2door", label: "ढोकाबाट ढोकासम्म" },
            { value: "door2branch", label: "ढोकाबाट शाखासम्म" },
        ],
        paymentMethods: [
            { value: "Debit / Credit Card", label: "डेबिट / क्रेडिट कार्ड" },
            { value: "Online Transfer / Payment", label: "अनलाइन ट्रान्सफर / भुक्तानी" },
            { value: "Cash", label: "नगद" },
        ],
        verificationMethods: [
            { value: "email", label: "इमेल" },
            { value: "phone", label: "फोन" },
        ],
        yes: "हो",
        no: "होइन",
        choose: "छान्नुहोस्",
        submit: "पिकअप अनुरोध पठाउनुहोस्",
        sending: "पठाउँदै...",
        verifyTitle: "अनुरोध प्रमाणीकरण गर्नुहोस्",
        verifyText:
            "तपाईंको छनोट गरिएको प्रमाणीकरण माध्यममा एकपटक प्रयोग हुने कोड पठाइएको छ। पिकअप अनुरोध पुष्टि गर्न तल प्रविष्ट गर्नुहोस्।",
        otpLabel: "प्रमाणीकरण कोड",
        verify: "OTP प्रमाणित गर्नुहोस्",
        verifying: "प्रमाणित गर्दै...",
        resend: "OTP फेरि पठाउनुहोस्",
        resending: "फेरि पठाउँदै...",
        reset: "अर्को अनुरोध पठाउनुहोस्",
        secure: "तपाईंको पिकअप अनुरोध सुरक्षित राखिन्छ।",
        successTitle: "पिकअप अनुरोध सफलतापूर्वक प्रमाणित भयो",
        successText:
            "तपाईंको कुरियर पिकअप अनुरोध पुष्टि भयो। हाम्रो टोलीले चाँडै प्रक्रिया अगाडि बढाउनेछ।",
        required: "यो फिल्ड अनिवार्य छ।",
        invalidEmail: "मान्य इमेल लेख्नुहोस्।",
        invalidSenderPhone: "हङकङका लागि 8 अंक वा नेपालका लागि 10 अंक लेख्नुहोस्।",
        invalidReceiverPhone: "हङकङका लागि 8 अंक वा नेपालका लागि 10 अंक लेख्नुहोस्।",
        invalidWeight: "कृपया मान्य तौल लेख्नुहोस्।",
        invalidQuantity: "संख्या कम्तीमा 1 हुनुपर्छ।",
        invalidOtp: "कृपया OTP कोड लेख्नुहोस्।",
        confirmRequired: "पेश गर्नु अघि पुष्टि गर्नुपर्छ।",
        emailRequiredForVerification:
            "इमेल प्रमाणीकरणका लागि पठाउनेको इमेल आवश्यक छ।",
        selectPickupDateFirst: "पहिले पिकअप मिति छान्नुहोस्",
        captchaRequired: "कृपया reCAPTCHA पूरा गर्नुहोस्।",
        serviceType: "सेवा प्रकार",
        route: "रुट",
        loggedInMessage: "✓ तपाईं लग इन हुनुहुन्छ। तपाईंको अनुरोध OTP प्रमाणीकरण बिना तुरुन्तै पेश हुनेछ।",
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
        deliveryType: "派送方式",
        pickupAddress: "取件地址",
        pickupDate: "取件日期",
        pickupTimeSlot: "取件时段",
        serviceSpeed: "服务速度",
        deliveryAddress: "派送地址",
        packageType: "包裹类型",
        weight: "重量 (kg)",
        quantity: "数量",
        dimensions: "尺寸 (L x W x H)",
        isFragile: "易碎物品",
        isFlameable: "易燃物品",
        paymentMethod: "付款方式",
        specialInstructions: "特别说明",
        verificationMethod: "验证方式",
        confirmRequest: "我确认托运信息正确，且包裹不含违禁品。",
        placeholders: {
            senderName: "寄件人姓名",
            senderPhone: "9800000000",
            senderEmail: "sender@example.com",
            receiverName: "收件人姓名",
            receiverPhone: "90000000",
            pickupAddress: "取件地址",
            pickupDate: "",
            pickupTimeSlot: "10:00 AM - 1:00 PM",
            deliveryAddress: "派送地址",
            packageType: "例如：文件",
            weight: "2.5",
            quantity: "1",
            dimensions: "10x8x2 ft",
            specialInstructions: "例如：取件前先电话联系",
            otp: "输入 OTP",
            noSlotsToday: "今天已没有可选时段",
            invalidTimeSlot: "请选择有效的未来时段。",
        },
        deliveryTypes: [
            { value: "door2door", label: "门到门" },
            { value: "door2branch", label: "门到直营网点" },
        ],
        paymentMethods: [
            { value: "Debit / Credit Card", label: "借记卡 / 信用卡" },
            { value: "Online Transfer / Payment", label: "网上转账 / 支付" },
            { value: "Cash", label: "现金" },
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
        verifyText: "我们已向您选择的验证方式发送一次性验证码，请输入以确认取件请求。",
        otpLabel: "验证码",
        verify: "验证 OTP",
        verifying: "验证中...",
        resend: "重新发送 OTP",
        resending: "重新发送中...",
        reset: "提交另一个请求",
        secure: "您的取件请求信息会被安全保管。",
        successTitle: "取件请求验证成功",
        successText: "您的快递取件请求已确认，我们的团队将尽快处理并与您联系。",
        required: "此字段为必填项。",
        invalidEmail: "请输入有效邮箱地址。",
        invalidSenderPhone: "香港请填写 8 位号码，尼泊尔请填写 10 位号码。",
        invalidReceiverPhone: "香港请填写 8 位号码，尼泊尔请填写 10 位号码。",
        invalidWeight: "请输入有效的正数重量。",
        invalidQuantity: "数量至少为 1。",
        invalidOtp: "请输入 OTP 验证码。",
        confirmRequired: "提交前必须确认。",
        emailRequiredForVerification: "若选择邮箱验证，则必须填写寄件人邮箱。",
        selectPickupDateFirst: "请先选择取件日期",
        captchaRequired: "请完成 reCAPTCHA 验证。",
        serviceType: "服务类型",
        route: "路线",
        loggedInMessage: "✓ 您已登录。您的请求将立即提交，无需 OTP 验证。",
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
    isFlameable: false,
    paymentMethod: "Debit / Credit Card",
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
            gradient: "bg-[linear-gradient(90deg,#bbf7d0_0%,#22c55e_45%,#15803d_100%)]",
            button:
                "bg-[linear-gradient(90deg,#22c55e_0%,#16a34a_45%,#15803d_100%)] shadow-[0_18px_40px_rgba(34,197,94,0.28)]",
            focusColor: "#22c55e",
        },
        label: { en: "Door to Door", ne: "ढोकाबाट ढोकासम्म", zh: "门到门" },
        badge: { en: "Local Delivery", ne: "स्थानीय डेलिभरी", zh: "本地配送" },
        routeFrom: { en: "Pickup Address", ne: "पिकअप ठेगाना", zh: "取件地址" },
        routeTo: { en: "Delivery Address", ne: "डेलिभरी ठेगाना", zh: "派送地址" },
        titleB: {
            en: "Door to Door (HK Only)",
            ne: "ढोका-देखि-ढोकासम्म (हङकङ मात्र)",
            zh: "门到门服务（仅限香港）"
        },
        subtitle: {
            en: "Book a local pickup and delivery request from one address directly to another.",
            ne: "एउटा ठेगानाबाट अर्को ठेगानामा स्थानीय पिकअप र डेलिभरी अनुरोध बुक गर्नुहोस्।",
            zh: "预约本地上门取件并直接送达指定地址。",
        },
        note: {
            en: "Use this form when both pickup and delivery are local. Example within Hong Kong, within Kathmandu, or city-to-city local delivery.",
            ne: "पिकअप र डेलिभरी दुवै स्थानीय हुँदा यो फारम प्रयोग गर्नुहोस्।",
            zh: "当取件和派送都属于本地时，请使用此表单。",
        },
        pickupAddressLabel: {
            en: "Pickup Address",
            ne: "पिकअप ठेगाना",
            zh: "取件地址",
        },
        deliveryAddressLabel: {
            en: "Delivery Address",
            ne: "डेलिभरी ठेगाना",
            zh: "派送地址",
        },
        pickupPlaceholder: {
            en: "Enter pickup address",
            ne: "पिकअप ठेगाना लेख्नुहोस्",
            zh: "请输入取件地址",
        },
        deliveryPlaceholder: {
            en: "Enter delivery address",
            ne: "डेलिभरी ठेगाना लेख्नुहोस्",
            zh: "请输入派送地址",
        },
        deliveryType: "door2door",
        lockDeliveryType: true,
    },

    "hk-to-kathmandu": {
        icon: PlaneTakeoff,
        theme: {
            sectionBg: "bg-[#f5f7ff]",
            softBg: "bg-blue-50",
            softBorder: "border-blue-200",
            softText: "text-blue-700",
            iconBg: "bg-blue-100",
            iconText: "text-blue-700",
            gradient: "bg-[linear-gradient(90deg,#dbeafe_0%,#3b82f6_45%,#1d4ed8_100%)]",
            button:
                "bg-[linear-gradient(90deg,#3b82f6_0%,#2563eb_45%,#1d4ed8_100%)] shadow-[0_18px_40px_rgba(59,130,246,0.30)]",
            focusColor: "#3b82f6",
        },
        label: { en: "HK to Kathmandu", ne: "हङकङ देखि नेपाल", zh: "香港到尼泊尔" },
        badge: {
            en: "International Courier",
            ne: "अन्तर्राष्ट्रिय कुरियर",
            zh: "国际快递",
        },
        routeFrom: { en: "Hong Kong", ne: "हङकङ", zh: "香港" },
        routeTo: { en: "Kathmandu", ne: "नेपाल", zh: "尼泊尔" },
        titleB: { en: "HK to Kathmandu", ne: "हङकङ देखि नेपाल", zh: "香港到尼泊尔" },
        subtitle: {
            en: "Send parcels from Hong Kong to Kathmandu with secure pickup and tracking support.",
            ne: "हङकङबाट नेपालसम्म सुरक्षित पिकअप र ट्र्याकिङ सहित पार्सल पठाउनुहोस्।",
            zh: "从香港寄送包裹到尼泊尔，支持安全取件和追踪。",
        },
        note: {
            en: "Use this form when the parcel starts from Hong Kong and the final receiver is in Kathmandu.",
            ne: "पार्सल हङकङबाट सुरु भएर नेपालमा पुग्ने भए यो फारम प्रयोग गर्नुहोस्।",
            zh: "当包裹从香港寄出并最终送达尼泊尔时，请使用此表单。",
        },
        pickupAddressLabel: {
            en: "Pickup Address in Hong Kong",
            ne: "हङकङमा पिकअप ठेगाना",
            zh: "香港取件地址",
        },
        deliveryAddressLabel: {
            en: "Delivery Address in Kathmandu",
            ne: "नेपालमा डेलिभरी ठेगाना",
            zh: "尼泊尔派送地址",
        },
        pickupPlaceholder: {
            en: "Hong Kong pickup address",
            ne: "हङकङ पिकअप ठेगाना",
            zh: "香港取件地址",
        },
        deliveryPlaceholder: {
            en: "Kathmandu delivery address",
            ne: "नेपाल डेलिभरी ठेगाना",
            zh: "尼泊尔派送地址",
        },
        deliveryType: "door2door",
        lockDeliveryType: false,
    },

    "kathmandu-to-hk": {
        icon: PlaneLanding,
        theme: {
            sectionBg: "bg-[#fff7ed]",
            softBg: "bg-orange-50",
            softBorder: "border-orange-200",
            softText: "text-orange-700",
            iconBg: "bg-orange-100",
            iconText: "text-orange-700",
            gradient: "bg-[linear-gradient(90deg,#ffedd5_0%,#f97316_45%,#c2410c_100%)]",
            button:
                "bg-[linear-gradient(90deg,#fb923c_0%,#f97316_45%,#c2410c_100%)] shadow-[0_18px_40px_rgba(249,115,22,0.30)]",
            focusColor: "#f97316",
        },
        label: { en: "Kathmandu to HK", ne: "नेपाल देखि हङकङ", zh: "尼泊尔到香港" },
        badge: {
            en: "International Courier",
            ne: "अन्तर्राष्ट्रिय कुरियर",
            zh: "国际快递",
        },
        routeFrom: { en: "Kathmandu", ne: "नेपाल", zh: "尼泊尔" },
        routeTo: { en: "Hong Kong", ne: "हङकङ", zh: "香港" },
        titleB: { en: "Kathmandu to HK", ne: "नेपाल देखि हङकङ", zh: "尼泊尔到香港" },
        subtitle: {
            en: "Send parcels from Kathmandu to Hong Kong with verified courier pickup service.",
            ne: "नेपालबाट हङकङसम्म प्रमाणित कुरियर पिकअप सेवासहित पार्सल पठाउनुहोस्।",
            zh: "从尼泊尔寄送包裹到香港，提供已验证的上门取件服务。",
        },
        note: {
            en: "Use this form when the parcel starts from Kathmandu and the final receiver is in Hong Kong.",
            ne: "पार्सल नेपालबाट सुरु भएर हङकङमा पुग्ने भए यो फारम प्रयोग गर्नुहोस्।",
            zh: "当包裹从尼泊尔寄出并最终送达香港时，请使用此表单。",
        },
        pickupAddressLabel: {
            en: "Pickup Address in Kathmandu",
            ne: "नेपालमा पिकअप ठेगाना",
            zh: "尼泊尔取件地址",
        },
        deliveryAddressLabel: {
            en: "Delivery Address in Hong Kong",
            ne: "हङकङमा डेलिभरी ठेगाना",
            zh: "香港派送地址",
        },
        pickupPlaceholder: {
            en: "Kathmandu pickup address",
            ne: "नेपाल पिकअप ठेगाना",
            zh: "尼泊尔取件地址",
        },
        deliveryPlaceholder: {
            en: "Hong Kong delivery address",
            ne: "हङकङ डेलिभरी ठेगाना",
            zh: "香港派送地址",
        },
        deliveryType: "door2door",
        lockDeliveryType: false,
    },
};

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

const TIME_SLOTS_ALL = [
    "6:30 am - 8:30 am",
    "8:30 am - 11:00 am",
    "01:30 pm - 3:30 pm",
    "3:30 pm - 5:30 pm",
    "5:30 pm - 7:30 pm",
    "7:30 pm - 10:30 pm",
];

const TIME_SLOTS_DOOR_TO_DOOR_EXPRESS = [
    "6:30 am - 8:30 am",
    "8:30 am - 11:00 am",
    "01:30 pm - 3:30 pm",
];

function pick(obj, locale = "en", fallback = "") {
    return obj?.[locale] ?? obj?.en ?? fallback;
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
        "w-full rounded-2xl border bg-white px-4 text-sm text-neutral-800 outline-none transition placeholder:text-neutral-400 focus:ring-4 h-12",
        hasError
            ? "border-red-300 focus:border-red-400 focus:ring-red-100"
            : "border-neutral-200 focus:border-[#4b63ff] focus:ring-[#4b63ff10]",
    ].join(" ");
}

function handlePhoneBlur(name, value, setForm) {
    const formatted = normalizePhone(value);
    setForm((prev) => ({ ...prev, [name]: formatted }));
}

function normalizePhone(value) {
    return normalizeCountryPhone(value);
}


function formatHongKongAddress(address) {
    return [
        `Street / Building: ${address.street?.trim() || ""}`,
        `Floor / Unit: ${address.floor?.trim() || ""}`,
        `District: ${address.district?.trim() || ""}`,
    ].join(", ");
}

function shouldUseHongKongPickup(serviceType) {
    return serviceType === "door-to-door" || serviceType === "hk-to-kathmandu";
}

function shouldUseHongKongDelivery(serviceType) {
    return serviceType === "door-to-door" || serviceType === "kathmandu-to-hk";
}

function getServiceSpeedOptions(serviceType, deliveryType) {
    if (serviceType === "door-to-door") {
        return [
            { value: "standard", label: "Standard (1 working day)" },
            { value: "express", label: "Express (3-5 hour)" },
            { value: "sameday", label: "Same Day (10AM : 10PM)" },
        ];
    }

    if (serviceType === "hk-to-kathmandu" || serviceType === "kathmandu-to-hk") {
        if (deliveryType === "door2branch") {
            return [
                { value: "standard", label: "Standard (4-6 days)" },
                { value: "express", label: "Express (3-5 days)" },
            ];
        }

        return [
            { value: "standard", label: "Standard (5-7 days)" },
            { value: "express", label: "Express (3-5 days)" },
        ];
    }

    return [];
}

function parseSlotStart(slotLabel, pickupDate) {
    const startPart = slotLabel.split("-")[0].trim();
    const [time, meridiemRaw] = startPart.split(" ");
    const [hourStr, minuteStr] = time.split(":");

    let hour = Number(hourStr);
    const minute = Number(minuteStr);
    const meridiem = meridiemRaw.toLowerCase();

    if (meridiem === "pm" && hour !== 12) hour += 12;
    if (meridiem === "am" && hour === 12) hour = 0;

    const date = new Date(`${pickupDate}T00:00:00`);
    date.setHours(hour, minute, 0, 0);

    return date;
}

function isSameLocalDate(dateA, dateB) {
    return (
        dateA.getFullYear() === dateB.getFullYear() &&
        dateA.getMonth() === dateB.getMonth() &&
        dateA.getDate() === dateB.getDate()
    );
}

function getPickupTimeSlots(serviceType, serviceSpeed, pickupDate) {
    const slots =
        serviceType === "door-to-door" && serviceSpeed === "express"
            ? TIME_SLOTS_DOOR_TO_DOOR_EXPRESS
            : TIME_SLOTS_ALL;

    if (!pickupDate) {
        return slots.map((slot) => ({ value: slot, label: slot }));
    }

    const now = new Date();
    const selectedDate = new Date(`${pickupDate}T00:00:00`);

    const filteredSlots = isSameLocalDate(now, selectedDate)
        ? slots.filter((slot) => parseSlotStart(slot, pickupDate) > now)
        : slots;

    return filteredSlots.map((slot) => ({
        value: slot,
        label: slot,
    }));
}

export default function AiExpressPickupForm({
    locale = "en",
    serviceType = "door-to-door",
    fetchCart,
}) {
    const t = COPY[locale] || COPY.en;
    const activeService = SERVICE_CONFIG[serviceType] || SERVICE_CONFIG["door-to-door"];
    const ServiceIcon = activeService.icon || Truck;
    const theme = activeService.theme;

    const { executeRecaptcha } = useGoogleReCaptcha();
    const dispatch = useDispatch();

    const user = useSelector((state) => state.user?.value || state.user);
    const isLoggedIn = user && Object.keys(user).length > 0 && user._id;
    const userDisplayName = user?.displayName || user?.name || "";
    const userEmail = user?.email || "";
    const userPhone = user?.phone || "";

    // Auth sync effect
    useEffect(() => {
        const token = fromStorage("hkmandu");
        if (!isLoggedIn && token) {
            http.get("frontend/auth/details")
                .then((res) => {
                    const u = res.data?.user ?? res.data;
                    if (u) {
                        dispatch(setUser(u));
                        if (fetchCart) fetchCart();
                    }
                })
                .catch(() => {
                    clearStorage("hkmandu");
                    dispatch(clearUser());
                });
        }
    }, [dispatch, isLoggedIn, fetchCart]);

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
        serviceSpeed:
            getServiceSpeedOptions(
                serviceType,
                activeService.deliveryType || initialForm.deliveryType
            )[0]?.value || "standard",
    });

    // Auto-fill form for logged-in users
    useEffect(() => {
        if (isLoggedIn && user) {
            setForm((prev) => ({
                ...prev,
                senderName: userDisplayName || prev.senderName,
                senderEmail: userEmail || prev.senderEmail,
                senderPhone: userPhone || prev.senderPhone,
            }));
        }
    }, [isLoggedIn, user, userDisplayName, userEmail, userPhone]);

    const [errors, setErrors] = useState({});
    const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
    const [requestMeta, setRequestMeta] = useState(null);
    const [step, setStep] = useState("form");
    const [submitLoading, setSubmitLoading] = useState(false);
    const [verifyLoading, setVerifyLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [banner, setBanner] = useState({ type: "", text: "" });

    const otpRefs = useMemo(() => Array.from({ length: 6 }, () => ({ current: null })), []);

    const availableServiceSpeeds = useMemo(() => {
        return getServiceSpeedOptions(serviceType, form.deliveryType);
    }, [serviceType, form.deliveryType]);

    const availableTimeSlots = useMemo(() => {
        if (!form.pickupDate) return [];
        return getPickupTimeSlots(serviceType, form.serviceSpeed, form.pickupDate);
    }, [form.pickupDate, serviceType, form.serviceSpeed]);

    const verificationValue = useMemo(() => {
        return form.verificationMethod === "phone" ? form.senderPhone : form.senderEmail;
    }, [form.verificationMethod, form.senderPhone, form.senderEmail]);

    useEffect(() => {
        const validSpeeds = getServiceSpeedOptions(serviceType, form.deliveryType).map(
            (item) => item.value
        );

        if (!validSpeeds.includes(form.serviceSpeed)) {
            setForm((prev) => ({
                ...prev,
                serviceSpeed: validSpeeds[0] || "",
                pickupTimeSlot: "",
            }));
        }
    }, [serviceType, form.deliveryType, form.serviceSpeed]);

    useEffect(() => {
        const validSlots = getPickupTimeSlots(
            serviceType,
            form.serviceSpeed,
            form.pickupDate
        ).map((item) => item.value);

        if (form.pickupTimeSlot && !validSlots.includes(form.pickupTimeSlot)) {
            setForm((prev) => ({
                ...prev,
                pickupTimeSlot: "",
            }));
        }
    }, [serviceType, form.serviceSpeed, form.pickupDate, form.pickupTimeSlot]);

    useEffect(() => {
        setForm((prev) => ({
            ...prev,
            deliveryType: activeService.deliveryType || prev.deliveryType,
            serviceSpeed:
                getServiceSpeedOptions(
                    serviceType,
                    activeService.deliveryType || prev.deliveryType
                )[0]?.value || "standard",
            pickupTimeSlot: "",
        }));
    }, [serviceType, activeService.deliveryType]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const isNested =
            name.startsWith("pickupAddressHK.") || name.startsWith("deliveryAddressHK.");

        setForm((prev) => {
            const updated = { ...prev };

            if (isNested) {
                const [parent, child] = name.split(".");
                updated[parent] = {
                    ...prev[parent],
                    [child]: value,
                };
            } else {
                updated[name] = type === "checkbox" ? checked : value;
            }

            if (name === "pickupDate") updated.pickupTimeSlot = "";
            if (name === "deliveryType") {
                updated.serviceSpeed =
                    getServiceSpeedOptions(serviceType, value)[0]?.value || "";
                updated.pickupTimeSlot = "";
            }
            if (name === "serviceSpeed") {
                updated.pickupTimeSlot = "";
            }

            return updated;
        });

        setErrors((prev) => ({
            ...prev,
            [name]: "",
            pickupTimeSlot: "",
        }));
        setBanner({ type: "", text: "" });
    };

    const handleOtpChange = (index, value) => {
        const cleaned = value.replace(/[^a-zA-Z0-9]/g, "").slice(-1).toUpperCase();

        setOtpValues((prev) => {
            const next = [...prev];
            next[index] = cleaned;
            return next;
        });

        setErrors((prev) => ({ ...prev, otp: "" }));

        if (cleaned && index < 5) otpRefs[index + 1]?.current?.focus();
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

        if (e.key === "ArrowLeft" && index > 0) otpRefs[index - 1]?.current?.focus();
        if (e.key === "ArrowRight" && index < 5) otpRefs[index + 1]?.current?.focus();
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

        if (!form.senderPhone.trim()) nextErrors.senderPhone = t.required;
        else if (!isValidCountryPhone(form.senderPhone))
            nextErrors.senderPhone = "Select Nepal or Hong Kong and enter a valid phone number.";

        if (form.senderEmail.trim() && !/\S+@\S+\.\S+/.test(form.senderEmail)) {
            nextErrors.senderEmail = t.invalidEmail;
        }

        if (!form.deliveryType) nextErrors.deliveryType = t.required;
        if (!form.pickupDate) nextErrors.pickupDate = t.required;
        if (!form.pickupTimeSlot.trim()) nextErrors.pickupTimeSlot = t.required;
        if (!form.serviceSpeed) nextErrors.serviceSpeed = t.required;
        if (!form.receiverName.trim()) nextErrors.receiverName = t.required;

        const validTimeSlotValues = getPickupTimeSlots(
            serviceType,
            form.serviceSpeed,
            form.pickupDate
        ).map((item) => item.value);

        if (
            form.pickupDate &&
            form.pickupTimeSlot &&
            !validTimeSlotValues.includes(form.pickupTimeSlot)
        ) {
            nextErrors.pickupTimeSlot = t.placeholders.invalidTimeSlot;
        }

        if (!form.receiverPhone.trim()) nextErrors.receiverPhone = t.required;
        else if (!isValidCountryPhone(form.receiverPhone))
            nextErrors.receiverPhone = "Select Nepal or Hong Kong and enter a valid phone number.";

        if (!form.packageType.trim()) nextErrors.packageType = t.required;

        if (form.weight === "" || form.weight === null || form.weight === undefined)
            nextErrors.weight = t.required;
        else if (!(Number(form.weight) > 0)) nextErrors.weight = t.invalidWeight;

        if (form.quantity === "" || form.quantity === null || form.quantity === undefined)
            nextErrors.quantity = t.required;
        else if (!(Number(form.quantity) >= 1)) nextErrors.quantity = t.invalidQuantity;

        if (!form.paymentMethod) nextErrors.paymentMethod = t.required;

        // Only require verification method for non-logged-in users
        if (!isLoggedIn) {
            if (!form.verificationMethod) nextErrors.verificationMethod = t.required;

            if (form.verificationMethod === "email" && !form.senderEmail.trim()) {
                nextErrors.senderEmail = t.emailRequiredForVerification;
            }
        }

        if (!form.isConfirmed) nextErrors.isConfirmed = t.confirmRequired;

        if (pickupUsesHK) {
            if (!form.pickupAddressHK.street.trim()) nextErrors["pickupAddressHK.street"] = t.required;
            if (!form.pickupAddressHK.floor.trim()) nextErrors["pickupAddressHK.floor"] = t.required;
            if (!form.pickupAddressHK.district.trim())
                nextErrors["pickupAddressHK.district"] = t.required;
        } else if (!form.pickupAddress.trim()) {
            nextErrors.pickupAddress = t.required;
        }

        if (deliveryUsesHK) {
            if (!form.deliveryAddressHK.street.trim())
                nextErrors["deliveryAddressHK.street"] = t.required;
            if (!form.deliveryAddressHK.floor.trim())
                nextErrors["deliveryAddressHK.floor"] = t.required;
            if (!form.deliveryAddressHK.district.trim())
                nextErrors["deliveryAddressHK.district"] = t.required;
        } else if (!form.deliveryAddress.trim()) {
            nextErrors.deliveryAddress = t.required;
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        // For logged-in users, use direct-submit endpoint
        if (isLoggedIn) {
            try {
                setSubmitLoading(true);
                setBanner({ type: "", text: "" });

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
                    isFlameable: Boolean(form.isFlameable),
                    paymentMethod: form.paymentMethod,
                    specialInstructions: form.specialInstructions.trim() || null,
                    isConfirmed: true,
                    verificationMethod: "auth",
                };

                const res = await http.post("/frontend/courierPickupForm/direct-submit", payload);

                setStep("success");
                setBanner({
                    type: "success",
                    text: res?.data?.message || t.successText,
                });
            } catch (err) {
                setBanner({ type: "error", text: getErrorText(err) });
            } finally {
                setSubmitLoading(false);
            }
            return;
        }

        // For non-logged-in users, require reCAPTCHA
        if (!executeRecaptcha) {
            setErrors((prev) => ({ ...prev, captcha: t.captchaRequired }));
            return;
        }

        setSubmitLoading(true);
        setBanner({ type: "", text: "" });

        try {
            const recaptchaToken = await executeRecaptcha("courier_pickup_submit");

            if (!recaptchaToken || typeof recaptchaToken !== "string") {
                setErrors((prev) => ({ ...prev, captcha: t.captchaRequired }));
                setBanner({ type: "error", text: t.captchaRequired });
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
                isFlameable: Boolean(form.isFlameable),
                paymentMethod: form.paymentMethod,
                specialInstructions: form.specialInstructions.trim() || null,
                isConfirmed: true,
                verificationMethod: form.verificationMethod,
                recaptchaToken,
            };

            const res = await http.post("/frontend/courierPickupForm/submit", payload);
            const data = res?.data;

            setRequestMeta({
                id: data?.id,
                expiresAt: data?.expiresAt,
            });
            setStep("otp");
            setOtpValues(["", "", "", "", "", ""]);
            setErrors((prev) => ({ ...prev, otp: "" }));
            setBanner({ type: "success", text: data?.message || t.verifyText });
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
            const res = await http.post("/frontend/courierPickupForm/verify-otp", {
                id: requestMeta?.id,
                otp: otp.trim(),
            });

            setStep("success");
            setBanner({ type: "success", text: res?.data?.message || t.successText });
        } catch (err) {
            const errorData = err?.response?.data;
            if (errorData?.lockedUntil) {
                setBanner({
                    type: "error",
                    text: `${errorData.message}. Locked until: ${new Date(errorData.lockedUntil).toLocaleString()}`,
                });
            } else {
                setBanner({ type: "error", text: getErrorText(err) });
            }
        } finally {
            setVerifyLoading(false);
        }
    };

    const handleResend = async () => {
        if (!requestMeta?.id) return;

        setResendLoading(true);
        setBanner({ type: "", text: "" });

        try {
            const res = await http.post("/frontend/courierPickupForm/resend-otp", {
                id: requestMeta.id,
            });

            setRequestMeta((prev) => ({
                ...prev,
                expiresAt: res?.data?.expiresAt || prev?.expiresAt,
            }));

            setBanner({ type: "success", text: res?.data?.message || t.resend });
            setOtpValues(["", "", "", "", "", ""]);
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
            serviceSpeed:
                getServiceSpeedOptions(
                    serviceType,
                    activeService.deliveryType || initialForm.deliveryType
                )[0]?.value || "standard",
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
            <div className="absolute inset-x-0 top-0 h-[340px] bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.20)_0,rgba(246,243,239,0)_60%)]" />

            <div className="relative mx-auto max-w-5xl">
                <div className="mb-8 text-center sm:mb-10 sm:text-left">
                    <div className="mb-4 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-neutral-500">
                        <span className="h-px w-10 bg-neutral-300" />
                        {t.eyebrow}
                    </div>

                    <h1 className="max-w-3xl text-4xl font-medium leading-tight text-neutral-900 sm:text-5xl">
                        {t.titleA}{" "}
                        <span className={`font-serif italic ${theme.softText}`}>{serviceTitle}</span>
                        <br />
                        {t.titleC}
                    </h1>

                    <p className="mt-5 max-w-2xl text-sm leading-7 text-neutral-500 sm:text-base">
                        {serviceSubtitle}
                    </p>
                </div>

                <div className="rounded-[30px] border border-black/5 bg-white/90 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.10)] backdrop-blur sm:p-8">
                    <div className={`mb-6 h-1 w-full rounded-full ${theme.gradient}`} />

                    <div className={`mb-6 rounded-3xl border p-5 ${theme.softBg} ${theme.softBorder}`}>
                        <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
                            <div className="flex gap-4">
                                <div
                                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${theme.iconBg} ${theme.iconText}`}
                                >
                                    <ServiceIcon className="h-6 w-6" />
                                </div>

                                <div>
                                    <div className={`mb-2 inline-flex rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] shadow-sm ${theme.softText}`}>
                                        {serviceBadge}
                                    </div>
                                    <h2 className="text-xl font-semibold text-neutral-900">{serviceTitle}</h2>
                                    <p className="mt-2 text-sm leading-7 text-neutral-600">{serviceNote}</p>
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
                                        <div className="text-sm font-semibold text-neutral-900">{routeFrom}</div>
                                    </div>

                                    <ArrowRight className={`h-4 w-4 ${theme.softText}`} />

                                    <div className="text-right">
                                        <div className="text-xs text-neutral-400">To</div>
                                        <div className="text-sm font-semibold text-neutral-900">{routeTo}</div>
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
                            {isLoggedIn && (
                                <div className={`rounded-lg p-3 text-sm ${theme.softBg} ${theme.softText}`}>
                                    {t.loggedInMessage}
                                </div>
                            )}

                            <SectionTitle title={t.senderInfo} />

                            <div className="grid gap-5 md:grid-cols-2">
                                <Field label={t.senderName} icon={User} error={errors.senderName} color={theme.focusColor}>
                                    <input
                                        name="senderName"
                                        value={form.senderName}
                                        onChange={handleChange}
                                        placeholder={t.placeholders.senderName}
                                        maxLength={INPUT_LIMITS.name}
                                        className={inputClass(!!errors.senderName)}
                                    />
                                </Field>

                                <Field label={t.senderPhone} icon={Phone} error={errors.senderPhone} color={theme.focusColor}>
                                    <CountryPhoneInput
                                        value={form.senderPhone}
                                        onChange={(value) => handleChange({ target: { name: "senderPhone", value } })}
                                        hasError={!!errors.senderPhone}
                                    />
                                </Field>
                            </div>

                            <Field
                                label={t.senderEmail}
                                icon={Mail}
                                error={errors.senderEmail}
                                required={!isLoggedIn && form.verificationMethod === "email"}
                                color={theme.focusColor}
                            >
                                <input
                                    type="email"
                                    name="senderEmail"
                                    value={form.senderEmail}
                                    onChange={handleChange}
                                    placeholder={t.placeholders.senderEmail}
                                    maxLength={INPUT_LIMITS.email}
                                    className={inputClass(!!errors.senderEmail)}
                                />
                            </Field>

                            <div className="grid gap-5 md:grid-cols-2">
                                <Field label={t.deliveryType} icon={Truck} error={errors.deliveryType} color={theme.focusColor}>
                                    <select
                                        name="deliveryType"
                                        value={form.deliveryType}
                                        onChange={handleChange}
                                        disabled={activeService.lockDeliveryType}
                                        className={`${inputClass(!!errors.deliveryType)} ${activeService.lockDeliveryType ? "cursor-not-allowed bg-neutral-50" : ""
                                            }`}
                                    >
                                        {t.deliveryTypes.map((item) => (
                                            <option key={item.value} value={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                    </select>
                                </Field>

                                <Field label={t.serviceSpeed} icon={Clock3} error={errors.serviceSpeed} color={theme.focusColor}>
                                    <select
                                        name="serviceSpeed"
                                        value={form.serviceSpeed}
                                        onChange={handleChange}
                                        className={inputClass(!!errors.serviceSpeed)}
                                    >
                                        {availableServiceSpeeds.map((item) => (
                                            <option key={item.value} value={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                    </select>
                                </Field>
                            </div>

                            {shouldUseHongKongPickup(serviceType) ? (
                                <div className="space-y-5">
                                    <div className="grid gap-5 md:grid-cols-2">
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
                                                maxLength={INPUT_LIMITS.floor}
                                                className={inputClass(!!errors["pickupAddressHK.floor"])}
                                            />
                                        </Field>

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
                                                maxLength={INPUT_LIMITS.street}
                                                className={inputClass(!!errors["pickupAddressHK.street"])}
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
                                            className={inputClass(!!errors["pickupAddressHK.district"])}
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
                                        maxLength={INPUT_LIMITS.address}
                                        className={inputClass(!!errors.pickupAddress)}
                                    />
                                </Field>
                            )}

                            <div className="grid gap-5 md:grid-cols-2">
                                <Field label={t.pickupDate} icon={CalendarDays} error={errors.pickupDate} color={theme.focusColor}>
                                    <input
                                        type="date"
                                        name="pickupDate"
                                        value={form.pickupDate}
                                        onChange={handleChange}
                                        min={new Date().toISOString().split("T")[0]}
                                        className={inputClass(!!errors.pickupDate)}
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
                                        disabled={!form.pickupDate || availableTimeSlots.length === 0}
                                        className={inputClass(!!errors.pickupTimeSlot)}
                                    >
                                        <option value="">
                                            {!form.pickupDate
                                                ? t.selectPickupDateFirst
                                                : availableTimeSlots.length === 0
                                                    ? t.placeholders.noSlotsToday
                                                    : t.choose}
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
                                <Field label={t.receiverName} icon={User} error={errors.receiverName} color={theme.focusColor}>
                                    <input
                                        name="receiverName"
                                        value={form.receiverName}
                                        onChange={handleChange}
                                        placeholder={t.placeholders.receiverName}
                                        maxLength={INPUT_LIMITS.name}
                                        className={inputClass(!!errors.receiverName)}
                                    />
                                </Field>

                                <Field label={t.receiverPhone} icon={Phone} error={errors.receiverPhone} color={theme.focusColor}>
                                    <CountryPhoneInput
                                        value={form.receiverPhone}
                                        onChange={(value) => handleChange({ target: { name: "receiverPhone", value } })}
                                        hasError={!!errors.receiverPhone}
                                    />
                                </Field>
                            </div>

                            {shouldUseHongKongDelivery(serviceType) ? (
                                <div className="space-y-5">
                                    <div className="grid gap-5 md:grid-cols-2">
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
                                                maxLength={INPUT_LIMITS.floor}
                                                className={inputClass(!!errors["deliveryAddressHK.floor"])}
                                            />
                                        </Field>

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
                                                maxLength={INPUT_LIMITS.street}
                                                className={inputClass(!!errors["deliveryAddressHK.street"])}
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
                                            className={inputClass(!!errors["deliveryAddressHK.district"])}
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
                                        maxLength={INPUT_LIMITS.address}
                                        className={inputClass(!!errors.deliveryAddress)}
                                    />
                                </Field>
                            )}

                            <SectionTitle title={t.packageInfo} />

                            <div className="grid gap-5 md:grid-cols-2">
                                <Field label={t.packageType} icon={Package} error={errors.packageType} color={theme.focusColor}>
                                    <input
                                        name="packageType"
                                        value={form.packageType}
                                        onChange={handleChange}
                                        placeholder={t.placeholders.packageType}
                                        maxLength={INPUT_LIMITS.packageType}
                                        className={inputClass(!!errors.packageType)}
                                    />
                                </Field>

                                <Field label={t.weight} icon={Scale} error={errors.weight} color={theme.focusColor}>
                                    <input
                                        type="number"
                                        name="weight"
                                        value={form.weight}
                                        onChange={handleChange}
                                        placeholder={t.placeholders.weight}
                                        min="0"
                                        step="0.01"
                                        maxLength={INPUT_LIMITS.weight}
                                        className={inputClass(!!errors.weight)}
                                    />
                                </Field>
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">
                                <Field label={t.quantity} icon={Hash} error={errors.quantity} color={theme.focusColor}>
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={form.quantity}
                                        onChange={handleChange}
                                        placeholder={t.placeholders.quantity}
                                        min="1"
                                        step="1"
                                        maxLength={INPUT_LIMITS.quantity}
                                        className={inputClass(!!errors.quantity)}
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
                                        maxLength={INPUT_LIMITS.dimensions}
                                        className={inputClass(!!errors.dimensions)}
                                    />
                                </Field>
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">
                                <Field label={t.isFragile} icon={AlertTriangle} error={errors.isFragile} color={theme.focusColor}>
                                    <select
                                        name="isFragile"
                                        value={String(form.isFragile)}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                isFragile: e.target.value === "true",
                                            }))
                                        }
                                        className={inputClass(!!errors.isFragile)}
                                    >
                                        <option value="false">{t.no}</option>
                                        <option value="true">{t.yes}</option>
                                    </select>
                                </Field>

                                <Field
                                    label={t.isFlameable}
                                    icon={Flame}
                                    error={errors.isFlameable}
                                    color={theme.focusColor}
                                >
                                    <select
                                        name="isFlameable"
                                        value={String(form.isFlameable)}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                isFlameable: e.target.value === "true",
                                            }))
                                        }
                                        className={inputClass(!!errors.isFlameable)}
                                    >
                                        <option value="false">{t.no}</option>
                                        <option value="true">{t.yes}</option>
                                    </select>
                                </Field>
                            </div>

                            <Field label={t.paymentMethod} icon={CreditCard} error={errors.paymentMethod} color={theme.focusColor}>
                                <select
                                    name="paymentMethod"
                                    value={form.paymentMethod}
                                    onChange={handleChange}
                                    className={inputClass(!!errors.paymentMethod)}
                                >
                                    {t.paymentMethods.map((item) => (
                                        <option key={item.value} value={item.value}>
                                            {item.label}
                                        </option>
                                    ))}
                                </select>
                            </Field>

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
                                    maxLength={INPUT_LIMITS.note}
                                    className={`${inputClass(!!errors.specialInstructions)} min-h-[110px] resize-none py-3`}
                                />
                            </Field>

                            {!isLoggedIn && (
                                <>
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
                                                const disabled = item.value === "email" && !form.senderEmail.trim();

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
                                                            disabled ? "cursor-not-allowed opacity-50" : "",
                                                        ].join(" ")}
                                                    >
                                                        <div className="text-sm font-semibold text-neutral-900">{item.label}</div>
                                                        <div className="mt-1 text-xs text-neutral-500">
                                                            {item.value === "email"
                                                                ? form.senderEmail.trim() || t.placeholders.senderEmail
                                                                : form.senderPhone.trim() || t.placeholders.senderPhone}
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </Field>
                                </>
                            )}

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
                                        <div className="text-sm font-medium text-neutral-800">{t.confirmRequest}</div>
                                        {errors.isConfirmed ? (
                                            <p className="mt-1 text-xs text-red-500">{errors.isConfirmed}</p>
                                        ) : null}
                                    </div>
                                </div>
                            </label>

                            {!isLoggedIn && errors.captcha ? <p className="text-sm text-red-500">{errors.captcha}</p> : null}

                            <button
                                type="submit"
                                disabled={submitLoading}
                                className={`inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl px-6 text-sm font-semibold uppercase tracking-[0.26em] text-white transition hover:-translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-70 ${theme.button}`}
                            >
                                {submitLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                                {submitLoading ? t.sending : t.submit}
                                {!submitLoading ? <ArrowRight className="h-4 w-4" /> : null}
                            </button>
                        </form>
                    ) : null}

                    {step === "otp" ? (
                        <form onSubmit={handleVerify} className="space-y-6">
                            <div className={`rounded-[24px] border p-5 ${theme.softBg} ${theme.softBorder}`}>
                                <div className={`mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ${theme.softText}`}>
                                    <Lock className="h-5 w-5" />
                                </div>

                                <h2 className="text-2xl font-semibold text-neutral-900">{t.verifyTitle}</h2>
                                <p className="mt-2 text-sm leading-7 text-neutral-500">{t.verifyText}</p>
                                <p className="mt-3 text-sm font-medium text-neutral-700">{verificationValue}</p>

                                {requestMeta?.expiresAt ? (
                                    <p className="mt-1 text-xs text-neutral-500">
                                        Expires at {new Date(requestMeta.expiresAt).toLocaleString()}
                                    </p>
                                ) : null}
                            </div>

                            <Field label={t.otpLabel} icon={ShieldCheck} error={errors.otp} color={theme.focusColor}>
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
                                                autoComplete={index === 0 ? "one-time-code" : "off"}
                                                maxLength={1}
                                                value={digit}
                                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                                onPaste={handleOtpPaste}
                                                className={[
                                                    "h-14 w-12 rounded-2xl border bg-white text-center text-lg font-semibold uppercase outline-none transition sm:h-16 sm:w-14",
                                                    errors.otp
                                                        ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100"
                                                        : "border-neutral-200 focus:border-[#4b63ff] focus:ring-4 focus:ring-[#4b63ff10]",
                                                ].join(" ")}
                                            />
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-neutral-500">{t.placeholders.otp}</span>
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
                                    {verifyLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
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

                            <h2 className="text-2xl font-semibold text-neutral-900">{t.successTitle}</h2>
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

                    <div className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-neutral-500">
                        <Lock className={`h-3.5 w-3.5 ${theme.softText}`} />
                        <span>{t.secure}</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
