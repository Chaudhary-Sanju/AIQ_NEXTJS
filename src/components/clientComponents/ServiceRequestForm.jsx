"use client";

import { useMemo, useState } from "react";
import {
    ArrowRight,
    BadgeDollarSign,
    BriefcaseBusiness,
    CheckCircle2,
    Clock3,
    CreditCard,
    Loader2,
    Lock,
    Mail,
    MapPin,
    Phone,
    RefreshCcw,
    ShieldCheck,
    User,
} from "lucide-react";

import http from "@/http";

const COPY = {
    en: {
        eyebrow: "WORK WITH US",
        titleA: "Submit a",
        titleB: "service",
        titleC: "request",
        subtitle:
            "Tell us about your project and we'll get back to you within one business day.",
        displayName: "Display Name or Alias",
        email: "Email",
        phone: "Phone",
        address: "Address",
        workDesc: "Work Description",
        budget: "Budget",
        projectTime: "Project Time",
        paymentMethod: "Payment Method",
        verificationMethod: "Verification Method",
        placeholders: {
            displayName: "Jane Smith",
            email: "jane@example.com",
            phone: "+852 98XXXXXXXX",
            address: "123 Main St, Kowloon HK ",
            workDesc: "Describe your project, goals, timeline, and any relevant details...",
            budget: "5,000",
            otp: "Enter 6-digit OTP",
        },
        submit: "Send Request",
        reset: "Send Another Request",
        sending: "Sending...",
        verifyTitle: "Verify your request",
        verifyText:
            "We sent a one-time code to your selected verification method. Enter it below to confirm your request.",
        otpLabel: "Verification Code",
        verify: "Verify OTP",
        verifying: "Verifying...",
        resend: "Resend OTP",
        resending: "Resending...",
        edit: "Edit Request",
        secure: "Your information is kept private and secure.",
        successTitle: "Request verified successfully",
        successText:
            "Your service request has been confirmed. Our team will review it and contact you soon.",
        choose: "Select",
        chooseTimeline: "Select timeline",
        choosePayment: "Select payment method",
        emailMethod: "Email",
        phoneMethod: "Phone",
        required: "This field is required.",
        invalidEmail: "Please enter a valid email address.",
        invalidPhone: "Please enter a valid phone number.",
        invalidBudget: "Please enter a valid budget amount.",
        invalidOtp: "Please enter the OTP code.",
        timelines: [
            { value: "within 24 hours", label: "Within 24 hours" },
            { value: "within a week", label: "Within a week" },
            { value: "within 2 weeks", label: "Within two weeks" },
            { value: "within a month", label: "Within a month" },
            { value: "1-3 months", label: "Within 1-3 months" },
            { value: "flexible", label: "Flexible" },
        ],
        payments: [
            { value: "cod", label: "Cash" },
            { value: "bank-transfer", label: "Bank transfer" },
            { value: "bank deposit", label: "Bank deposite" },
            { value: "card", label: "Card" },
            { value: "cheque", label: "Cheque" },
        ],
        currencies: ["HKD", "NPR"],

    },
    ne: {
        eyebrow: "हामीसँग काम गर्नुहोस्",
        titleA: "सेवा",
        titleB: "अनुरोध",
        titleC: "पेश गर्नुहोस्",
        subtitle:
            "आफ्नो परियोजनाबारे हामीलाई बताउनुहोस्। हामी एक कार्यदिवसभित्र तपाईंलाई सम्पर्क गर्नेछौं।",
        displayName: "डिस्प्ले नाम वा उपनाम",
        email: "इमेल",
        phone: "फोन",
        address: "ठेगाना",
        workDesc: "कामको विवरण",
        budget: "बजेट",
        projectTime: "परियोजनाको समय",
        paymentMethod: "भुक्तानी विधि",
        verificationMethod: "प्रमाणीकरण विधि",
        placeholders: {
            displayName: "जेन स्मिथ",
            email: "jane@example.com",
            phone: "+977 98XXXXXXXX",
            address: "123 Main St, Kowloon HK ",
            workDesc: "आफ्नो परियोजना, लक्ष्य, समयरेखा र सम्बन्धित विवरण लेख्नुहोस्...",
            budget: "5,000",
            otp: "६ अङ्कको OTP हाल्नुहोस्",
        },
        submit: "अनुरोध पठाउनुहोस्",
        reset: "फेरि अर्को अनुरोध पठाउनुहोस्",
        sending: "पठाइँदैछ...",
        verifyTitle: "आफ्नो अनुरोध प्रमाणित गर्नुहोस्",
        verifyText:
            "हामीले तपाईंले रोजेको प्रमाणीकरण माध्यममा एक पटक प्रयोग हुने कोड पठाएका छौँ। अनुरोध पुष्टि गर्न तल हाल्नुहोस्।",
        otpLabel: "प्रमाणीकरण कोड",
        verify: "OTP प्रमाणित गर्नुहोस्",
        verifying: "प्रमाणित हुँदैछ...",
        resend: "OTP फेरि पठाउनुहोस्",
        resending: "फेरि पठाइँदैछ...",
        edit: "अनुरोध सम्पादन गर्नुहोस्",
        secure: "तपाईंको जानकारी निजी र सुरक्षित राखिन्छ।",
        successTitle: "अनुरोध सफलतापूर्वक प्रमाणित भयो",
        successText:
            "तपाईंको सेवा अनुरोध पुष्टि भएको छ। हाम्रो टोलीले समीक्षा गरेर चाँडै सम्पर्क गर्नेछ।",
        choose: "छान्नुहोस्",
        chooseTimeline: "समयरेखा छान्नुहोस्",
        choosePayment: "भुक्तानी विधि छान्नुहोस्",
        emailMethod: "इमेल",
        phoneMethod: "फोन",
        required: "यो फिल्ड आवश्यक छ।",
        invalidEmail: "कृपया मान्य इमेल लेख्नुहोस्।",
        invalidPhone: "कृपया मान्य फोन नम्बर लेख्नुहोस्।",
        invalidBudget: "कृपया मान्य बजेट लेख्नुहोस्।",
        invalidOtp: "कृपया OTP कोड लेख्नुहोस्।",
        timelines: [
            { value: "within 24 hours", label: "२४ घण्टाभित्र" },
            { value: "within a week", label: "एक हप्ताभित्र" },
            { value: "within two weeks", label: "दुई हप्ताभित्र" },
            { value: "within a month", label: "एक महिनाभित्र" },
            { value: "flexible", label: "लचिलो" },
        ],
        payments: [
            { value: "cod", label: "क्यास अन डेलिभरी" },
            { value: "bank-transfer", label: "बैंक ट्रान्सफर" },
            { value: "card", label: "कार्ड" },
            { value: "esewa-khalti", label: "इसेवा / खल्ती" },
        ],
        currencies: ["NPR", "HKD"],
    },
    zh: {
        eyebrow: "与我们合作",
        titleA: "提交",
        titleB: "服务",
        titleC: "需求",
        subtitle: "告诉我们您的项目需求，我们会在一个工作日内回复您。",
        displayName: "显示名称或昵称",
        email: "电邮",
        phone: "电话",
        address: "地址",
        workDesc: "需求描述",
        budget: "预算",
        projectTime: "项目时间",
        paymentMethod: "付款方式",
        verificationMethod: "验证方式",
        placeholders: {
            displayName: "Jane Smith",
            email: "jane@example.com",
            phone: "+852 5XXXXXXX",
            address: "香港九龙大街123号",
            workDesc: "请描述您的项目、目标、时间安排及其他相关细节...",
            budget: "5,000",
            otp: "输入 6 位验证码",
        },
        submit: "发送需求",
        reset: "再发送一个需求",
        sending: "发送中...",
        verifyTitle: "验证您的需求",
        verifyText: "我们已把一次性验证码发送到您选择的验证方式，请在下方输入以确认需求。",
        otpLabel: "验证码",
        verify: "验证 OTP",
        verifying: "验证中...",
        resend: "重新发送 OTP",
        resending: "重新发送中...",
        edit: "编辑需求",
        secure: "您的资料会被安全及私密地保存。",
        successTitle: "需求已成功验证",
        successText: "您的服务需求已确认，我们的团队会尽快审核并联系您。",
        choose: "请选择",
        chooseTimeline: "选择时间安排",
        choosePayment: "选择付款方式",
        emailMethod: "电邮",
        phoneMethod: "电话",
        required: "此栏位为必填。",
        invalidEmail: "请输入有效的电邮地址。",
        invalidPhone: "请输入有效的电话号码。",
        invalidBudget: "请输入有效的预算金额。",
        invalidOtp: "请输入验证码。",
        timelines: [
            { value: "within 24 hours", label: "24 小时内" },
            { value: "within a week", label: "一周内" },
            { value: "within two weeks", label: "两周内" },
            { value: "within a month", label: "一个月内" },
            { value: "flexible", label: "可灵活安排" },
        ],
        payments: [
            { value: "cod", label: "货到付款" },
            { value: "bank-transfer", label: "银行转账" },
            { value: "card", label: "银行卡" },
            { value: "esewa-khalti", label: "eSewa / Khalti" },
        ],
        currencies: ["HKD", "NPR"],
    },
};

const initialForm = {
    displayName: "",
    email: "",
    phone: "",
    address: "",
    workDesc: "",
    budget: "",
    currency: "HKD",
    projectTime: "",
    paymentMethod: "",
    verificationMethod: "email",
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

function inputClass(hasError) {
    return [
        "w-full rounded-2xl border bg-white px-4 text-sm text-neutral-800 outline-none transition",
        "placeholder:text-neutral-400 focus:ring-4",
        hasError
            ? "border-red-300 focus:border-red-400 focus:ring-red-100"
            : "border-neutral-200 focus:border-[#4b63ff] focus:ring-[#4b63ff]/10",
    ].join(" ");
}

export default function ServiceRequestForm({ locale = "en" }) {
    const t = COPY[locale] || COPY.en;

    const [form, setForm] = useState({
        ...initialForm,
        currency: t.currencies[0] || "HKD",
    });
    const [errors, setErrors] = useState({});
    const [otp, setOtp] = useState("");
    const [requestMeta, setRequestMeta] = useState(null);
    const [step, setStep] = useState("form");
    const [submitLoading, setSubmitLoading] = useState(false);
    const [verifyLoading, setVerifyLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [banner, setBanner] = useState({ type: "", text: "" });

    const verificationValue = useMemo(() => {
        return form.verificationMethod === "phone" ? form.phone : form.email;
    }, [form.verificationMethod, form.phone, form.email]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => {
            let updated = { ...prev, [name]: value };

            // auto switch verification if email becomes empty
            if (name === "email" && !value.trim() && prev.verificationMethod === "email") {
                updated.verificationMethod = "phone";
            }

            // auto switch if phone becomes empty
            if (name === "phone" && !value.trim() && prev.verificationMethod === "phone") {
                updated.verificationMethod = "email";
            }

            return updated;
        });

        setErrors((prev) => ({ ...prev, [name]: "" }));
        setBanner({ type: "", text: "" });
    };

    const validate = () => {
        const nextErrors = {};

        if (!form.displayName.trim()) nextErrors.displayName = t.required;

        // email optional
        if (form.email.trim() && !/^\S+@\S+\.\S+$/.test(form.email)) {
            nextErrors.email = t.invalidEmail;
        }

        if (!form.phone.trim()) nextErrors.phone = t.required;
        else if (!/^[+]?[-()\s\d]{7,20}$/.test(form.phone)) nextErrors.phone = t.invalidPhone;

        if (!form.address.trim()) nextErrors.address = t.required;
        if (!form.workDesc.trim()) nextErrors.workDesc = t.required;

        if (form.budget === "" || form.budget === null || form.budget === undefined) {
            nextErrors.budget = t.required;
        } else {
            const budgetValue = Number(form.budget);
            if (!Number.isFinite(budgetValue) || budgetValue <= 0) {
                nextErrors.budget = t.invalidBudget;
            }
        }

        if (!form.projectTime) nextErrors.projectTime = t.required;
        if (!form.paymentMethod) nextErrors.paymentMethod = t.required;

        if (form.verificationMethod === "email" && !form.email.trim()) {
            nextErrors.email = t.required;
        }

        if (form.verificationMethod === "phone" && !form.phone.trim()) {
            nextErrors.phone = t.required;
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
                displayName: form.displayName.trim(),
                email: form.email.trim() || undefined,
                phone: form.phone.trim(),
                address: form.address.trim(),
                workDesc: form.workDesc.trim(),
                budget: Number(form.budget),
                currency: form.currency.toLowerCase(),
                projectTime: form.projectTime,
                paymentMethod: form.paymentMethod,
                verificationMethod: form.verificationMethod,
            };

            const res = await http.post("/frontend/serviceForm/submit", payload);
            const data = res?.data || {};

            setRequestMeta({
                id: data.id,
                expiresAt: data.expiresAt,
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
            const res = await http.post("/frontend/serviceForm/verify-otp", {
                id: requestMeta?.id,
                otp: otp.trim(),
            });

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
            const res = await http.post("/frontend/serviceForm/resend-otp", {
                id: requestMeta.id,
            });

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
        setForm({ ...initialForm, currency: t.currencies[0] || "HKD" });
        setErrors({});
        setOtp("");
        setRequestMeta(null);
        setStep("form");
        setBanner({ type: "", text: "" });
    };

    return (
        <section className="relative overflow-hidden bg-[#f6f3ef] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <div className="absolute inset-x-0 top-0 h-[320px] bg-[radial-gradient(circle_at_top,#d9d6ff_0%,rgba(246,243,239,0)_58%)]" />

            <div className="relative mx-auto max-w-3xl">
                <div className="mb-8 text-center sm:mb-10 sm:text-left">
                    <div className="mb-4 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-neutral-500">
                        <span className="h-px w-10 bg-neutral-300" />
                        {t.eyebrow}
                    </div>

                    <h1 className="max-w-xl text-4xl font-medium leading-tight text-neutral-900 sm:text-5xl">
                        {t.titleA} <span className="font-serif italic text-[#4b63ff]">{t.titleB}</span>
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
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <Field label={t.displayName} icon={User} error={errors.displayName}>
                                <input
                                    name="displayName"
                                    value={form.displayName}
                                    onChange={handleChange}
                                    placeholder={t.placeholders.displayName}
                                    className={`${inputClass(!!errors.displayName)} h-12`}
                                />
                            </Field>

                            <div className="grid gap-5 md:grid-cols-2">
                                <Field label={t.email} icon={Mail} error={errors.email} required={false}>
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder={t.placeholders.email}
                                        className={`${inputClass(!!errors.email)} h-12`}
                                    />
                                </Field>

                                <Field label={t.phone} icon={Phone} error={errors.phone}>
                                    <input
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        placeholder={t.placeholders.phone}
                                        className={`${inputClass(!!errors.phone)} h-12`}
                                    />
                                </Field>
                            </div>

                            <Field label={t.address} icon={MapPin} error={errors.address}>
                                <input
                                    name="address"
                                    value={form.address}
                                    onChange={handleChange}
                                    placeholder={t.placeholders.address}
                                    className={`${inputClass(!!errors.address)} h-12`}
                                />
                            </Field>

                            <Field label={t.workDesc} icon={BriefcaseBusiness} error={errors.workDesc}>
                                <textarea
                                    name="workDesc"
                                    value={form.workDesc}
                                    onChange={handleChange}
                                    placeholder={t.placeholders.workDesc}
                                    rows={5}
                                    className={`${inputClass(!!errors.workDesc)} min-h-[130px] py-3 resize-none`}
                                />
                            </Field>

                            <Field label={t.budget} icon={BadgeDollarSign} error={errors.budget}>
                                <div className="grid grid-cols-[1fr_110px] overflow-hidden rounded-2xl">
                                    <input
                                        type="number"
                                        name="budget"
                                        value={form.budget}
                                        onChange={handleChange}
                                        placeholder={t.placeholders.budget}
                                        min="0"
                                        step="0.01"
                                        className={`${inputClass(!!errors.budget)} h-12 rounded-r-none border-r-0`}
                                    />
                                    <select
                                        name="currency"
                                        value={form.currency}
                                        onChange={handleChange}
                                        className={`${inputClass(false)} h-12 rounded-l-none bg-[#fafbff] font-semibold uppercase text-[#4b63ff]`}
                                    >
                                        {t.currencies.map((currency) => (
                                            <option key={currency} value={currency}>
                                                {currency}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </Field>

                            <div className="grid gap-5 md:grid-cols-2">
                                <Field label={t.projectTime} icon={Clock3} error={errors.projectTime}>
                                    <select
                                        name="projectTime"
                                        value={form.projectTime}
                                        onChange={handleChange}
                                        className={`${inputClass(!!errors.projectTime)} h-12`}
                                    >
                                        <option value="">{t.chooseTimeline}</option>
                                        {t.timelines.map((item) => (
                                            <option key={item.value} value={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                    </select>
                                </Field>

                                <Field label={t.paymentMethod} icon={CreditCard} error={errors.paymentMethod}>
                                    <select
                                        name="paymentMethod"
                                        value={form.paymentMethod}
                                        onChange={handleChange}
                                        className={`${inputClass(!!errors.paymentMethod)} h-12`}
                                    >
                                        <option value="">{t.choosePayment}</option>
                                        {t.payments.map((item) => (
                                            <option key={item.value} value={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                    </select>
                                </Field>
                            </div>

                            <Field label={t.verificationMethod} icon={ShieldCheck} required={false}>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {[
                                        { value: "email", label: t.emailMethod, disabled: !form.email.trim(), helper: form.email.trim() || t.placeholders.email },
                                        { value: "phone", label: t.phoneMethod, disabled: !form.phone.trim(), helper: form.phone.trim() || t.placeholders.phone },
                                    ].map((item) => {
                                        const active = form.verificationMethod === item.value;
                                        return (
                                            <button
                                                key={item.value}
                                                type="button"
                                                disabled={item.disabled}
                                                onClick={() => setForm((prev) => ({ ...prev, verificationMethod: item.value }))}
                                                className={[
                                                    "rounded-2xl border px-4 py-3 text-left transition",
                                                    active
                                                        ? "border-[#4b63ff] bg-[#eef1ff] shadow-[0_10px_25px_rgba(75,99,255,0.12)]"
                                                        : "border-neutral-200 bg-white hover:border-neutral-300",
                                                    item.disabled ? "cursor-not-allowed opacity-50" : "",
                                                ].join(" ")}
                                            >
                                                <div className="text-sm font-semibold text-neutral-900">{item.label}</div>
                                                <div className="mt-1 text-xs text-neutral-500">{item.helper}</div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </Field>

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
                                <h2 className="text-2xl font-semibold text-neutral-900">{t.verifyTitle}</h2>
                                <p className="mt-2 text-sm leading-7 text-neutral-500">{t.verifyText}</p>
                                <p className="mt-3 text-sm font-medium text-neutral-700">{verificationValue}</p>
                                {requestMeta?.expiresAt ? (
                                    <p className="mt-1 text-xs text-neutral-500">Expires at: {new Date(requestMeta.expiresAt).toLocaleString()}</p>
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
                                    {verifyLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                                    {verifyLoading ? t.verifying : t.verify}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleResend}
                                    disabled={resendLoading}
                                    className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white px-5 text-sm font-semibold text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {resendLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
                                    {resendLoading ? t.resending : t.resend}
                                </button>

                                {/* <button
                                    type="button"
                                    onClick={() => setStep("form")}
                                    className="inline-flex h-12 items-center justify-center rounded-2xl border border-neutral-200 bg-white px-5 text-sm font-semibold text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50"
                                >
                                    {t.edit}
                                </button> */}
                            </div>
                        </form>
                    ) : null}

                    {step === "success" ? (
                        <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 p-6 text-center">
                            <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white text-emerald-600 shadow-sm">
                                <CheckCircle2 className="h-8 w-8" />
                            </div>
                            <h2 className="text-2xl font-semibold text-neutral-900">{t.successTitle}</h2>
                            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-neutral-600">{t.successText}</p>
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
