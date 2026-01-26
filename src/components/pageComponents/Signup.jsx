"use client";

import { useMemo, useState } from "react";
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
    KeyRound,
    RotateCw,
} from "lucide-react";

import http from "@/http";
import { setInForm } from "@/lib/index";

/* ---------------------------------- */
/* Backend Error Handling */
/* validateBody returns: { message: { field: "msg" } } with 422 */
/* ---------------------------------- */
function extractFieldErrors(err) {
    const msg = err?.response?.data?.message;
    if (msg && typeof msg === "object" && !Array.isArray(msg)) return msg;
    return null;
}

function extractErrorText(err) {
    const data = err?.response?.data;
    const msg = data?.message ?? data ?? err?.message ?? "Something went wrong.";

    if (typeof msg === "string") return msg;

    if (msg && typeof msg === "object") {
        return Object.values(msg)
            .flatMap((v) => (Array.isArray(v) ? v : [v]))
            .filter((v) => typeof v === "string")
            .join("\n");
    }

    return "Something went wrong.";
}

/* ---------------------------------- */
/* Client-side validation */
/* ---------------------------------- */
const PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const PHONE_REGEX =
    /^((\+977-?\d{10})|(\d{10})|(\+852-?[569]\d{7})|([569]\d{7}))$/;

function validateRegisterForm(form, t) {
    const errors = {};

    if (!form.name || form.name.trim().length < 2) {
        errors.name = t("signup.validation.nameMin", "Name must be at least 2 characters.");
    }

    if (!form.email) errors.email = t("signup.validation.emailRequired", "Email is required.");

    if (!form.password || !PASSWORD_REGEX.test(form.password)) {
        errors.password = t(
            "signup.validation.passwordRule",
            "Password must be 8+ chars and include uppercase, lowercase, number, and special character."
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
        errors.address = t("signup.validation.addressRequired", "Address is required.");
    }

    return errors;
}

/* ---------------------------------- */
/* UI Components */
/* ---------------------------------- */
const Glow = () => (
    <>
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#5f57ff]/25 blur-[90px]" />
        <div className="pointer-events-none absolute bottom-[-260px] right-[-220px] h-[520px] w-[520px] rounded-full bg-[#2a2b68]/40 blur-[90px]" />
        <div className="pointer-events-none absolute bottom-[-260px] left-[-220px] h-[520px] w-[520px] rounded-full bg-[#2b2458]/40 blur-[90px]" />
    </>
);

function ErrorAlert({ message }) {
    if (!message) return null;
    return (
        <div className="whitespace-pre-line rounded-xl border border-red-300/60 bg-red-500/15 px-4 py-3 text-sm text-red-100">
            {message}
        </div>
    );
}

function SuccessAlert({ message }) {
    if (!message) return null;
    return (
        <div className="rounded-xl border border-emerald-300/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
            {message}
        </div>
    );
}

function Field({ label, children, error }) {
    return (
        <div className="space-y-2">
            <div className="text-xs font-medium tracking-wide text-white/80">{label}</div>
            {children}
            {!!error && <p className="text-xs text-red-200">{error}</p>}
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
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70">
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
                    "h-11 w-full rounded-xl border bg-white/5 pl-10 pr-3 text-sm text-white placeholder:text-white/55 outline-none backdrop-blur-md focus:ring-2",
                    hasError
                        ? "border-red-300/60 focus:border-red-200 focus:ring-red-300/20"
                        : "border-white/15 focus:border-white/35 focus:ring-white/10",
                    "disabled:opacity-60",
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
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70">
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
                    "h-11 w-full rounded-xl border bg-white/5 pl-10 pr-10 text-sm text-white placeholder:text-white/55 outline-none backdrop-blur-md focus:ring-2",
                    hasError
                        ? "border-red-300/60 focus:border-red-200 focus:ring-red-300/20"
                        : "border-white/15 focus:border-white/35 focus:ring-white/10",
                ].join(" ")}
            />

            <button
                type="button"
                onClick={onToggleVisibility}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-white/70 hover:text-white"
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
            className="h-11 w-full rounded-xl bg-white text-sm font-semibold text-[#2b2458] shadow-[0_18px_50px_rgba(0,0,0,0.35)] transition hover:bg-white/90 active:bg-white/85 disabled:cursor-not-allowed disabled:opacity-60"
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
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 text-sm font-medium text-white/90 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
        >
            {loading ? loadingText : children}
        </button>
    );
}

function OtpInput({
    value,
    onChange, // gets full otp string
    length = 6,
    disabled = false,
    hasError = false,
    t,
}) {
    const digits = useMemo(() => {
        const v = (value || "").replace(/\D/g, "").slice(0, length);
        return Array.from({ length }, (_, i) => v[i] || "");
    }, [value, length]);

    const refs = useMemo(() => Array.from({ length }, () => null), [length]);

    const commit = (nextDigits, focusIdx) => {
        onChange(nextDigits.join(""));
        if (typeof focusIdx === "number") refs[focusIdx]?.focus?.();
    };

    const setAt = (idx, raw) => {
        const clean = (raw || "").replace(/\D/g, "");
        const next = [...digits];

        if (!clean) {
            next[idx] = "";
            commit(next);
            return;
        }

        // support typing/pasting multiple digits
        const chunk = clean.slice(0, length - idx).split("");
        for (let i = 0; i < chunk.length; i++) next[idx + i] = chunk[i];

        const focusTo = Math.min(idx + chunk.length, length - 1);
        commit(next, focusTo);
    };

    const onKeyDown = (idx, e) => {
        if (disabled) return;

        if (e.key === "Backspace") {
            e.preventDefault();

            if (digits[idx]) {
                const next = [...digits];
                next[idx] = "";
                commit(next);
            } else if (idx > 0) {
                const next = [...digits];
                next[idx - 1] = "";
                commit(next, idx - 1);
            }
        }

        if (e.key === "ArrowLeft" && idx > 0) refs[idx - 1]?.focus?.();
        if (e.key === "ArrowRight" && idx < length - 1) refs[idx + 1]?.focus?.();
    };

    const onPaste = (idx, e) => {
        if (disabled) return;
        e.preventDefault();
        const text = e.clipboardData.getData("text") || "";
        setAt(idx, text);
    };

    return (
        <div className="space-y-2">
            <div className="grid grid-cols-6 gap-2">
                {digits.map((d, idx) => (
                    <input
                        key={idx}
                        ref={(el) => (refs[idx] = el)}
                        value={d}
                        onChange={(e) => {
                            setAt(idx, e.target.value);
                            if (e.target.value && idx < length - 1) refs[idx + 1]?.focus?.();
                        }}
                        onKeyDown={(e) => onKeyDown(idx, e)}
                        onPaste={(e) => onPaste(idx, e)}
                        inputMode="numeric"
                        autoComplete={idx === 0 ? "one-time-code" : "off"}
                        disabled={disabled}
                        aria-label={
                            t ? t("signup.otp.digitAria", `OTP digit ${idx + 1}`) : `OTP digit ${idx + 1}`
                        }
                        className={[
                            "h-11 w-full rounded-xl border bg-white/5 text-center text-sm text-white placeholder:text-white/55 outline-none backdrop-blur-md focus:ring-2",
                            hasError
                                ? "border-red-300/60 focus:border-red-200 focus:ring-red-300/20"
                                : "border-white/15 focus:border-white/35 focus:ring-white/10",
                            "disabled:opacity-60",
                        ].join(" ")}
                    />
                ))}
            </div>

            <div className="flex items-center justify-between text-[11px] text-white/55">
                <span>{t ? t("signup.otp.helper", "Enter the 6-digit code") : "Enter the 6-digit code"}</span>
                <button
                    type="button"
                    disabled={disabled || !value}
                    onClick={() => onChange("")}
                    className="underline hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
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

    const [step, setStep] = useState("register"); // "register" | "otp"
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        password: "",
        confirm_password: "",
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

    /* ---------- REGISTER ---------- */
    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setFieldErrors({});

        const clientErrors = validateRegisterForm(form, t);
        if (Object.keys(clientErrors).length) {
            setFieldErrors(clientErrors);
            setError(t("signup.errors.fixFields", "Please fix the highlighted fields."));
            return;
        }

        setLoadingRegister(true);

        try {
            const res = await http.post("frontend/auth/register-new-user", form);

            if (res?.status === 201) {
                setSuccess(
                    res?.data?.message ||
                    t(
                        "signup.success.register",
                        "Registration successful! OTP has been sent to your email."
                    )
                );
                setStep("otp");
            } else {
                setError(
                    res?.data?.message ||
                    t("signup.errors.unexpected", "Unexpected response from server. Please try again.")
                );
            }
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

    /* ---------- VERIFY OTP ---------- */
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setFieldErrors({});

        setLoadingVerify(true);

        try {
            await http.post("frontend/auth/verify-otp", { email: form.email, otp });

            setSuccess(t("signup.success.otpVerified", "OTP verified successfully! Redirecting to login..."));
            setTimeout(() => {
                router.replace(safeNext || `/${locale}/auth/login`);
                router.refresh();
            }, 800);
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

    /* ---------- RESEND OTP ---------- */
    const handleResendOtp = async () => {
        setError("");
        setSuccess("");
        setFieldErrors({});

        setLoadingResend(true);

        try {
            await http.post("frontend/auth/resend-otp", { email: form.email });
            setSuccess(t("signup.success.otpResent", "OTP resent successfully. Please check your email."));
        } catch (err) {
            const fe = extractFieldErrors(err);
            if (fe) {
                setFieldErrors(fe);
                setError(t("signup.errors.otpResendFail", "Unable to resend OTP. Please check your email."));
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

    return (
        <section className="w-full z-0">
            <div className="relative w-full overflow-hidden bg-gradient-to-b from-[#1b1741] via-[#2a2b68] to-[#2b2458]">
                <Glow />

                <div className="relative mx-auto flex w-full max-w-7xl items-start justify-center px-4 py-12 lg:min-h-screen lg:items-center lg:py-0">
                    <div className="mx-auto grid w-full max-w-4xl overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-xl md:grid-cols-2">
                        {/* Left brand panel */}
                        <div className="relative hidden md:block">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#5f57ff]/35 via-transparent to-[#2a2b68]/40" />
                            <div className="relative flex h-full flex-col justify-between p-10">
                                <div>
                                    <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white/85">
                                        <ShieldCheck size={16} />
                                        {step === "register"
                                            ? t("signup.left.tagCreate", "Create Account")
                                            : t("signup.left.tagOtp", "Verify OTP")}
                                    </div>

                                    <h1 className="mt-6 text-4xl font-semibold tracking-wide text-white">
                                        {step === "register"
                                            ? t("signup.left.titleCreate", "Join Yalakhom")
                                            : t("signup.left.titleOtp", "Secure Verification")}
                                    </h1>

                                    <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/75">
                                        {step === "register"
                                            ? t(
                                                "signup.left.descCreate",
                                                "Create your account to manage orders and access services."
                                            )
                                            : t(
                                                "signup.left.descOtp",
                                                "Enter the OTP sent to your email to activate your account."
                                            )}
                                    </p>

                                    {step === "register" && (
                                        <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/70">
                                            <div className="font-semibold text-white/85">
                                                {t("signup.left.passwordRuleTitle", "Password rule")}
                                            </div>
                                            <div className="mt-1">
                                                {t("signup.left.passwordRuleText", "8+ chars, uppercase, lowercase, number, special (@$!%*?&).")}
                                            </div>

                                            <div className="mt-3 font-semibold text-white/85">
                                                {t("signup.left.phoneRuleTitle", "Phone formats")}
                                            </div>
                                            <div className="mt-1">
                                                {t(
                                                    "signup.left.phoneRuleText",
                                                    "Nepal: +9779876543210 or +977-9876543210 or 9876543210\nHK: +85251234567 or +852-51234567 or 51234567"
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="text-xs text-white/65">
                                    {step === "register"
                                        ? t("signup.left.tipCreate", "Tip: Use a strong password and keep it private.")
                                        : t("signup.left.tipOtp", "Didn’t receive OTP? You can resend it.")}
                                </div>
                            </div>
                        </div>

                        {/* Right panel */}
                        <div className="p-6 md:p-10">
                            <div className="text-center md:hidden">
                                <h1 className="text-3xl font-semibold tracking-wide text-white">
                                    {step === "register" ? t("signup.mobile.titleCreate", "Sign up") : t("signup.mobile.titleOtp", "Verify OTP")}
                                </h1>
                                <p className="mt-2 text-sm text-white/75">
                                    {step === "register"
                                        ? t("signup.mobile.descCreate", "Fill in your details to create an account")
                                        : t("signup.mobile.descOtp", "Enter the OTP sent to your email")}
                                </p>
                            </div>

                            <div className="mt-6 space-y-4 md:mt-0">
                                <ErrorAlert message={error} />
                                <SuccessAlert message={success} />

                                {step === "register" ? (
                                    <form onSubmit={handleRegister} className="space-y-5">
                                        <Field label={t("signup.form.fullName", "Full name")} error={fieldErrors?.name}>
                                            <TextInput
                                                icon={User}
                                                type="text"
                                                name="name"
                                                id="name"
                                                value={form.name}
                                                onChange={handleInputChange}
                                                placeholder={t("signup.form.fullNamePlaceholder", "Your full name")}
                                                autoComplete="name"
                                                hasError={!!fieldErrors?.name}
                                            />
                                        </Field>

                                        <Field label={t("signup.form.email", "Email")} error={fieldErrors?.email}>
                                            <TextInput
                                                icon={Mail}
                                                type="email"
                                                name="email"
                                                id="email"
                                                value={form.email}
                                                onChange={handleInputChange}
                                                placeholder={t("signup.form.emailPlaceholder", "you@example.com")}
                                                autoComplete="email"
                                                hasError={!!fieldErrors?.email}
                                            />
                                        </Field>

                                        <div className="grid gap-5 md:grid-cols-2">
                                            <Field label={t("signup.form.phone", "Phone")} error={fieldErrors?.phone}>
                                                <TextInput
                                                    icon={Phone}
                                                    type="text"
                                                    name="phone"
                                                    id="phone"
                                                    value={form.phone}
                                                    onChange={handleInputChange}
                                                    placeholder={t("signup.form.phonePlaceholder", "+9779876543210")}
                                                    autoComplete="tel"
                                                    hasError={!!fieldErrors?.phone}
                                                />
                                            </Field>

                                            <Field label={t("signup.form.address", "Address")} error={fieldErrors?.address}>
                                                <TextInput
                                                    icon={MapPin}
                                                    type="text"
                                                    name="address"
                                                    id="address"
                                                    value={form.address}
                                                    onChange={handleInputChange}
                                                    placeholder={t("signup.form.addressPlaceholder", "City / Area")}
                                                    autoComplete="street-address"
                                                    hasError={!!fieldErrors?.address}
                                                />
                                            </Field>
                                        </div>

                                        <div className="grid gap-5 md:grid-cols-2">
                                            <Field label={t("signup.form.password", "Password")} error={fieldErrors?.password}>
                                                <PasswordInput
                                                    name="password"
                                                    id="password"
                                                    value={form.password}
                                                    onChange={handleInputChange}
                                                    isVisible={passVisible}
                                                    onToggleVisibility={() => setPassVisible((s) => !s)}
                                                    placeholder={t("signup.form.passwordPlaceholder", "Create a password")}
                                                    autoComplete="new-password"
                                                    hasError={!!fieldErrors?.password}
                                                    t={t}
                                                />
                                            </Field>

                                            <Field label={t("signup.form.confirmPassword", "Confirm password")} error={fieldErrors?.confirm_password}>
                                                <PasswordInput
                                                    name="confirm_password"
                                                    id="confirm_password"
                                                    value={form.confirm_password}
                                                    onChange={handleInputChange}
                                                    isVisible={confirmVisible}
                                                    onToggleVisibility={() => setConfirmVisible((s) => !s)}
                                                    placeholder={t("signup.form.confirmPasswordPlaceholder", "Repeat password")}
                                                    autoComplete="new-password"
                                                    hasError={!!fieldErrors?.confirm_password}
                                                    t={t}
                                                />
                                            </Field>
                                        </div>

                                        <PrimaryButton
                                            loading={loadingRegister}
                                            loadingText={t("signup.buttons.pleaseWait", "Please wait...")}
                                        >
                                            {t("signup.buttons.createAccount", "Create account")}
                                        </PrimaryButton>

                                        <div className="text-center text-sm text-white/85">
                                            {t("signup.links.alreadyHave", "Already have an account?")}{" "}
                                            <Link
                                                href={`/${locale}/auth/login`}
                                                className="font-semibold text-cyan-200 hover:text-cyan-100 hover:underline"
                                            >
                                                {t("signup.links.login", "Login")}
                                            </Link>
                                        </div>

                                        <div className="text-center text-sm text-white/85">
                                            {t("signup.links.alreadyRegister", "Already register?")}{" "}
                                            <Link
                                                href={`/${locale}/auth/verify-account`}
                                                className="font-semibold text-cyan-200 hover:text-cyan-100 hover:underline"
                                            >
                                                {t("signup.links.verifyNow", "Verify Account Now")}
                                            </Link>
                                        </div>

                                        <div className="pt-2 text-center text-[11px] text-white/55">
                                            {t("signup.footer.agreePrefix", "By creating an account, you agree to our")}{" "}
                                            <Link href={`/${locale}/terms`} className="underline hover:text-white">
                                                {t("signup.footer.terms", "Terms")}
                                            </Link>{" "}
                                            {t("signup.footer.and", "and")}{" "}
                                            <Link href={`/${locale}/privacy`} className="underline hover:text-white">
                                                {t("signup.footer.privacy", "Privacy Policy")}
                                            </Link>
                                            .
                                        </div>
                                    </form>
                                ) : (
                                    <form onSubmit={handleVerifyOtp} className="space-y-5">
                                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
                                            <div className="text-white/70">{t("signup.otp.sentTo", "OTP sent to")}</div>
                                            <div className="mt-1 font-semibold text-white">{form.email}</div>
                                        </div>

                                        <Field label={t("signup.otp.label", "OTP Code")} error={fieldErrors?.otp}>
                                            <OtpInput
                                                value={otp}
                                                onChange={(v) => {
                                                    setOtp(v);
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
                                                disabled={loadingVerify || loadingResend}
                                                hasError={!!fieldErrors?.otp}
                                                t={t}
                                            />
                                        </Field>


                                        <PrimaryButton
                                            loading={loadingVerify}
                                            loadingText={t("signup.buttons.pleaseWait", "Please wait...")}
                                        >
                                            {t("signup.buttons.verifyOtp", "Verify OTP")}
                                        </PrimaryButton>

                                        <div className="grid gap-3 md:grid-cols-2">
                                            <SecondaryButton
                                                loading={loadingResend}
                                                onClick={handleResendOtp}
                                                loadingText={t("signup.buttons.pleaseWait", "Please wait...")}
                                            >
                                                <RotateCw size={16} />
                                                {t("signup.buttons.resendOtp", "Resend OTP")}
                                            </SecondaryButton>

                                            <SecondaryButton
                                                loading={false}
                                                onClick={backToRegister}
                                                loadingText={t("signup.buttons.pleaseWait", "Please wait...")}
                                            >
                                                {t("signup.buttons.backToSignup", "Back to Signup")}
                                            </SecondaryButton>
                                        </div>

                                        <div className="text-center text-sm text-white/85">
                                            {t("signup.links.wantLogin", "Want to login?")}{" "}
                                            <Link
                                                href={`/${locale}/auth/login`}
                                                className="font-semibold text-cyan-200 hover:text-cyan-100 hover:underline"
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
