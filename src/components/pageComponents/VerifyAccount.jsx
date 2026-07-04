"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
    Mail,
    Phone,
    ShieldCheck,
    RotateCw,
    Sparkles,
    CheckCircle2,
    ArrowLeft,
    Lock,
} from "lucide-react";

import http from "@/http";
import { INPUT_LIMITS } from "@/constants/inputLimits";
import CountryPhoneInput, { normalizeCountryPhone } from "@/components/clientComponents/CountryPhoneInput";

const PHONE_REGEX = /^(\+977-\d{10}|\+852-\d{8})$/;

/* ---------------------------------- */
/* Backend Error Handling */
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
            <div className="text-sm font-semibold text-neutral-800">
                {label}
            </div>
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
    onBlur,
    placeholder,
    autoComplete,
    inputMode,
    maxLength,
    hasError = false,
    disabled = false,
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
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={placeholder}
                autoComplete={autoComplete}
                inputMode={inputMode}
                maxLength={maxLength}
                disabled={disabled}
                required
                className={[
                    "h-12 w-full rounded-2xl border bg-white pl-12 pr-4 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-[#1a4b8f] focus:ring-4 focus:ring-[#1a4b8f]/10",
                    hasError ? "border-red-300" : "border-orange-100",
                    "disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:opacity-60",
                ].join(" ")}
            />
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
        if (e.key === "ArrowRight" && idx < length - 1) refs.current[idx + 1]?.focus?.();
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
                                ? t("verify.otp.digitAria", `OTP character ${idx + 1}`)
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
                        ? t("verify.otp.helper", "Enter the 6-character code")
                        : "Enter the 6-character code"}
                </span>

                <button
                    type="button"
                    disabled={disabled || !value}
                    onClick={() => onChange("")}
                    className="font-semibold text-[#1a4b8f] underline disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {t ? t("verify.otp.clear", "Clear") : "Clear"}
                </button>
            </div>
        </div>
    );
}

function normalizePhone(value) {
    return normalizeCountryPhone(value);
}


/* ---------------------------------- */
/* Page */
/* ---------------------------------- */
export default function VerifyAccount({ locale = "en", dict = {} }) {
    const router = useRouter();
    const searchParams = useSearchParams();

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

    const [verificationMethod, setVerificationMethod] = useState("");
    const [email, setEmail] = useState(searchParams?.get("email") || "");
    const [phone, setPhone] = useState(searchParams?.get("phone") || "");
    const [otp, setOtp] = useState("");

    const [loadingVerify, setLoadingVerify] = useState(false);
    const [loadingResend, setLoadingResend] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});

    const handleVerificationMethodChange = (method) => {
        setVerificationMethod(method);
        setSuccess("");
        setError("");
        setOtp("");

        setFieldErrors((prev) => {
            const next = { ...prev };
            delete next.verificationMethod;
            delete next.email;
            delete next.phone;
            delete next.otp;
            return next;
        });
    };

    const onEmailChange = (e) => {
        setEmail(e.target.value);

        if (fieldErrors?.email) {
            setFieldErrors((p) => {
                const n = { ...p };
                delete n.email;
                return n;
            });
        }

        if (error) setError("");
    };

    const onPhoneChange = (e) => {
        setPhone(e.target.value);

        if (fieldErrors?.phone) {
            setFieldErrors((p) => {
                const n = { ...p };
                delete n.phone;
                return n;
            });
        }

        if (error) setError("");
    };

    const resendOtp = async () => {
        setError("");
        setSuccess("");
        setFieldErrors({});

        const local = {};

        if (verificationMethod === "phone" && !phone?.trim()) {
            local.phone = t("verify.validation.phoneRequired", "Phone is required.");
        } else if (
            verificationMethod === "phone" &&
            !PHONE_REGEX.test(normalizePhone(phone))
        ) {
            local.phone = t(
                "verify.validation.phoneInvalid",
                "Phone must be a valid Nepal (+977) or Hong Kong (+852) number."
            );
        }

        if (verificationMethod === "email" && !email?.trim()) {
            local.email = t("verify.validation.emailRequired", "Email is required.");
        }

        if (verificationMethod === "phone" && !phone?.trim()) {
            local.phone = t("verify.validation.phoneRequired", "Phone is required.");
        }

        if (Object.keys(local).length) {
            setFieldErrors(local);
            setError(t("verify.errors.fixFields", "Please fix the highlighted fields."));
            return;
        }

        const normalizedPhone = normalizePhone(phone);

        const payload =
            verificationMethod === "email"
                ? {
                    email: email.trim().toLowerCase(),
                    verificationMethod: "email",
                }
                : {
                    phone: normalizedPhone,
                    verificationMethod: "phone",
                };

        setLoadingResend(true);

        try {
            const res = await http.post("frontend/auth/resend-otp", payload);

            setSuccess(
                getSuccessText(
                    res,
                    t("verify.success.otpResent", "OTP resent successfully.")
                )
            );
        } catch (err) {
            const fe = extractFieldErrors(err);

            if (fe) {
                setFieldErrors(fe);
                setError(t("verify.errors.fixFields", "Please fix the highlighted fields."));
            } else {
                setError(extractErrorText(err));
            }
        } finally {
            setLoadingResend(false);
        }
    };

    const verifyOtp = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");
        setFieldErrors({});

        const cleanOtp = otp.trim().toUpperCase();
        const normalizedPhone = normalizePhone(phone);
        const local = {};

        if (verificationMethod === "phone" && !phone?.trim()) {
            local.phone = t("verify.validation.phoneRequired", "Phone is required.");
        } else if (
            verificationMethod === "phone" &&
            !PHONE_REGEX.test(normalizePhone(phone))
        ) {
            local.phone = t(
                "verify.validation.phoneInvalid",
                "Phone must be a valid Nepal (+977) or Hong Kong (+852) number."
            );
        }

        if (verificationMethod === "email" && !email?.trim()) {
            local.email = t("verify.validation.emailRequired", "Email is required.");
        }

        if (verificationMethod === "phone" && !phone?.trim()) {
            local.phone = t("verify.validation.phoneRequired", "Phone is required.");
        }

        if (!cleanOtp) {
            local.otp = t("verify.validation.otpRequired", "OTP is required.");
        } else if (cleanOtp.length !== 6) {
            local.otp = t("verify.validation.otpLength", "OTP must be 6 characters.");
        }

        if (Object.keys(local).length) {
            setFieldErrors(local);
            setError(t("verify.errors.fixFields", "Please fix the highlighted fields."));
            return;
        }

        const payload =
            verificationMethod === "email"
                ? {
                    email: email.trim().toLowerCase(),
                    verificationMethod: "email",
                    otp: cleanOtp,
                }
                : {
                    phone: normalizePhone(phone),
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
                        "verify.success.otpVerified",
                        "OTP verified successfully! Redirecting to login..."
                    )
                )
            );

            setTimeout(() => {
                router.replace(safeNext || `/${locale}/auth/login`);
                router.refresh();
            }, 800);
        } catch (err) {
            const fe = extractFieldErrors(err);

            if (fe) {
                setFieldErrors(fe);
                setError(t("verify.errors.otpCheck", "Please check your OTP and try again."));
            } else {
                setError(extractErrorText(err));
            }
        } finally {
            setLoadingVerify(false);
        }
    };

    const currentTarget =
        verificationMethod === "email"
            ? email
            : verificationMethod === "phone"
                ? phone
                : "";

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
                                    {t("verify.left.tag", "Verify Account")}
                                </span>

                                <h1 className="mt-6 text-4xl font-bold leading-tight">
                                    {t("verify.left.title", "Complete verification")}
                                </h1>

                                <p className="mt-4 max-w-md text-sm leading-7 text-white/75">
                                    {t(
                                        "verify.left.desc",
                                        "Choose email or phone verification, resend OTP, and verify your account."
                                    )}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <InfoPoint
                                    icon={<ShieldCheck className="h-5 w-5" />}
                                    title={t("verify.info.secureTitle", "Secure OTP verification")}
                                    text={t(
                                        "verify.info.secureText",
                                        "OTP verification helps protect your account before login."
                                    )}
                                />

                                <InfoPoint
                                    icon={<Lock className="h-5 w-5" />}
                                    title={t("verify.info.methodTitle", "Email or phone")}
                                    text={t(
                                        "verify.info.methodText",
                                        "Select the same method used during signup to receive or verify your code."
                                    )}
                                />

                                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                                    <div className="text-sm text-white/65">
                                        {t("verify.left.method", "Selected method")}
                                    </div>

                                    <div className="mt-1 font-bold capitalize text-white">
                                        {verificationMethod ||
                                            t("verify.left.none", "Not selected")}
                                    </div>

                                    {!!currentTarget && (
                                        <>
                                            <div className="mt-4 text-sm text-white/65">
                                                {t("verify.left.target", "Current target")}
                                            </div>

                                            <div className="mt-1 break-all font-bold text-white">
                                                {currentTarget}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="text-xs text-white/65">
                                {t(
                                    "verify.left.tip",
                                    "Tip: Check spam folder if you don’t see OTP."
                                )}
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
                                {t("verify.links.backToLogin", "Back to login")}
                            </Link>

                            <div className="mb-8">
                                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#1a4b8f]">
                                    <Sparkles className="h-4 w-4" />
                                    {t("verify.mobile.title", "Verify Account")}
                                </div>

                                <h1 className="text-3xl font-bold tracking-tight text-neutral-950">
                                    {t("verify.mobile.title", "Verify Account")}
                                </h1>

                                <p className="mt-2 text-sm leading-6 text-neutral-500">
                                    {t(
                                        "verify.mobile.desc",
                                        "Verify your account with email or phone OTP"
                                    )}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <ErrorAlert message={error} />
                                <SuccessAlert message={success} />

                                <form onSubmit={verifyOtp} className="space-y-5">
                                    <Field
                                        label={t(
                                            "verify.form.verificationMethod",
                                            "Verification method"
                                        )}
                                        error={fieldErrors?.verificationMethod}
                                    >
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleVerificationMethodChange("email")
                                                }
                                                className={[
                                                    "flex h-12 items-center justify-center gap-2 rounded-2xl border text-sm font-bold transition",
                                                    verificationMethod === "email"
                                                        ? "border-[#1a4b8f] bg-blue-50 text-[#1a4b8f]"
                                                        : "border-orange-100 bg-white text-neutral-700 hover:bg-orange-50",
                                                ].join(" ")}
                                            >
                                                <Mail className="h-4 w-4" />
                                                {t("verify.form.verifyByEmail", "Email")}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleVerificationMethodChange("phone")
                                                }
                                                className={[
                                                    "flex h-12 items-center justify-center gap-2 rounded-2xl border text-sm font-bold transition",
                                                    verificationMethod === "phone"
                                                        ? "border-[#1a4b8f] bg-blue-50 text-[#1a4b8f]"
                                                        : "border-orange-100 bg-white text-neutral-700 hover:bg-orange-50",
                                                ].join(" ")}
                                            >
                                                <Phone className="h-4 w-4" />
                                                {t("verify.form.verifyByPhone", "Phone")}
                                            </button>
                                        </div>
                                    </Field>

                                    {verificationMethod === "email" && (
                                        <Field
                                            label={t("verify.form.email", "Email")}
                                            error={fieldErrors?.email}
                                        >
                                            <TextInput
                                                icon={Mail}
                                                type="email"
                                                name="email"
                                                id="email"
                                                value={email}
                                                onChange={onEmailChange}
                                                placeholder={t(
                                                    "verify.form.emailPlaceholder",
                                                    "you@example.com"
                                                )}
                                                autoComplete="email"
                                                maxLength={INPUT_LIMITS.email}
                                                hasError={!!fieldErrors?.email}
                                                disabled={loadingVerify || loadingResend}
                                            />
                                        </Field>
                                    )}

                                    {verificationMethod === "phone" && (
                                        <Field
                                            label={t("verify.form.phone", "Phone")}
                                            error={fieldErrors?.phone}
                                        >
                                            <CountryPhoneInput
                                                value={phone}
                                                onChange={(value) => {
                                                    setPhone(value);
                                                    if (fieldErrors?.phone) {
                                                        setFieldErrors((p) => {
                                                            const n = { ...p };
                                                            delete n.phone;
                                                            return n;
                                                        });
                                                    }
                                                    if (error) setError("");
                                                }}
                                                hasError={!!fieldErrors?.phone}
                                                disabled={loadingVerify || loadingResend}
                                            />
                                        </Field>
                                    )}

                                    <Field
                                        label={t("verify.form.otp", "OTP Code")}
                                        error={fieldErrors?.otp}
                                    >
                                        <OtpInput
                                            value={otp}
                                            onChange={(v) => {
                                                setOtp(v);

                                                if (fieldErrors?.otp) {
                                                    setFieldErrors((p) => {
                                                        const n = { ...p };
                                                        delete n.otp;
                                                        return n;
                                                    });
                                                }

                                                if (error) setError("");
                                            }}
                                            length={6}
                                            hasError={!!fieldErrors?.otp}
                                            disabled={loadingVerify || loadingResend}
                                            t={t}
                                        />
                                    </Field>

                                    <PrimaryButton
                                        loading={loadingVerify}
                                        loadingText={t(
                                            "verify.buttons.pleaseWait",
                                            "Please wait..."
                                        )}
                                    >
                                        {t("verify.buttons.verifyOtp", "Verify OTP")}
                                    </PrimaryButton>

                                    <SecondaryButton
                                        loading={loadingResend}
                                        onClick={resendOtp}
                                        loadingText={t(
                                            "verify.buttons.pleaseWait",
                                            "Please wait..."
                                        )}
                                    >
                                        <RotateCw size={16} />
                                        {t("verify.buttons.resendOtp", "Resend OTP")}
                                    </SecondaryButton>

                                    <div className="rounded-2xl bg-orange-50 px-4 py-4 text-center text-sm text-neutral-600">
                                        {t("verify.links.goTo", "Go to")}{" "}
                                        <Link
                                            href={`/${locale}/auth/login`}
                                            className="font-bold text-[#1a4b8f] hover:underline"
                                        >
                                            {t("verify.links.login", "Login")}
                                        </Link>{" "}
                                        {t("verify.links.or", "or")}{" "}
                                        <Link
                                            href={`/${locale}/auth/signup`}
                                            className="font-bold text-[#1a4b8f] hover:underline"
                                        >
                                            {t("verify.links.signup", "Signup")}
                                        </Link>
                                    </div>

                                    <div className="pt-1 text-center text-[11px] leading-5 text-neutral-500">
                                        {t("verify.links.needHelp", "Need help?")}{" "}
                                        <Link
                                            href={`/${locale}/contact`}
                                            className="font-semibold text-[#1a4b8f] underline"
                                        >
                                            {t(
                                                "verify.links.contactSupport",
                                                "Contact support"
                                            )}
                                        </Link>
                                        .
                                    </div>
                                </form>
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
                <p className="mt-1 text-sm leading-6 text-white/70">{text}</p>
            </div>
        </div>
    );
}