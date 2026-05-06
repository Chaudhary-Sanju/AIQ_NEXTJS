"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Lock,
    Eye,
    EyeOff,
    ShieldCheck,
    RotateCw,
    Sparkles,
    CheckCircle2,
} from "lucide-react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

import http from "@/http";
import { setInForm } from "@/lib/index";

/* ---------------------------------- */
/* Helpers */
/* ---------------------------------- */
function extractFieldErrors(err) {
    const msg = err?.response?.data?.message;
    if (msg && typeof msg === "object" && !Array.isArray(msg)) return msg;
    return null;
}

function extractErrorText(err) {
    const data = err?.response?.data;
    const msg =
        data?.message ||
        data?.success ||
        err?.message ||
        "Something went wrong.";

    if (typeof msg === "string") return msg;

    if (msg && typeof msg === "object") {
        return Object.values(msg)
            .flatMap((v) => (Array.isArray(v) ? v : [v]))
            .filter((v) => typeof v === "string")
            .join("\n");
    }

    return "Something went wrong.";
}

function getSuccessText(res, fallback) {
    return res?.data?.success || res?.data?.message || fallback;
}

/* ---------------------------------- */
/* Validation */
/* ---------------------------------- */
const PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const PHONE_REGEX =
    /^((\+977-?\d{10})|(\d{10})|(\+852-?[569]\d{7})|([569]\d{7}))$/;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateRegisterForm(form, t) {
    const errors = {};

    if (!form.name || form.name.trim().length < 2) {
        errors.name = t(
            "signup.validation.nameMin",
            "Name must be at least 2 characters."
        );
    }

    if (!form.email || !EMAIL_REGEX.test(form.email)) {
        errors.email = t("signup.validation.emailRequired", "Invalid email format.");
    }

    if (!form.password || !PASSWORD_REGEX.test(form.password)) {
        errors.password = t(
            "signup.validation.passwordRule",
            "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
        );
    }

    if (!form.confirm_password) {
        errors.confirm_password = t(
            "signup.validation.confirmRequired",
            "Confirm password is required."
        );
    } else if (form.confirm_password !== form.password) {
        errors.confirm_password = t(
            "signup.validation.confirmMismatch",
            "Password does not match."
        );
    }

    if (!form.phone || !PHONE_REGEX.test(form.phone)) {
        errors.phone = t(
            "signup.validation.phoneRule",
            "Phone must be a valid Nepal (+977) or Hong Kong (+852) number."
        );
    }

    if (!form.address || !form.address.trim()) {
        errors.address = t(
            "signup.validation.addressRequired",
            "Address is required."
        );
    }

    if (
        !form.verificationMethod ||
        !["email", "phone"].includes(form.verificationMethod)
    ) {
        errors.verificationMethod = t(
            "signup.validation.verificationMethod",
            "Please select a verification method."
        );
    }

    if (!form.recaptchaToken || typeof form.recaptchaToken !== "string") {
        errors.captcha = t(
            "signup.validation.recaptcha",
            "Please complete reCAPTCHA."
        );
    }

    return errors;
}

/* ---------------------------------- */
/* UI */
/* ---------------------------------- */
const Glow = () => (
    <>
        <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl" />
    </>
);

function ErrorAlert({ message }) {
    if (!message) return null;

    return (
        <div className="whitespace-pre-line rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {message}
        </div>
    );
}

function SuccessAlert({ message }) {
    if (!message) return null;

    return (
        <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            {message}
        </div>
    );
}

function Field({ label, children, error }) {
    return (
        <div className="space-y-2">
            <div className="text-sm font-semibold text-neutral-800">{label}</div>
            {children}
            {!!error && <p className="text-xs font-medium text-red-500">{error}</p>}
        </div>
    );
}

function TextInput({
    icon: Icon,
    type = "text",
    name,
    id,
    value,
    onChange,
    placeholder,
    autoComplete,
    inputMode,
    maxLength,
    required = true,
    disabled = false,
    hasError = false,
}) {
    return (
        <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                <Icon size={18} />
            </span>

            <input
                type={type}
                name={name}
                id={id}
                required={required}
                value={value}
                onChange={onChange}
                autoComplete={autoComplete}
                placeholder={placeholder}
                inputMode={inputMode}
                maxLength={maxLength}
                disabled={disabled}
                className={[
                    "h-12 w-full rounded-2xl border bg-white pl-12 pr-4 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-[#1a4b8f] focus:ring-4 focus:ring-[#1a4b8f]/10",
                    hasError ? "border-red-300" : "border-orange-100",
                    "disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:opacity-60",
                ].join(" ")}
            />
        </div>
    );
}

function PasswordInput({
    name,
    id,
    value,
    onChange,
    isVisible,
    onToggleVisibility,
    placeholder,
    autoComplete,
    hasError = false,
    t,
}) {
    return (
        <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                <Lock size={18} />
            </span>

            <input
                type={isVisible ? "text" : "password"}
                name={name}
                id={id}
                required
                value={value}
                onChange={onChange}
                autoComplete={autoComplete}
                placeholder={placeholder}
                className={[
                    "h-12 w-full rounded-2xl border bg-white pl-12 pr-12 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-[#1a4b8f] focus:ring-4 focus:ring-[#1a4b8f]/10",
                    hasError ? "border-red-300" : "border-orange-100",
                ].join(" ")}
            />

            <button
                type="button"
                onClick={onToggleVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-2 text-neutral-500 transition hover:bg-orange-50 hover:text-[#1a4b8f]"
                aria-label={
                    isVisible
                        ? t?.("signup.aria.hidePassword", "Hide password")
                        : t?.("signup.aria.showPassword", "Show password")
                }
            >
                {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
        </div>
    );
}

function PrimaryButton({ loading, loadingText, children }) {
    return (
        <button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-2xl bg-[#1a4b8f] text-sm font-bold text-white shadow-lg shadow-[#1a4b8f]/20 transition hover:bg-[#0f2a5e] active:bg-[#0f2a5e] disabled:cursor-not-allowed disabled:opacity-60"
        >
            {loading ? loadingText : children}
        </button>
    );
}

function SecondaryButton({ loading, onClick, loadingText, children }) {
    return (
        <button
            type="button"
            disabled={loading}
            onClick={onClick}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-orange-200 bg-white text-sm font-bold text-neutral-700 transition hover:bg-orange-50 hover:text-[#1a4b8f] disabled:cursor-not-allowed disabled:opacity-60"
        >
            {loading ? loadingText : children}
        </button>
    );
}

function OtpInput({
    value,
    onChange,
    length = 6,
    disabled = false,
    hasError = false,
    t,
}) {
    const refs = useRef([]);

    const normalized = (value || "")
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .slice(0, length);

    const chars = Array.from({ length }, (_, i) => normalized[i] || "");

    const commit = (nextChars, focusIdx) => {
        onChange(nextChars.join(""));

        if (
            typeof focusIdx === "number" &&
            refs.current[focusIdx] &&
            typeof refs.current[focusIdx].focus === "function"
        ) {
            refs.current[focusIdx].focus();
        }
    };

    const setAt = (idx, raw) => {
        const clean = (raw || "")
            .toUpperCase()
            .replace(/[^A-Z0-9]/g, "");

        const next = [...chars];

        if (!clean) {
            next[idx] = "";
            commit(next);
            return;
        }

        const chunk = clean.slice(0, length - idx).split("");

        for (let i = 0; i < chunk.length; i++) {
            next[idx + i] = chunk[i];
        }

        const focusTo = Math.min(idx + chunk.length, length - 1);
        commit(next, focusTo);
    };

    const handleKeyDown = (idx, e) => {
        if (disabled) return;

        if (e.key === "Backspace") {
            e.preventDefault();

            const next = [...chars];

            if (next[idx]) {
                next[idx] = "";
                commit(next);
            } else if (idx > 0) {
                next[idx - 1] = "";
                commit(next, idx - 1);
            }
        }

        if (e.key === "ArrowLeft" && idx > 0) refs.current[idx - 1]?.focus?.();
        if (e.key === "ArrowRight" && idx < length - 1)
            refs.current[idx + 1]?.focus?.();
    };

    return (
        <div className="space-y-2">
            <div className="grid grid-cols-6 gap-2">
                {chars.map((char, idx) => (
                    <input
                        key={idx}
                        ref={(el) => {
                            refs.current[idx] = el;
                        }}
                        value={char}
                        maxLength={1}
                        onChange={(e) => setAt(idx, e.target.value)}
                        onPaste={(e) => {
                            e.preventDefault();
                            setAt(idx, e.clipboardData.getData("text") || "");
                        }}
                        onKeyDown={(e) => handleKeyDown(idx, e)}
                        autoComplete={idx === 0 ? "one-time-code" : "off"}
                        disabled={disabled}
                        aria-label={
                            t
                                ? t("signup.otp.digitAria", `OTP character ${idx + 1}`)
                                : `OTP character ${idx + 1}`
                        }
                        className={[
                            "h-12 w-full rounded-2xl border bg-white text-center text-sm font-bold uppercase text-neutral-900 outline-none transition focus:border-[#1a4b8f] focus:ring-4 focus:ring-[#1a4b8f]/10",
                            hasError ? "border-red-300" : "border-orange-100",
                            "disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:opacity-60",
                        ].join(" ")}
                    />
                ))}
            </div>

            <div className="flex items-center justify-between text-[11px] text-neutral-500">
                <span>
                    {t
                        ? t("signup.otp.helper", "Enter the 6-character code")
                        : "Enter the 6-character code"}
                </span>

                <button
                    type="button"
                    disabled={disabled || !value}
                    onClick={() => onChange("")}
                    className="font-semibold text-[#1a4b8f] underline disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {t ? t("signup.otp.clear", "Clear") : "Clear"}
                </button>
            </div>
        </div>
    );
}

/* ---------------------------------- */
/* Page */
/* ---------------------------------- */
export default function Signup({ locale = "en", dict = {} }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { executeRecaptcha } = useGoogleReCaptcha();

    const t = (key, fallback) => {
        const parts = key.split(".");
        let cur = dict;

        for (const p of parts) cur = cur?.[p];

        return cur ?? fallback;
    };

    const safeNext = useMemo(() => {
        const raw = searchParams?.get("next");

        if (!raw) return null;

        return raw.startsWith("/") ? raw : null;
    }, [searchParams]);

    const [step, setStep] = useState("register");

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        password: "",
        confirm_password: "",
        verificationMethod: "",
        recaptchaToken: "",
    });

    const [otp, setOtp] = useState("");

    const [passVisible, setPassVisible] = useState(false);
    const [confirmVisible, setConfirmVisible] = useState(false);

    const [loadingRegister, setLoadingRegister] = useState(false);
    const [loadingVerify, setLoadingVerify] = useState(false);
    const [loadingResend, setLoadingResend] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});

    const handleInputChange = (e) => {
        setInForm(e, form, setForm);

        const key = e.target.name;

        setFieldErrors((prev) => {
            if (!prev?.[key]) return prev;

            const next = { ...prev };
            delete next[key];
            return next;
        });

        if (error) setError("");
    };

    const handleVerificationMethodChange = (method) => {
        setForm((prev) => ({
            ...prev,
            verificationMethod: method,
        }));

        setFieldErrors((prev) => {
            const next = { ...prev };
            delete next.verificationMethod;
            return next;
        });

        if (error) setError("");
        if (success) setSuccess("");
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setFieldErrors({});

        if (!form.verificationMethod) {
            setFieldErrors((prev) => ({
                ...prev,
                verificationMethod: t(
                    "signup.validation.verificationMethod",
                    "Please select a verification method."
                ),
            }));
            setError(
                t(
                    "signup.validation.verificationMethod",
                    "Please select a verification method."
                )
            );
            return;
        }

        if (!executeRecaptcha) {
            setFieldErrors((prev) => ({
                ...prev,
                captcha: t(
                    "signup.validation.recaptcha",
                    "Please complete reCAPTCHA."
                ),
            }));
            setError(
                t("signup.validation.recaptcha", "Please complete reCAPTCHA.")
            );
            return;
        }

        let recaptchaToken = "";

        try {
            recaptchaToken = await executeRecaptcha("submit_form");

            if (!recaptchaToken || typeof recaptchaToken !== "string") {
                setFieldErrors((prev) => ({
                    ...prev,
                    captcha: t(
                        "signup.validation.recaptcha",
                        "Please complete reCAPTCHA."
                    ),
                }));
                setError(
                    t("signup.validation.recaptcha", "Please complete reCAPTCHA.")
                );
                return;
            }
        } catch {
            setFieldErrors((prev) => ({
                ...prev,
                captcha: t(
                    "signup.validation.recaptcha",
                    "Please complete reCAPTCHA."
                ),
            }));
            setError(
                t("signup.validation.recaptcha", "Please complete reCAPTCHA.")
            );
            return;
        }

        const formToValidate = {
            ...form,
            recaptchaToken,
        };

        const clientErrors = validateRegisterForm(formToValidate, t);

        if (Object.keys(clientErrors).length) {
            setFieldErrors(clientErrors);
            setError(t("signup.errors.fixFields", "Please fix the highlighted fields."));
            return;
        }

        const payload = {
            name: form.name.trim(),
            email: form.email.trim().toLowerCase(),
            password: form.password,
            confirm_password: form.confirm_password,
            phone: form.phone.trim(),
            address: form.address.trim(),
            verificationMethod: form.verificationMethod,
            recaptchaToken,
        };

        setLoadingRegister(true);

        try {
            const res = await http.post("frontend/auth/register-new-user", payload);

            setForm((prev) => ({
                ...prev,
                recaptchaToken,
            }));

            setSuccess(
                getSuccessText(
                    res,
                    t(
                        "signup.success.register",
                        "Thank you for registering. Please verify your account using OTP."
                    )
                )
            );

            setStep("otp");
            setOtp("");
        } catch (err) {
            const fe = extractFieldErrors(err);

            if (fe) {
                setFieldErrors(fe);
                setError(t("signup.errors.fixFields", "Please fix the highlighted fields."));
            } else {
                setError(extractErrorText(err));
            }
        } finally {
            setLoadingRegister(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setFieldErrors({});

        const cleanOtp = otp.trim().toUpperCase();

        if (!form.verificationMethod) {
            setFieldErrors({
                verificationMethod: t(
                    "signup.validation.verificationMethod",
                    "Please select a verification method."
                ),
            });

            setError(
                t(
                    "signup.validation.verificationMethod",
                    "Please select a verification method."
                )
            );

            return;
        }

        if (!cleanOtp || cleanOtp.length !== 6) {
            setFieldErrors({
                otp: t(
                    "signup.validation.otpRequired",
                    "Please enter the 6-character OTP."
                ),
            });

            setError(t("signup.errors.otpCheck", "Please check the OTP and try again."));
            return;
        }

        const payload =
            form.verificationMethod === "email"
                ? {
                    email: form.email.trim().toLowerCase(),
                    verificationMethod: "email",
                    otp: cleanOtp,
                }
                : {
                    phone: form.phone.trim(),
                    verificationMethod: "phone",
                    otp: cleanOtp,
                };

        setLoadingVerify(true);

        try {
            const res = await http.post("frontend/auth/verify-otp", payload);

            setSuccess(
                getSuccessText(
                    res,
                    t(
                        "signup.success.otpVerified",
                        "OTP verified successfully! Redirecting to login..."
                    )
                )
            );

            setTimeout(() => {
                router.replace(safeNext || `/${locale}/auth/login`);
                router.refresh();
            }, 900);
        } catch (err) {
            const fe = extractFieldErrors(err);

            if (fe) {
                setFieldErrors(fe);
                setError(t("signup.errors.otpCheck", "Please check the OTP and try again."));
            } else {
                setError(extractErrorText(err));
            }
        } finally {
            setLoadingVerify(false);
        }
    };

    const handleResendOtp = async () => {
        setError("");
        setSuccess("");
        setFieldErrors({});

        if (!form.verificationMethod) {
            setFieldErrors((prev) => ({
                ...prev,
                verificationMethod: t(
                    "signup.validation.verificationMethod",
                    "Please select a verification method."
                ),
            }));

            setError(
                t(
                    "signup.validation.verificationMethod",
                    "Please select a verification method."
                )
            );

            return;
        }

        const payload =
            form.verificationMethod === "email"
                ? {
                    email: form.email.trim().toLowerCase(),
                    verificationMethod: "email",
                }
                : {
                    phone: form.phone.trim(),
                    verificationMethod: "phone",
                };

        setLoadingResend(true);

        try {
            const res = await http.post("frontend/auth/resend-otp", payload);

            setSuccess(
                getSuccessText(
                    res,
                    t("signup.success.otpResent", "OTP resent successfully.")
                )
            );
        } catch (err) {
            const fe = extractFieldErrors(err);

            if (fe) {
                setFieldErrors(fe);
                setError(t("signup.errors.otpResendFail", "Unable to resend OTP."));
            } else {
                setError(extractErrorText(err));
            }
        } finally {
            setLoadingResend(false);
        }
    };

    const backToRegister = () => {
        setError("");
        setSuccess("");
        setOtp("");
        setFieldErrors({});
        setStep("register");
    };

    const verificationTarget =
        form.verificationMethod === "email" ? form.email : form.phone;

    return (
        <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-orange-50 via-white to-blue-50">
            <Glow />

            <div className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
                <div className="grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-orange-100 bg-white/95 shadow-[0_24px_70px_rgba(15,42,94,0.14)] backdrop-blur lg:grid-cols-[0.95fr_1.05fr]">
                    {/* Left Side */}
                    <div className="relative hidden overflow-hidden bg-gradient-to-br from-[#1a4b8f] via-[#0f2a5e] to-[#13295b] p-10 text-white lg:block">
                        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
                        <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-orange-300/20 blur-3xl" />

                        <div className="relative z-10 flex h-full flex-col justify-between">
                            <div>
                                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-orange-100 backdrop-blur">
                                    <ShieldCheck size={16} />
                                    {step === "register"
                                        ? t("signup.left.tagCreate", "Create Account")
                                        : t("signup.left.tagOtp", "Verify OTP")}
                                </span>

                                <h1 className="mt-6 text-4xl font-bold leading-tight">
                                    {step === "register"
                                        ? t("signup.left.titleCreate", "Join HkMandu")
                                        : t("signup.left.titleOtp", "Secure Verification")}
                                </h1>

                                <p className="mt-4 max-w-md text-sm leading-7 text-white/75">
                                    {step === "register"
                                        ? t(
                                            "signup.left.descCreate",
                                            "Create your account to manage orders and access services."
                                        )
                                        : t(
                                            "signup.left.descOtp",
                                            "Enter the OTP sent to your selected verification method to activate your account."
                                        )}
                                </p>

                                {step === "register" && (
                                    <div className="mt-6 space-y-4">
                                        <InfoPoint
                                            icon={<Lock className="h-5 w-5" />}
                                            title={t(
                                                "signup.left.passwordRuleTitle",
                                                "Password rule"
                                            )}
                                            text={t(
                                                "signup.left.passwordRuleText",
                                                "8+ chars, uppercase, lowercase, number, special (@$!%*?&)."
                                            )}
                                        />

                                        <InfoPoint
                                            icon={<Phone className="h-5 w-5" />}
                                            title={t(
                                                "signup.left.phoneRuleTitle",
                                                "Phone formats"
                                            )}
                                            text={t(
                                                "signup.left.phoneRuleText",
                                                "Nepal: +9779876543210 or +977-9876543210\nHK: +85251234567 or +852-51234567"
                                            )}
                                        />
                                    </div>
                                )}

                                {step === "otp" && (
                                    <div className="mt-6 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                                        <div className="text-sm text-white/65">
                                            {t("signup.otp.sentVia", "Verification via")}
                                        </div>

                                        <div className="mt-1 font-bold capitalize text-white">
                                            {form.verificationMethod}
                                        </div>

                                        <div className="mt-4 text-sm text-white/65">
                                            {t("signup.otp.sentTo", "OTP sent to")}
                                        </div>

                                        <div className="mt-1 break-all font-bold text-white">
                                            {verificationTarget}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="text-xs text-white/65">
                                {step === "register"
                                    ? t(
                                        "signup.left.tipCreate",
                                        "Tip: Use a strong password and keep it private."
                                    )
                                    : t(
                                        "signup.left.tipOtp",
                                        "Didn’t receive OTP? You can resend it."
                                    )}
                            </div>
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="p-5 sm:p-8 lg:p-10">
                        <div className="mx-auto w-full max-w-md">
                            <div className="mb-8">
                                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#1a4b8f]">
                                    <Sparkles className="h-4 w-4" />
                                    {step === "register"
                                        ? t("signup.mobile.titleCreate", "Sign up")
                                        : t("signup.mobile.titleOtp", "Verify OTP")}
                                </div>

                                <h1 className="text-3xl font-bold tracking-tight text-neutral-950">
                                    {step === "register"
                                        ? t("signup.left.titleCreate", "Join HkMandu")
                                        : t("signup.left.titleOtp", "Secure Verification")}
                                </h1>

                                <p className="mt-2 text-sm leading-6 text-neutral-500">
                                    {step === "register"
                                        ? t(
                                            "signup.mobile.descCreate",
                                            "Fill in your details to create an account"
                                        )
                                        : t(
                                            "signup.mobile.descOtp",
                                            "Enter the OTP sent to your selected method"
                                        )}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <ErrorAlert message={error} />
                                <SuccessAlert message={success} />

                                {step === "register" ? (
                                    <form onSubmit={handleRegister} className="space-y-5">
                                        <Field
                                            label={t("signup.form.fullName", "Full name")}
                                            error={fieldErrors?.name}
                                        >
                                            <TextInput
                                                icon={User}
                                                type="text"
                                                name="name"
                                                id="name"
                                                value={form.name}
                                                onChange={handleInputChange}
                                                placeholder={t(
                                                    "signup.form.fullNamePlaceholder",
                                                    "Enter your full name"
                                                )}
                                                autoComplete="name"
                                                hasError={!!fieldErrors?.name}
                                            />
                                        </Field>

                                        <Field
                                            label={t("signup.form.email", "Email")}
                                            error={fieldErrors?.email}
                                        >
                                            <TextInput
                                                icon={Mail}
                                                type="email"
                                                name="email"
                                                id="email"
                                                value={form.email}
                                                onChange={handleInputChange}
                                                placeholder={t(
                                                    "signup.form.emailPlaceholder",
                                                    "you@example.com"
                                                )}
                                                autoComplete="email"
                                                hasError={!!fieldErrors?.email}
                                            />
                                        </Field>

                                        <div className="grid gap-5 md:grid-cols-2">
                                            <Field
                                                label={t("signup.form.phone", "Phone")}
                                                error={fieldErrors?.phone}
                                            >
                                                <TextInput
                                                    icon={Phone}
                                                    type="text"
                                                    name="phone"
                                                    id="phone"
                                                    value={form.phone}
                                                    onChange={handleInputChange}
                                                    placeholder={t(
                                                        "signup.form.phonePlaceholder",
                                                        "+9779812345678"
                                                    )}
                                                    autoComplete="tel"
                                                    hasError={!!fieldErrors?.phone}
                                                />
                                            </Field>

                                            <Field
                                                label={t("signup.form.address", "Address")}
                                                error={fieldErrors?.address}
                                            >
                                                <TextInput
                                                    icon={MapPin}
                                                    type="text"
                                                    name="address"
                                                    id="address"
                                                    value={form.address}
                                                    onChange={handleInputChange}
                                                    placeholder={t(
                                                        "signup.form.addressPlaceholder",
                                                        "Kathmandu"
                                                    )}
                                                    autoComplete="street-address"
                                                    hasError={!!fieldErrors?.address}
                                                />
                                            </Field>
                                        </div>

                                        <div className="grid gap-5 md:grid-cols-2">
                                            <Field
                                                label={t("signup.form.password", "Password")}
                                                error={fieldErrors?.password}
                                            >
                                                <PasswordInput
                                                    name="password"
                                                    id="password"
                                                    value={form.password}
                                                    onChange={handleInputChange}
                                                    isVisible={passVisible}
                                                    onToggleVisibility={() =>
                                                        setPassVisible((s) => !s)
                                                    }
                                                    placeholder={t(
                                                        "signup.form.passwordPlaceholder",
                                                        "Create a password"
                                                    )}
                                                    autoComplete="new-password"
                                                    hasError={!!fieldErrors?.password}
                                                    t={t}
                                                />
                                            </Field>

                                            <Field
                                                label={t(
                                                    "signup.form.confirmPassword",
                                                    "Confirm password"
                                                )}
                                                error={fieldErrors?.confirm_password}
                                            >
                                                <PasswordInput
                                                    name="confirm_password"
                                                    id="confirm_password"
                                                    value={form.confirm_password}
                                                    onChange={handleInputChange}
                                                    isVisible={confirmVisible}
                                                    onToggleVisibility={() =>
                                                        setConfirmVisible((s) => !s)
                                                    }
                                                    placeholder={t(
                                                        "signup.form.confirmPasswordPlaceholder",
                                                        "Repeat password"
                                                    )}
                                                    autoComplete="new-password"
                                                    hasError={
                                                        !!fieldErrors?.confirm_password
                                                    }
                                                    t={t}
                                                />
                                            </Field>
                                        </div>

                                        <Field
                                            label={t(
                                                "signup.form.verificationMethod",
                                                "Verification method"
                                            )}
                                            error={fieldErrors?.verificationMethod}
                                        >
                                            <div className="grid grid-cols-2 gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleVerificationMethodChange(
                                                            "email"
                                                        )
                                                    }
                                                    className={[
                                                        "h-12 rounded-2xl border text-sm font-bold transition",
                                                        form.verificationMethod === "email"
                                                            ? "border-[#1a4b8f] bg-blue-50 text-[#1a4b8f]"
                                                            : "border-orange-100 bg-white text-neutral-700 hover:bg-orange-50",
                                                    ].join(" ")}
                                                >
                                                    {t(
                                                        "signup.form.verifyByEmail",
                                                        "Email"
                                                    )}
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleVerificationMethodChange(
                                                            "phone"
                                                        )
                                                    }
                                                    className={[
                                                        "h-12 rounded-2xl border text-sm font-bold transition",
                                                        form.verificationMethod === "phone"
                                                            ? "border-[#1a4b8f] bg-blue-50 text-[#1a4b8f]"
                                                            : "border-orange-100 bg-white text-neutral-700 hover:bg-orange-50",
                                                    ].join(" ")}
                                                >
                                                    {t(
                                                        "signup.form.verifyByPhone",
                                                        "Phone"
                                                    )}
                                                </button>
                                            </div>
                                        </Field>

                                        <PrimaryButton
                                            loading={loadingRegister}
                                            loadingText={t(
                                                "signup.buttons.pleaseWait",
                                                "Please wait..."
                                            )}
                                        >
                                            {t(
                                                "signup.buttons.createAccount",
                                                "Create account"
                                            )}
                                        </PrimaryButton>

                                        <div className="rounded-2xl bg-orange-50 px-4 py-4 text-center text-sm text-neutral-600">
                                            {t(
                                                "signup.links.alreadyHave",
                                                "Already have an account?"
                                            )}{" "}
                                            <Link
                                                href={`/${locale}/auth/login`}
                                                className="font-bold text-[#1a4b8f] hover:underline"
                                            >
                                                {t("signup.links.login", "Login")}
                                            </Link>
                                        </div>

                                        <div className="text-center text-sm text-neutral-600">
                                            {t(
                                                "signup.links.alreadyRegister",
                                                "Already registered?"
                                            )}{" "}
                                            <Link
                                                href={`/${locale}/auth/verify-account`}
                                                className="font-bold text-[#1a4b8f] hover:underline"
                                            >
                                                {t(
                                                    "signup.links.verifyNow",
                                                    "Verify Account Now"
                                                )}
                                            </Link>
                                        </div>

                                        <div className="pt-1 text-center text-[11px] leading-5 text-neutral-500">
                                            {t(
                                                "signup.footer.agreePrefix",
                                                "By creating an account, you agree to our"
                                            )}{" "}
                                            <Link
                                                href={`/${locale}/terms`}
                                                className="font-semibold text-[#1a4b8f] underline"
                                            >
                                                {t("signup.footer.terms", "Terms")}
                                            </Link>{" "}
                                            {t("signup.footer.and", "and")}{" "}
                                            <Link
                                                href={`/${locale}/privacy-policy`}
                                                className="font-semibold text-[#1a4b8f] underline"
                                            >
                                                {t(
                                                    "signup.footer.privacy",
                                                    "Privacy Policy"
                                                )}
                                            </Link>
                                            .
                                        </div>
                                    </form>
                                ) : (
                                    <form onSubmit={handleVerifyOtp} className="space-y-5">
                                        <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4 text-sm text-neutral-700">
                                            <div className="text-neutral-500">
                                                {t("signup.otp.sentTo", "OTP sent to")}
                                            </div>

                                            <div className="mt-1 break-all font-bold text-[#1a4b8f]">
                                                {verificationTarget}
                                            </div>

                                            <div className="mt-3 text-neutral-500">
                                                {t(
                                                    "signup.otp.method",
                                                    "Verification method"
                                                )}
                                                :
                                                <span className="ml-2 font-bold capitalize text-neutral-900">
                                                    {form.verificationMethod}
                                                </span>
                                            </div>
                                        </div>

                                        <Field
                                            label={t("signup.otp.label", "OTP Code")}
                                            error={fieldErrors?.otp}
                                        >
                                            <OtpInput
                                                value={otp}
                                                onChange={(v) => {
                                                    setOtp(v.toUpperCase());

                                                    if (fieldErrors?.otp) {
                                                        setFieldErrors((prev) => {
                                                            const next = { ...prev };
                                                            delete next.otp;
                                                            return next;
                                                        });
                                                    }

                                                    if (error) setError("");
                                                }}
                                                length={6}
                                                disabled={
                                                    loadingVerify || loadingResend
                                                }
                                                hasError={!!fieldErrors?.otp}
                                                t={t}
                                            />
                                        </Field>

                                        <PrimaryButton
                                            loading={loadingVerify}
                                            loadingText={t(
                                                "signup.buttons.pleaseWait",
                                                "Please wait..."
                                            )}
                                        >
                                            {t("signup.buttons.verifyOtp", "Verify OTP")}
                                        </PrimaryButton>

                                        <div className="grid gap-3 md:grid-cols-2">
                                            <SecondaryButton
                                                loading={loadingResend}
                                                onClick={handleResendOtp}
                                                loadingText={t(
                                                    "signup.buttons.pleaseWait",
                                                    "Please wait..."
                                                )}
                                            >
                                                <RotateCw size={16} />
                                                {t(
                                                    "signup.buttons.resendOtp",
                                                    "Resend OTP"
                                                )}
                                            </SecondaryButton>

                                            <SecondaryButton
                                                loading={false}
                                                onClick={backToRegister}
                                                loadingText={t(
                                                    "signup.buttons.pleaseWait",
                                                    "Please wait..."
                                                )}
                                            >
                                                {t(
                                                    "signup.buttons.backToSignup",
                                                    "Back to Signup"
                                                )}
                                            </SecondaryButton>
                                        </div>

                                        <div className="text-center text-sm text-neutral-600">
                                            {t(
                                                "signup.links.wantLogin",
                                                "Want to login?"
                                            )}{" "}
                                            <Link
                                                href={`/${locale}/auth/login`}
                                                className="font-bold text-[#1a4b8f] hover:underline"
                                            >
                                                {t("signup.links.login", "Login")}
                                            </Link>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function InfoPoint({ icon, title, text }) {
    return (
        <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
            <div className="mt-0.5 text-orange-200">{icon}</div>

            <div>
                <p className="font-semibold text-white">{title}</p>
                <p className="mt-1 whitespace-pre-line text-sm leading-6 text-white/70">
                    {text}
                </p>
            </div>
        </div>
    );
}