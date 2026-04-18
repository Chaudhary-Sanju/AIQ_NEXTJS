"use client";

import { useEffect, useMemo, useState } from "react";
import {
    ArrowRight,
    Box,
    CalendarDays,
    CheckCircle2,
    CreditCard,
    Loader2,
    Lock,
    Mail,
    MapPin,
    Package,
    Phone,
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

const COPY = {
    en: {
        eyebrow: "AI EXPRESS",
        titleA: "Submit",
        titleB: "courier pickup",
        titleC: "request",
        subtitle:
            "Book your courier pickup, verify with OTP, and let HkMandu handle the rest.",

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
            senderPhone: "+9779800000000",
            senderEmail: "sender@example.com",
            receiverName: "Receiver name",
            receiverPhone: "+85290000000",
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
            { value: "cod", label: "Cash on Delivery" },
            { value: "card", label: "Card" },
            { value: "bank deposit", label: "Bank Deposit" },
            { value: "cheque", label: "Cheque" },
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
            "Use a valid Nepal (+977XXXXXXXXXX) or Hong Kong (+852XXXXXXXX) number.",
        invalidReceiverPhone:
            "Use a valid Nepal (+977XXXXXXXXXX) or Hong Kong (+852XXXXXXXX) number.",
        invalidWeight: "Please enter a valid positive weight.",
        invalidQuantity: "Quantity must be at least 1.",
        invalidOtp: "Please enter the OTP code.",
        confirmRequired: "You must confirm the request before submitting.",
        emailRequiredForVerification:
            "Sender email is required when verification method is email.",
        selectPickupDateFirst: "Select pickup date first",
    },

    ne: {
        eyebrow: "एआई एक्सप्रेस",
        titleA: "कुरियर पिकअप",
        titleB: "अनुरोध",
        titleC: "पेश गर्नुहोस्",
        subtitle:
            "आफ्नो कुरियर पिकअप बुक गर्नुहोस्, OTP बाट प्रमाणित गर्नुहोस्, र बाँकी HkMandu लाई जिम्मा दिनुहोस्।",

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
        dimensions: "आकार  (L x W x H)",
        isFragile: "नाजुक सामान",
        paymentMethod: "भुक्तानी विधि",
        specialInstructions: "विशेष निर्देशन",
        verificationMethod: "प्रमाणीकरण विधि",
        confirmRequest:
            "म पुष्टि गर्छु कि ढुवानी विवरण सही छन् र पार्सलमा निषेधित वस्तुहरू समावेश छैनन्।",

        placeholders: {
            senderName: "पठाउने व्यक्तिको नाम",
            senderPhone: "+9779800000000",
            senderEmail: "sender@example.com",
            receiverName: "प्राप्त गर्ने व्यक्तिको नाम",
            receiverPhone: "+85290000000",
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
            { value: "cod", label: "क्यास अन डेलिभरी" },
            { value: "card", label: "कार्ड" },
            { value: "bank deposit", label: "बैंक जम्मा" },
            { value: "cheque", label: "चेक" },
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
            "मान्य नेपाल (+977XXXXXXXXXX) वा हङकङ (+852XXXXXXXX) नम्बर हाल्नुहोस्।",
        invalidReceiverPhone:
            "मान्य नेपाल (+977XXXXXXXXXX) वा हङकङ (+852XXXXXXXX) नम्बर हाल्नुहोस्।",
        invalidWeight: "कृपया मान्य धनात्मक तौल हाल्नुहोस्।",
        invalidQuantity: "संख्या कम्तीमा १ हुनुपर्छ।",
        invalidOtp: "कृपया OTP हाल्नुहोस्।",
        confirmRequired: "पठाउनु अघि अनुरोध पुष्टि गर्नुपर्छ।",
        emailRequiredForVerification:
            "प्रमाणीकरण विधि इमेल भएमा पठाउने व्यक्तिको इमेल आवश्यक हुन्छ।",
        selectPickupDateFirst: "पहिले पिकअप मिति छान्नुहोस्",
    },

    zh: {
        eyebrow: "AI EXPRESS",
        titleA: "提交",
        titleB: "快递取件",
        titleC: "请求",
        subtitle:
            "预约您的快递取件，通过 OTP 验证，剩下的交给 HkMandu。",

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
        dimensions: "尺寸  (L x W x H)",
        isFragile: "易碎物品",
        paymentMethod: "付款方式",
        specialInstructions: "特别说明",
        verificationMethod: "验证方式",
        confirmRequest:
            "我确认货运资料正确无误，且包裹内不含违禁物品。",

        placeholders: {
            senderName: "寄件人姓名",
            senderPhone: "+9779800000000",
            senderEmail: "sender@example.com",
            receiverName: "收件人姓名",
            receiverPhone: "+85290000000",
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
            { value: "cod", label: "货到付款" },
            { value: "card", label: "银行卡" },
            { value: "bank deposit", label: "银行入数" },
            { value: "cheque", label: "支票" },
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
        successText:
            "您的快递取件请求已确认，我们的团队会尽快处理并联系您。",

        required: "此字段为必填。",
        invalidEmail: "请输入有效邮箱地址。",
        invalidSenderPhone:
            "请输入有效的尼泊尔 (+977XXXXXXXXXX) 或香港 (+852XXXXXXXX) 电话号码。",
        invalidReceiverPhone:
            "请输入有效的尼泊尔 (+977XXXXXXXXXX) 或香港 (+852XXXXXXXX) 电话号码。",
        invalidWeight: "请输入有效的正数重量。",
        invalidQuantity: "数量必须至少为 1。",
        invalidOtp: "请输入验证码。",
        confirmRequired: "提交前必须确认请求。",
        emailRequiredForVerification:
            "当验证方式为邮箱时，寄件人邮箱为必填。",
        selectPickupDateFirst: "请先选择取件日期",
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
    packageType: "",
    weight: "",
    quantity: 1,
    dimensions: "",
    isFragile: false,
    paymentMethod: "cod",
    specialInstructions: "",
    isConfirmed: false,
    verificationMethod: "phone",
};

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


function Field({ label, icon: Icon, required = true, error, children }) {
    return (
        <label className="block space-y-2">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
                {Icon ? <Icon className="h-3.5 w-3.5 text-[#4b63ff]" /> : null}
                {label}
                {required ? <span className="text-[#4b63ff]">*</span> : null}
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

function isValidPhone(value) {
    return /^(\+977\d{10}|\+852\d{8})$/.test((value || "").trim());
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

export default function AiExpressPickupForm({ locale = "en" }) {
    const t = COPY[locale] || COPY.en;

    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [otp, setOtp] = useState("");
    const [requestMeta, setRequestMeta] = useState(null);
    const [step, setStep] = useState("form");
    const [submitLoading, setSubmitLoading] = useState(false);
    const [verifyLoading, setVerifyLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [banner, setBanner] = useState({ type: "", text: "" });

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

        setForm((prev) => {
            const updatedValue =
                type === "checkbox" ? checked : value;

            const updated = {
                ...prev,
                [name]: updatedValue,
            };

            if (name === "pickupDate") {
                updated.pickupTimeSlot = "";
            }

            return updated;
        });

        setErrors((prev) => ({ ...prev, [name]: "", pickupTimeSlot: "" }));
        setBanner({ type: "", text: "" });
    };

    const validate = () => {
        const nextErrors = {};

        if (!form.senderName.trim()) nextErrors.senderName = t.required;
        if (!form.senderPhone.trim()) nextErrors.senderPhone = t.required;
        else if (!isValidPhone(form.senderPhone))
            nextErrors.senderPhone = t.invalidSenderPhone;

        if (form.senderEmail.trim() && !/^\S+@\S+\.\S+$/.test(form.senderEmail)) {
            nextErrors.senderEmail = t.invalidEmail;
        }

        if (!form.deliveryType) nextErrors.deliveryType = t.required;
        if (!form.pickupAddress.trim()) nextErrors.pickupAddress = t.required;
        if (!form.pickupDate) nextErrors.pickupDate = t.required;
        if (!form.pickupTimeSlot.trim()) nextErrors.pickupTimeSlot = t.required;
        if (!form.serviceSpeed) nextErrors.serviceSpeed = t.required;

        if (!form.receiverName.trim()) nextErrors.receiverName = t.required;
        if (!form.receiverPhone.trim()) nextErrors.receiverPhone = t.required;
        else if (!isValidPhone(form.receiverPhone))
            nextErrors.receiverPhone = t.invalidReceiverPhone;

        if (!form.deliveryAddress.trim()) nextErrors.deliveryAddress = t.required;
        if (!form.packageType.trim()) nextErrors.packageType = t.required;

        if (form.weight === "" || form.weight === null || form.weight === undefined) {
            nextErrors.weight = t.required;
        } else if (!(Number(form.weight) > 0)) {
            nextErrors.weight = t.invalidWeight;
        }

        if (form.quantity === "" || form.quantity === null || form.quantity === undefined) {
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

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setSubmitLoading(true);
        setBanner({ type: "", text: "" });

        try {
            const payload = {
                senderName: form.senderName.trim(),
                senderPhone: form.senderPhone.trim(),
                senderEmail: form.senderEmail.trim() || null,
                deliveryType: form.deliveryType,
                pickupAddress: form.pickupAddress.trim(),
                pickupDate: form.pickupDate,
                pickupTimeSlot: form.pickupTimeSlot.trim(),
                serviceSpeed: form.serviceSpeed,
                receiverName: form.receiverName.trim(),
                receiverPhone: form.receiverPhone.trim(),
                deliveryAddress: form.deliveryAddress.trim(),
                packageType: form.packageType.trim(),
                weight: Number(form.weight),
                quantity: Number(form.quantity),
                dimensions: form.dimensions.trim() || null,
                isFragile: Boolean(form.isFragile),
                paymentMethod: form.paymentMethod,
                specialInstructions: form.specialInstructions.trim() || null,
                isConfirmed: true,
                verificationMethod: form.verificationMethod,
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
            setOtp("");
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

        if (!otp.trim()) {
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
        setForm(initialForm);
        setErrors({});
        setOtp("");
        setRequestMeta(null);
        setStep("form");
        setBanner({ type: "", text: "" });
    };

    return (
        <section className="relative overflow-hidden bg-[#f6f3ef] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <div className="absolute inset-x-0 top-0 h-[320px] bg-[radial-gradient(circle_at_top,#d9d6ff_0%,rgba(246,243,239,0)_58%)]" />

            <div className="relative mx-auto max-w-4xl">
                <div className="mb-8 text-center sm:mb-10 sm:text-left">
                    <div className="mb-4 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-neutral-500">
                        <span className="h-px w-10 bg-neutral-300" />
                        {t.eyebrow}
                    </div>

                    <h1 className="max-w-3xl text-4xl font-medium leading-tight text-neutral-900 sm:text-5xl">
                        {t.titleA}{" "}
                        <span className="font-serif italic text-[#4b63ff]">
                            {t.titleB}
                        </span>
                        <br />
                        {t.titleC}
                    </h1>

                    <p className="mt-5 max-w-2xl text-sm leading-7 text-neutral-500 sm:text-base">
                        {t.subtitle}
                    </p>
                </div>

                <div className="rounded-[28px] border border-black/5 bg-white/90 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.10)] backdrop-blur sm:p-8">
                    <div className="mb-6 h-1 w-full rounded-full bg-[linear-gradient(90deg,#d9d6ff_0%,#4b63ff_45%,#3e51d1_100%)]" />

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
                                <Field label={t.senderName} icon={User} error={errors.senderName}>
                                    <input
                                        name="senderName"
                                        value={form.senderName}
                                        onChange={handleChange}
                                        placeholder={t.placeholders.senderName}
                                        className={`${inputClass(!!errors.senderName)} h-12`}
                                    />
                                </Field>

                                <Field label={t.senderPhone} icon={Phone} error={errors.senderPhone}>
                                    <input
                                        name="senderPhone"
                                        value={form.senderPhone}
                                        onChange={handleChange}
                                        placeholder={t.placeholders.senderPhone}
                                        className={`${inputClass(!!errors.senderPhone)} h-12`}
                                    />
                                </Field>
                            </div>

                            <Field
                                label={t.senderEmail}
                                icon={Mail}
                                error={errors.senderEmail}
                                required={false}
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
                                <Field label={t.deliveryType} icon={Truck} error={errors.deliveryType}>
                                    <select
                                        name="deliveryType"
                                        value={form.deliveryType}
                                        onChange={handleChange}
                                        className={`${inputClass(!!errors.deliveryType)} h-12`}
                                    >
                                        {t.deliveryTypes.map((item) => (
                                            <option key={item.value} value={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                    </select>
                                </Field>

                                <Field label={t.serviceSpeed} icon={Clock3} error={errors.serviceSpeed}>
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

                            <Field label={t.pickupAddress} icon={MapPin} error={errors.pickupAddress}>
                                <input
                                    name="pickupAddress"
                                    value={form.pickupAddress}
                                    onChange={handleChange}
                                    placeholder={t.placeholders.pickupAddress}
                                    className={`${inputClass(!!errors.pickupAddress)} h-12`}
                                />
                            </Field>

                            <div className="grid gap-5 md:grid-cols-2">
                                <Field label={t.pickupDate} icon={CalendarDays} error={errors.pickupDate}>
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
                                >
                                    <select
                                        name="pickupTimeSlot"
                                        value={form.pickupTimeSlot}
                                        onChange={handleChange}
                                        disabled={!form.pickupDate}
                                        className={`${inputClass(!!errors.pickupTimeSlot)} h-12`}
                                    >
                                        <option value="">
                                            {form.pickupDate ? t.choose : t.selectPickupDateFirst}
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
                                <Field label={t.receiverName} icon={User} error={errors.receiverName}>
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
                                >
                                    <input
                                        name="receiverPhone"
                                        value={form.receiverPhone}
                                        onChange={handleChange}
                                        placeholder={t.placeholders.receiverPhone}
                                        className={`${inputClass(!!errors.receiverPhone)} h-12`}
                                    />
                                </Field>
                            </div>

                            <Field
                                label={t.deliveryAddress}
                                icon={MapPin}
                                error={errors.deliveryAddress}
                            >
                                <input
                                    name="deliveryAddress"
                                    value={form.deliveryAddress}
                                    onChange={handleChange}
                                    placeholder={t.placeholders.deliveryAddress}
                                    className={`${inputClass(!!errors.deliveryAddress)} h-12`}
                                />
                            </Field>

                            <SectionTitle title={t.packageInfo} />

                            <div className="grid gap-5 md:grid-cols-2">
                                <Field label={t.packageType} icon={Package} error={errors.packageType}>
                                    <input
                                        name="packageType"
                                        value={form.packageType}
                                        onChange={handleChange}
                                        placeholder={t.placeholders.packageType}
                                        className={`${inputClass(!!errors.packageType)} h-12`}
                                    />
                                </Field>

                                <Field label={t.weight} icon={Scale} error={errors.weight}>
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
                                <Field label={t.quantity} icon={Hash} error={errors.quantity}>
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
                                <Field label={t.isFragile} icon={AlertTriangle} error={errors.isFragile}>
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
                            >
                                <textarea
                                    name="specialInstructions"
                                    value={form.specialInstructions}
                                    onChange={handleChange}
                                    placeholder={t.placeholders.specialInstructions}
                                    rows={4}
                                    className={`${inputClass(!!errors.specialInstructions)} min-h-[110px] resize-none py-3`}
                                />
                            </Field>

                            <SectionTitle title={t.verificationInfo} />

                            <Field
                                label={t.verificationMethod}
                                icon={ShieldCheck}
                                error={errors.verificationMethod}
                            >
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {t.verificationMethods.map((item) => {
                                        const active = form.verificationMethod === item.value;
                                        const disabled =
                                            item.value === "email" && !form.senderEmail.trim();

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
                                                        ? "border-[#4b63ff] bg-[#eef1ff] shadow-[0_10px_25px_rgba(75,99,255,0.12)]"
                                                        : "border-neutral-200 bg-white hover:border-neutral-300",
                                                    disabled ? "cursor-not-allowed opacity-50" : "",
                                                ].join(" ")}
                                            >
                                                <div className="text-sm font-semibold text-neutral-900">
                                                    {item.label}
                                                </div>
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

                            <label className="block">
                                <div className="flex items-start gap-3 rounded-2xl border border-neutral-200 bg-[#fafbff] px-4 py-3">
                                    <input
                                        type="checkbox"
                                        name="isConfirmed"
                                        checked={form.isConfirmed}
                                        onChange={handleChange}
                                        className="mt-1 h-4 w-4 rounded border-neutral-300 text-[#4b63ff] focus:ring-[#4b63ff]"
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

                            <button
                                type="submit"
                                disabled={submitLoading}
                                className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(90deg,#5b6ff8_0%,#4357e8_45%,#3e4fd4_100%)] px-6 text-sm font-semibold uppercase tracking-[0.26em] text-white shadow-[0_18px_40px_rgba(75,99,255,0.35)] transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {submitLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                                {submitLoading ? t.sending : t.submit}
                                {!submitLoading ? <ArrowRight className="h-4 w-4" /> : null}
                            </button>
                        </form>
                    ) : null}

                    {step === "otp" ? (
                        <form onSubmit={handleVerify} className="space-y-6">
                            <div className="rounded-[24px] border border-[#dfe4ff] bg-[#f8f9ff] p-5">
                                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#4b63ff] shadow-sm">
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

                            <Field label={t.otpLabel} icon={ShieldCheck} error={errors.otp}>
                                <input
                                    value={otp}
                                    onChange={(e) => {
                                        setOtp(e.target.value);
                                        setErrors((prev) => ({ ...prev, otp: "" }));
                                    }}
                                    placeholder={t.placeholders.otp}
                                    className={`${inputClass(!!errors.otp)} h-12`}
                                />
                            </Field>

                            <div className="grid gap-3 sm:grid-cols-2">
                                <button
                                    type="submit"
                                    disabled={verifyLoading}
                                    className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(90deg,#5b6ff8_0%,#4357e8_45%,#3e4fd4_100%)] px-5 text-sm font-semibold text-white shadow-[0_15px_35px_rgba(75,99,255,0.28)] disabled:cursor-not-allowed disabled:opacity-70"
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
                    <Lock className="h-3.5 w-3.5 text-[#4b63ff]" />
                    <span>{t.secure}</span>
                </div>
            </div>
        </section>
    );
}