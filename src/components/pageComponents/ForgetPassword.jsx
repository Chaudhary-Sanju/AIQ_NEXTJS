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

    // At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
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
                    "Phone must be a valid Nepal (+977XXXXXXXXXX) or Hong Kong (+852XXXXXXXX) number.";
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
                t.toast?.otpSent ||
                "If an account exists, an OTP has been sent."
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

            toast.success(
                t.toast?.otpVerified || "OTP verified successfully."
            );

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

            toast.success(
                t.toast?.otpResent || "OTP has been sent again."
            );
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
        <section className="min-h-screen bg-gradient-to-br bg-gradient-to-b from-[#1b1741] via-[#2a2b68] to-[#2b2458]">
            <div className="mx-auto flex min-h-screen max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
                <div className="grid w-full overflow-hidden rounded-[32px] bg-white shadow-[0_20px_80px_rgba(15,23,42,0.08)] lg:grid-cols-2">
                    {/* Left Side */}
                    <div className="relative hidden overflow-hidden bg-[#0f172a] p-10 text-white lg:block">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.35),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.25),transparent_25%)]" />

                        <div className="relative z-10 flex h-full flex-col justify-between">
                            <div>
                                <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.2em] text-blue-100">
                                    {t.badge || "Account recovery"}
                                </span>

                                <h1 className="mt-6 text-4xl font-bold leading-tight">
                                    {t.sideTitle || "Recover access to your account"}
                                </h1>

                                <p className="mt-4 max-w-md text-sm leading-7 text-slate-300">
                                    {t.sideDescription ||
                                        "Use your email address or phone number to receive a one-time password and create a new secure password."}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                                    <ShieldCheck className="mt-0.5 h-5 w-5 text-emerald-300" />
                                    <div>
                                        <p className="font-semibold">
                                            {t.points?.secureTitle || "Secure verification"}
                                        </p>
                                        <p className="text-sm text-slate-300">
                                            {t.points?.secureText ||
                                                "OTP verification helps protect your account from unauthorized access."}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                                    <Lock className="mt-0.5 h-5 w-5 text-blue-300" />
                                    <div>
                                        <p className="font-semibold">
                                            {t.points?.passwordTitle || "Choose a strong password"}
                                        </p>
                                        <p className="text-sm text-slate-300">
                                            {t.points?.passwordText ||
                                                "Use at least 8 characters with a mix of letters, numbers, and symbols."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="p-5 sm:p-8 lg:p-10">
                        <div className="mx-auto w-full max-w-md">
                            <Link
                                href={`/${locale}/auth/login`}
                                className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                {t.backToLogin || "Back to login"}
                            </Link>

                            <div className="mb-8">
                                <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                                    {authTitle}
                                </h2>
                                <p className="mt-2 text-sm leading-6 text-slate-500">
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
                                                    "flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition",
                                                    done
                                                        ? "border-emerald-500 bg-emerald-500 text-white"
                                                        : active
                                                            ? "border-blue-600 bg-blue-600 text-white"
                                                            : "border-slate-200 bg-white text-slate-500",
                                                ].join(" ")}
                                            >
                                                {done ? <CheckCircle2 className="h-5 w-5" /> : item}
                                            </div>

                                            {item !== 3 && (
                                                <div className="h-[2px] w-8 rounded-full bg-slate-200" />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {step === 1 && (
                                <form onSubmit={handleSendOtp} className="space-y-5">
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-slate-800">
                                            {t.chooseMethod || "Choose verification method"}
                                        </label>

                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setVerificationMethod("email");
                                                    setErrors({});
                                                }}
                                                className={[
                                                    "flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition",
                                                    verificationMethod === "email"
                                                        ? "border-blue-600 bg-blue-50 text-blue-700"
                                                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
                                                ].join(" ")}
                                            >
                                                <Mail className="h-4 w-4" />
                                                {t.emailTab || "Email"}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setVerificationMethod("phone");
                                                    setErrors({});
                                                }}
                                                className={[
                                                    "flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition",
                                                    verificationMethod === "phone"
                                                        ? "border-blue-600 bg-blue-50 text-blue-700"
                                                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
                                                ].join(" ")}
                                            >
                                                <Phone className="h-4 w-4" />
                                                {t.phoneTab || "Phone"}
                                            </button>
                                        </div>
                                    </div>

                                    {verificationMethod === "email" ? (
                                        <div>
                                            <label className="mb-2 block text-sm font-semibold text-slate-800">
                                                {t.emailLabel || "Email address"}
                                            </label>
                                            <div className="relative">
                                                <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    type="email"
                                                    value={form.email}
                                                    onChange={(e) => handleChange("email", e.target.value)}
                                                    placeholder={
                                                        t.emailPlaceholder || "Enter your email address"
                                                    }
                                                    className={[
                                                        "h-13 w-full rounded-2xl border bg-white pl-12 pr-4 text-sm outline-none transition",
                                                        errors.email
                                                            ? "border-red-300 focus:border-red-400"
                                                            : "border-slate-200 focus:border-blue-600",
                                                    ].join(" ")}
                                                />
                                            </div>
                                            {errors.email && (
                                                <p className="mt-2 text-sm text-red-500">{errors.email}</p>
                                            )}
                                        </div>
                                    ) : (
                                        <div>
                                            <label className="mb-2 block text-sm font-semibold text-slate-800">
                                                {t.phoneLabel || "Phone number"}
                                            </label>
                                            <div className="relative">
                                                <Phone className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    type="text"
                                                    value={form.phone}
                                                    onChange={(e) => handleChange("phone", e.target.value)}
                                                    placeholder={
                                                        t.phonePlaceholder || "e.g. +9779812345678 or +85291234567"
                                                    }
                                                    className={[
                                                        "h-13 w-full rounded-2xl border bg-white pl-12 pr-4 text-sm outline-none transition",
                                                        errors.phone
                                                            ? "border-red-300 focus:border-red-400"
                                                            : "border-slate-200 focus:border-blue-600",
                                                    ].join(" ")}
                                                />
                                            </div>
                                            {errors.phone && (
                                                <p className="mt-2 text-sm text-red-500">{errors.phone}</p>
                                            )}
                                        </div>
                                    )}

                                    {errors.submit && (
                                        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                                            {errors.submit}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="inline-flex h-13 w-full items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {loading
                                            ? t.sendingOtp || "Sending OTP..."
                                            : t.sendOtp || "Send OTP"}
                                    </button>
                                </form>
                            )}

                            {step === 2 && (
                                <form onSubmit={handleVerifyOtp} className="space-y-5">
                                    <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
                                        {t.otpSentInfo || "We sent an OTP to"}{" "}
                                        <span className="font-semibold">{contactValue}</span>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-slate-800">
                                            {t.otpLabel || "Enter OTP"}
                                        </label>
                                        <div className="relative">
                                            <ShieldCheck className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="text"
                                                value={form.otp}
                                                onChange={(e) =>
                                                    handleChange("otp", e.target.value.toUpperCase())
                                                }
                                                placeholder={t.otpPlaceholder || "Enter the OTP"}
                                                className={[
                                                    "h-13 w-full rounded-2xl border bg-white pl-12 pr-4 text-sm uppercase tracking-[0.3em] outline-none transition",
                                                    errors.otp
                                                        ? "border-red-300 focus:border-red-400"
                                                        : "border-slate-200 focus:border-blue-600",
                                                ].join(" ")}
                                            />
                                        </div>
                                        {errors.otp && (
                                            <p className="mt-2 text-sm text-red-500">{errors.otp}</p>
                                        )}
                                    </div>

                                    {errors.submit && (
                                        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                                            {errors.submit}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="inline-flex h-13 w-full items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {loading
                                            ? t.verifyingOtp || "Verifying OTP..."
                                            : t.verifyOtp || "Verify OTP"}
                                    </button>

                                    <div className="flex flex-col gap-3 sm:flex-row">
                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="inline-flex h-12 flex-1 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:border-slate-300"
                                        >
                                            {t.changeContact || "Change email/phone"}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleResendOtp}
                                            disabled={resending}
                                            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-60"
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
                                <form onSubmit={handleResetPassword} className="space-y-5">
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-slate-800">
                                            {t.newPasswordLabel || "New password"}
                                        </label>
                                        <div className="relative">
                                            <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type={showNewPassword ? "text" : "password"}
                                                value={form.newPassword}
                                                onChange={(e) =>
                                                    handleChange("newPassword", e.target.value)
                                                }
                                                placeholder={
                                                    t.newPasswordPlaceholder || "Enter new password"
                                                }
                                                className={[
                                                    "h-13 w-full rounded-2xl border bg-white pl-12 pr-12 text-sm outline-none transition",
                                                    errors.newPassword
                                                        ? "border-red-300 focus:border-red-400"
                                                        : "border-slate-200 focus:border-blue-600",
                                                ].join(" ")}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPassword((prev) => !prev)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                                            >
                                                {showNewPassword ? (
                                                    <EyeOff className="h-5 w-5" />
                                                ) : (
                                                    <Eye className="h-5 w-5" />
                                                )}
                                            </button>
                                        </div>
                                        {errors.newPassword && (
                                            <p className="mt-2 text-sm text-red-500">
                                                {errors.newPassword}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-slate-800">
                                            {t.confirmPasswordLabel || "Confirm password"}
                                        </label>
                                        <div className="relative">
                                            <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                value={form.confirmPassword}
                                                onChange={(e) =>
                                                    handleChange("confirmPassword", e.target.value)
                                                }
                                                placeholder={
                                                    t.confirmPasswordPlaceholder ||
                                                    "Confirm new password"
                                                }
                                                className={[
                                                    "h-13 w-full rounded-2xl border bg-white pl-12 pr-12 text-sm outline-none transition",
                                                    errors.confirmPassword
                                                        ? "border-red-300 focus:border-red-400"
                                                        : "border-slate-200 focus:border-blue-600",
                                                ].join(" ")}
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowConfirmPassword((prev) => !prev)
                                                }
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff className="h-5 w-5" />
                                                ) : (
                                                    <Eye className="h-5 w-5" />
                                                )}
                                            </button>
                                        </div>
                                        {errors.confirmPassword && (
                                            <p className="mt-2 text-sm text-red-500">
                                                {errors.confirmPassword}
                                            </p>
                                        )}
                                    </div>

                                    {errors.submit && (
                                        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                                            {errors.submit}
                                        </div>
                                    )}

                                    <p className="mt-2 text-xs text-slate-500">
                                        {t.passwordHint ||
                                            "Use at least 8 characters with uppercase, lowercase, number, and special character."}
                                    </p>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="inline-flex h-13 w-full items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {loading
                                            ? t.resettingPassword || "Resetting password..."
                                            : t.resetPassword || "Reset password"}
                                    </button>
                                </form>
                            )}

                            {step === 4 && (
                                <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-center">
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                                        <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900">
                                        {t.successTitle || "Password updated"}
                                    </h3>

                                    <p className="mt-2 text-sm leading-6 text-slate-600">
                                        {t.successDescription ||
                                            "Your password has been reset successfully. You can now log in with your new password."}
                                    </p>

                                    <Link
                                        href={`/${locale}/login`}
                                        className="mt-6 inline-flex h-12 items-center justify-center rounded-2xl bg-blue-600 px-6 text-sm font-semibold text-white transition hover:bg-blue-700"
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