"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
    Mail,
    Phone,
    ShieldCheck,
    Lock,
    Eye,
    EyeOff,
    ArrowLeft,
    RefreshCcw,
    CheckCircle2,
    Sparkles,
} from "lucide-react";
import http from "@/http";

export const ForgetPassword = ({ locale = "en", dict = {} }) => {
    const t = dict?.auth?.forgetPassword || {};

    const [step, setStep] = useState(1);
    const [verificationMethod, setVerificationMethod] = useState("email");
    const [form, setForm] = useState({
        email: "",
        phone: "",
        otp: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const isEmail = verificationMethod === "email";

    const contactValue = useMemo(() => {
        return isEmail ? form.email : form.phone;
    }, [isEmail, form.email, form.phone]);

    const handleChange = (key, value) => {
        setForm((prev) => ({
            ...prev,
            [key]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [key]: "",
            submit: "",
        }));
    };

    const PHONE_REGEX = /^(\+977-\d{10}|\+852-\d{8})$/;

    const PASSWORD_REGEX =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

    const validateStep1 = () => {
        const nextErrors = {};

        if (verificationMethod === "email") {
            if (!form.email.trim()) {
                nextErrors.email = t.validation?.emailRequired || "Email is required.";
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
                nextErrors.email = t.validation?.emailInvalid || "Enter a valid email address.";
            }
        } else {
            if (!form.phone.trim()) {
                nextErrors.phone = t.validation?.phoneRequired || "Phone number is required.";
            } else if (!PHONE_REGEX.test(form.phone.trim())) {
                nextErrors.phone =
                    t.validation?.phoneInvalid ||
                    "Phone must be a valid Nepal (+977-XXXXXXXXXX) or Hong Kong (+852-XXXXXXXX) number.";
            }
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const validateStep2 = () => {
        const nextErrors = {};

        if (!form.otp.trim()) {
            nextErrors.otp = t.validation?.otpRequired || "OTP is required.";
        } else if (form.otp.trim().length < 4) {
            nextErrors.otp = t.validation?.otpInvalid || "Enter a valid OTP.";
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const validateStep3 = () => {
        const nextErrors = {};

        if (!form.newPassword) {
            nextErrors.newPassword =
                t.validation?.newPasswordRequired || "New password is required.";
        } else if (!PASSWORD_REGEX.test(form.newPassword)) {
            nextErrors.newPassword =
                t.validation?.passwordInvalid ||
                "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.";
        }

        if (!form.confirmPassword) {
            nextErrors.confirmPassword =
                t.validation?.confirmPasswordRequired || "Confirm password is required.";
        } else if (form.newPassword !== form.confirmPassword) {
            nextErrors.confirmPassword =
                t.validation?.passwordMismatch || "Passwords do not match.";
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const buildContactPayload = () => {
        return verificationMethod === "email"
            ? {
                email: form.email.trim(),
                verificationMethod: "email",
            }
            : {
                phone: form.phone.trim(),
                verificationMethod: "phone",
            };
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();

        if (!validateStep1()) return;

        setLoading(true);

        try {
            await http.post("/frontend/auth/forgetPassword", buildContactPayload());

            toast.success(
                t.toast?.otpSent || "If an account exists, an OTP has been sent."
            );

            setStep(2);
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                t.toast?.sendOtpFailed ||
                "Failed to send OTP.";

            toast.error(message);
            setErrors((prev) => ({ ...prev, submit: message }));
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();

        if (!validateStep2()) return;

        setLoading(true);

        try {
            await http.post("/frontend/auth/verifyResetOtp", {
                ...buildContactPayload(),
                otp: form.otp.trim(),
            });

            toast.success(t.toast?.otpVerified || "OTP verified successfully.");

            setStep(3);
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                t.toast?.otpVerifyFailed ||
                "Invalid or expired OTP.";

            toast.error(message);
            setErrors((prev) => ({ ...prev, submit: message }));
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (!validateStep3()) return;

        setLoading(true);

        try {
            await http.put("/frontend/auth/resetPassword", {
                ...buildContactPayload(),
                otp: form.otp.trim(),
                newPassword: form.newPassword,
                confirmPassword: form.confirmPassword,
            });

            toast.success(
                t.toast?.passwordResetSuccess || "Password reset successful."
            );

            setStep(4);
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                t.toast?.passwordResetFailed ||
                "Failed to reset password.";

            toast.error(message);
            setErrors((prev) => ({ ...prev, submit: message }));
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (!validateStep1()) return;

        setResending(true);

        try {
            await http.post("/frontend/auth/forgetPassword", buildContactPayload());

            toast.success(t.toast?.otpResent || "OTP has been sent again.");
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                t.toast?.resendFailed ||
                "Failed to resend OTP.";

            toast.error(message);
        } finally {
            setResending(false);
        }
    };

    const authTitle = t.title || "Forgot password";
    const authSubtitle =
        t.subtitle ||
        "Reset your password securely using email or phone verification.";

    return (
        <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-orange-50 via-white to-blue-50">
            <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl" />
            <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl" />

            <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
                <div className="grid w-full overflow-hidden rounded-[32px] border border-orange-100 bg-white/95 shadow-[0_24px_70px_rgba(15,42,94,0.14)] backdrop-blur lg:grid-cols-[0.95fr_1.05fr]">
                    {/* Left Side */}
                    <div className="relative hidden overflow-hidden bg-gradient-to-br from-[#1a4b8f] via-[#0f2a5e] to-[#13295b] p-10 text-white lg:block">
                        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
                        <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-orange-300/20 blur-3xl" />

                        <div className="relative z-10 flex h-full flex-col justify-between">
                            <div>
                                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-orange-100 backdrop-blur">
                                    <Sparkles className="h-4 w-4" />
                                    {t.badge || "Account recovery"}
                                </span>

                                <h1 className="mt-6 text-4xl font-bold leading-tight">
                                    {t.sideTitle || "Recover access to your account"}
                                </h1>

                                <p className="mt-4 max-w-md text-sm leading-7 text-white/75">
                                    {t.sideDescription ||
                                        "Use your email address or phone number to receive a one-time password and create a new secure password."}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <InfoPoint
                                    icon={<ShieldCheck className="h-5 w-5" />}
                                    title={t.points?.secureTitle || "Secure verification"}
                                    text={
                                        t.points?.secureText ||
                                        "OTP verification helps protect your account from unauthorized access."
                                    }
                                />

                                <InfoPoint
                                    icon={<Lock className="h-5 w-5" />}
                                    title={
                                        t.points?.passwordTitle || "Choose a strong password"
                                    }
                                    text={
                                        t.points?.passwordText ||
                                        "Use at least 8 characters with a mix of letters, numbers, and symbols."
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="p-5 sm:p-8 lg:p-10">
                        <div className="mx-auto w-full max-w-md">
                            <Link
                                href={`/${locale}/auth/login`}
                                className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-[#1a4b8f] shadow-sm transition hover:bg-orange-50"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                {t.backToLogin || "Back to login"}
                            </Link>

                            <div className="mb-8">
                                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#1a4b8f]">
                                    <ShieldCheck className="h-4 w-4" />
                                    {t.badge || "Account recovery"}
                                </div>

                                <h2 className="text-3xl font-bold tracking-tight text-neutral-950">
                                    {authTitle}
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-neutral-500">
                                    {authSubtitle}
                                </p>
                            </div>

                            {/* Step indicators */}
                            <div className="mb-8 flex items-center gap-3">
                                {[1, 2, 3].map((item) => {
                                    const active = step === item;
                                    const done = step > item;

                                    return (
                                        <div key={item} className="flex items-center gap-3">
                                            <div
                                                className={[
                                                    "flex h-10 w-10 items-center justify-center rounded-full border text-sm font-bold transition",
                                                    done
                                                        ? "border-green-500 bg-green-500 text-white"
                                                        : active
                                                            ? "border-[#1a4b8f] bg-[#1a4b8f] text-white"
                                                            : "border-orange-100 bg-orange-50 text-neutral-500",
                                                ].join(" ")}
                                            >
                                                {done ? (
                                                    <CheckCircle2 className="h-5 w-5" />
                                                ) : (
                                                    item
                                                )}
                                            </div>

                                            {item !== 3 && (
                                                <div
                                                    className={[
                                                        "h-[2px] w-8 rounded-full",
                                                        step > item
                                                            ? "bg-green-500"
                                                            : "bg-orange-100",
                                                    ].join(" ")}
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {step === 1 && (
                                <form onSubmit={handleSendOtp} className="space-y-5">
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-neutral-800">
                                            {t.chooseMethod || "Choose verification method"}
                                        </label>

                                        <div className="grid grid-cols-2 gap-3">
                                            <MethodButton
                                                active={verificationMethod === "email"}
                                                icon={<Mail className="h-4 w-4" />}
                                                label={t.emailTab || "Email"}
                                                onClick={() => {
                                                    setVerificationMethod("email");
                                                    setErrors({});
                                                }}
                                            />

                                            <MethodButton
                                                active={verificationMethod === "phone"}
                                                icon={<Phone className="h-4 w-4" />}
                                                label={t.phoneTab || "Phone"}
                                                onClick={() => {
                                                    setVerificationMethod("phone");
                                                    setErrors({});
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {verificationMethod === "email" ? (
                                        <Field
                                            label={t.emailLabel || "Email address"}
                                            icon={<Mail className="h-5 w-5" />}
                                            type="email"
                                            value={form.email}
                                            onChange={(value) => handleChange("email", value)}
                                            placeholder={
                                                t.emailPlaceholder || "Enter your email address"
                                            }
                                            error={errors.email}
                                        />
                                    ) : (
                                        <Field
                                            label={t.phoneLabel || "Phone number"}
                                            icon={<Phone className="h-5 w-5" />}
                                            value={form.phone}
                                            onChange={(value) => handleChange("phone", value)}
                                            placeholder={
                                                t.phonePlaceholder ||
                                                "e.g. +977-9812345678 or +852-91234567"
                                            }
                                            error={errors.phone}
                                        />
                                    )}

                                    <SubmitError error={errors.submit} />

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="inline-flex h-13 w-full items-center justify-center rounded-2xl bg-[#1a4b8f] px-5 text-sm font-bold text-white shadow-lg shadow-[#1a4b8f]/20 transition hover:bg-[#0f2a5e] disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {loading
                                            ? t.sendingOtp || "Sending OTP..."
                                            : t.sendOtp || "Send OTP"}
                                    </button>
                                </form>
                            )}

                            {step === 2 && (
                                <form onSubmit={handleVerifyOtp} className="space-y-5">
                                    <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4 text-sm text-neutral-700">
                                        {t.otpSentInfo || "We sent an OTP to"}{" "}
                                        <span className="font-bold text-[#1a4b8f]">
                                            {contactValue}
                                        </span>
                                    </div>

                                    <Field
                                        label={t.otpLabel || "Enter OTP"}
                                        icon={<ShieldCheck className="h-5 w-5" />}
                                        value={form.otp}
                                        onChange={(value) =>
                                            handleChange("otp", value.toUpperCase())
                                        }
                                        placeholder={t.otpPlaceholder || "Enter the OTP"}
                                        error={errors.otp}
                                        inputClassName="uppercase tracking-[0.3em]"
                                    />

                                    <SubmitError error={errors.submit} />

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="inline-flex h-13 w-full items-center justify-center rounded-2xl bg-[#1a4b8f] px-5 text-sm font-bold text-white shadow-lg shadow-[#1a4b8f]/20 transition hover:bg-[#0f2a5e] disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {loading
                                            ? t.verifyingOtp || "Verifying OTP..."
                                            : t.verifyOtp || "Verify OTP"}
                                    </button>

                                    <div className="flex flex-col gap-3 sm:flex-row">
                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="inline-flex h-12 flex-1 items-center justify-center rounded-2xl border border-orange-200 bg-white px-4 text-sm font-semibold text-neutral-700 transition hover:bg-orange-50"
                                        >
                                            {t.changeContact || "Change email/phone"}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleResendOtp}
                                            disabled={resending}
                                            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-orange-200 bg-white px-4 text-sm font-semibold text-neutral-700 transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            <RefreshCcw className="h-4 w-4" />
                                            {resending
                                                ? t.resendingOtp || "Resending..."
                                                : t.resendOtp || "Resend OTP"}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {step === 3 && (
                                <form
                                    onSubmit={handleResetPassword}
                                    className="space-y-5"
                                >
                                    <PasswordField
                                        label={t.newPasswordLabel || "New password"}
                                        value={form.newPassword}
                                        onChange={(value) =>
                                            handleChange("newPassword", value)
                                        }
                                        placeholder={
                                            t.newPasswordPlaceholder ||
                                            "Enter new password"
                                        }
                                        error={errors.newPassword}
                                        show={showNewPassword}
                                        setShow={setShowNewPassword}
                                    />

                                    <PasswordField
                                        label={
                                            t.confirmPasswordLabel ||
                                            "Confirm password"
                                        }
                                        value={form.confirmPassword}
                                        onChange={(value) =>
                                            handleChange("confirmPassword", value)
                                        }
                                        placeholder={
                                            t.confirmPasswordPlaceholder ||
                                            "Confirm new password"
                                        }
                                        error={errors.confirmPassword}
                                        show={showConfirmPassword}
                                        setShow={setShowConfirmPassword}
                                    />

                                    <SubmitError error={errors.submit} />

                                    <p className="rounded-2xl bg-orange-50 px-4 py-3 text-xs leading-5 text-neutral-500">
                                        {t.passwordHint ||
                                            "Use at least 8 characters with uppercase, lowercase, number, and special character."}
                                    </p>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="inline-flex h-13 w-full items-center justify-center rounded-2xl bg-[#1a4b8f] px-5 text-sm font-bold text-white shadow-lg shadow-[#1a4b8f]/20 transition hover:bg-[#0f2a5e] disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {loading
                                            ? t.resettingPassword ||
                                            "Resetting password..."
                                            : t.resetPassword || "Reset password"}
                                    </button>
                                </form>
                            )}

                            {step === 4 && (
                                <div className="rounded-[28px] border border-green-200 bg-green-50 p-6 text-center">
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                        <CheckCircle2 className="h-8 w-8 text-green-600" />
                                    </div>

                                    <h3 className="text-xl font-bold text-neutral-950">
                                        {t.successTitle || "Password updated"}
                                    </h3>

                                    <p className="mt-2 text-sm leading-6 text-neutral-600">
                                        {t.successDescription ||
                                            "Your password has been reset successfully. You can now log in with your new password."}
                                    </p>

                                    <Link
                                        href={`/${locale}/auth/login`}
                                        className="mt-6 inline-flex h-12 items-center justify-center rounded-2xl bg-[#1a4b8f] px-6 text-sm font-bold text-white shadow-lg shadow-[#1a4b8f]/20 transition hover:bg-[#0f2a5e]"
                                    >
                                        {t.goToLogin || "Go to login"}
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

function InfoPoint({ icon, title, text }) {
    return (
        <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
            <div className="mt-0.5 text-orange-200">{icon}</div>

            <div>
                <p className="font-semibold text-white">{title}</p>
                <p className="mt-1 text-sm leading-6 text-white/70">{text}</p>
            </div>
        </div>
    );
}

function MethodButton({ active, icon, label, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                "flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-bold transition",
                active
                    ? "border-[#1a4b8f] bg-blue-50 text-[#1a4b8f]"
                    : "border-orange-100 bg-white text-neutral-700 hover:border-orange-200 hover:bg-orange-50",
            ].join(" ")}
        >
            {icon}
            {label}
        </button>
    );
}

function Field({
    label,
    icon,
    value,
    onChange,
    placeholder,
    error,
    type = "text",
    inputClassName = "",
}) {
    return (
        <div>
            <label className="mb-2 block text-sm font-semibold text-neutral-800">
                {label}
            </label>

            <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                    {icon}
                </span>

                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={[
                        "h-13 w-full rounded-2xl border bg-white pl-12 pr-4 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-[#1a4b8f] focus:ring-4 focus:ring-[#1a4b8f]/10",
                        error ? "border-red-300" : "border-orange-100",
                        inputClassName,
                    ].join(" ")}
                />
            </div>

            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </div>
    );
}

function PasswordField({
    label,
    value,
    onChange,
    placeholder,
    error,
    show,
    setShow,
}) {
    return (
        <div>
            <label className="mb-2 block text-sm font-semibold text-neutral-800">
                {label}
            </label>

            <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />

                <input
                    type={show ? "text" : "password"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={[
                        "h-13 w-full rounded-2xl border bg-white pl-12 pr-12 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-[#1a4b8f] focus:ring-4 focus:ring-[#1a4b8f]/10",
                        error ? "border-red-300" : "border-orange-100",
                    ].join(" ")}
                />

                <button
                    type="button"
                    onClick={() => setShow((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 transition hover:text-[#1a4b8f]"
                >
                    {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
            </div>

            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </div>
    );
}

function SubmitError({ error }) {
    if (!error) return null;

    return (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
        </div>
    );
}