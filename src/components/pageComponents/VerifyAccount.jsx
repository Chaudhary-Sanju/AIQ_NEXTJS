"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, KeyRound, ShieldCheck, RotateCw } from "lucide-react";

import http from "@/http";

/* ---------------------------------- */
/* Backend Error Handling (matches validateBody) */
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
/* UI */
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
    name,
    id,
    value,
    onChange,
    placeholder,
    autoComplete,
    inputMode,
    maxLength,
    hasError = false,
    disabled = false,
}) {
    return (
        <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70">
                <Icon size={18} />
            </span>

            <input
                type="text"
                name={name}
                id={id}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                autoComplete={autoComplete}
                inputMode={inputMode}
                maxLength={maxLength}
                disabled={disabled}
                required
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

    const [email, setEmail] = useState(searchParams?.get("email") || "");
    const [otp, setOtp] = useState("");

    const [loadingVerify, setLoadingVerify] = useState(false);
    const [loadingResend, setLoadingResend] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});

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

    const onOtpChange = (e) => {
        setOtp(e.target.value);
        if (fieldErrors?.otp) {
            setFieldErrors((p) => {
                const n = { ...p };
                delete n.otp;
                return n;
            });
        }
        if (error) setError("");
    };

    const resendOtp = async () => {
        setError("");
        setSuccess("");
        setFieldErrors({});

        if (!email?.trim()) {
            setFieldErrors({ email: t("verify.validation.emailRequired", "Email is required.") });
            setError(t("verify.errors.enterEmail", "Please enter your email."));
            return;
        }

        setLoadingResend(true);
        try {
            const res = await http.post("frontend/auth/resend-otp", { email });
            setSuccess(
                res?.data?.message || t("verify.success.otpResent", "OTP resent successfully. Please check your email.")
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

        const local = {};
        if (!email?.trim()) local.email = t("verify.validation.emailRequired", "Email is required.");
        if (!otp?.trim()) local.otp = t("verify.validation.otpRequired", "OTP is required.");

        if (Object.keys(local).length) {
            setFieldErrors(local);
            setError(t("verify.errors.fixFields", "Please fix the highlighted fields."));
            return;
        }

        setLoadingVerify(true);
        try {
            const res = await http.post("frontend/auth/verify-otp", { email, otp });

            setSuccess(
                res?.data?.message || t("verify.success.otpVerified", "OTP verified successfully! Redirecting to login...")
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

    return (
        <section className="w-full">
            <div className="relative w-full overflow-hidden bg-gradient-to-b from-[#1b1741] via-[#2a2b68] to-[#2b2458]">
                <Glow />

                <div className="relative mx-auto flex w-full max-w-7xl items-start justify-center px-4 py-12 lg:min-h-screen lg:items-center lg:py-0">
                    <div className="mx-auto grid w-full max-w-4xl overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-xl md:grid-cols-2">
                        {/* Left panel */}
                        <div className="relative hidden md:block">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#5f57ff]/35 via-transparent to-[#2a2b68]/40" />
                            <div className="relative flex h-full flex-col justify-between p-10">
                                <div>
                                    <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white/85">
                                        <ShieldCheck size={16} />
                                        {t("verify.left.tag", "Verify Account")}
                                    </div>

                                    <h1 className="mt-6 text-4xl font-semibold tracking-wide text-white">
                                        {t("verify.left.title", "Complete verification")}
                                    </h1>

                                    <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/75">
                                        {t(
                                            "verify.left.desc",
                                            "If you registered but didn’t verify OTP, your account stays pending. Resend OTP and verify to activate it."
                                        )}
                                    </p>
                                </div>

                                <div className="text-xs text-white/65">
                                    {t("verify.left.tip", "Tip: Check spam folder if you don’t see OTP.")}
                                </div>
                            </div>
                        </div>

                        {/* Right form */}
                        <div className="p-6 md:p-10">
                            <div className="text-center md:hidden">
                                <h1 className="text-3xl font-semibold tracking-wide text-white">
                                    {t("verify.mobile.title", "Verify Account")}
                                </h1>
                                <p className="mt-2 text-sm text-white/75">
                                    {t("verify.mobile.desc", "Resend OTP and verify your account")}
                                </p>
                            </div>

                            <div className="mt-6 space-y-4 md:mt-0">
                                <ErrorAlert message={error} />
                                <SuccessAlert message={success} />

                                <form onSubmit={verifyOtp} className="space-y-5">
                                    <Field label={t("verify.form.email", "Email")} error={fieldErrors?.email}>
                                        <TextInput
                                            icon={Mail}
                                            name="email"
                                            id="email"
                                            value={email}
                                            onChange={onEmailChange}
                                            placeholder={t("verify.form.emailPlaceholder", "you@example.com")}
                                            autoComplete="email"
                                            hasError={!!fieldErrors?.email}
                                            disabled={loadingVerify || loadingResend}
                                        />
                                    </Field>

                                    <Field label={t("verify.form.otp", "OTP Code")} error={fieldErrors?.otp}>
                                        <TextInput
                                            icon={KeyRound}
                                            name="otp"
                                            id="otp"
                                            value={otp}
                                            onChange={onOtpChange}
                                            placeholder={t("verify.form.otpPlaceholder", "Enter 6-digit OTP")}
                                            inputMode="numeric"
                                            maxLength={6}
                                            autoComplete="one-time-code"
                                            hasError={!!fieldErrors?.otp}
                                            disabled={loadingVerify || loadingResend}
                                        />
                                    </Field>

                                    <PrimaryButton
                                        loading={loadingVerify}
                                        loadingText={t("verify.buttons.pleaseWait", "Please wait...")}
                                    >
                                        {t("verify.buttons.verifyOtp", "Verify OTP")}
                                    </PrimaryButton>

                                    <SecondaryButton
                                        loading={loadingResend}
                                        onClick={resendOtp}
                                        loadingText={t("verify.buttons.pleaseWait", "Please wait...")}
                                    >
                                        <RotateCw size={16} />
                                        {t("verify.buttons.resendOtp", "Resend OTP")}
                                    </SecondaryButton>

                                    <div className="text-center text-sm text-white/85">
                                        {t("verify.links.goTo", "Go to")}{" "}
                                        <Link
                                            href={`/${locale}/auth/login`}
                                            className="font-semibold text-cyan-200 hover:text-cyan-100 hover:underline"
                                        >
                                            {t("verify.links.login", "Login")}
                                        </Link>{" "}
                                        {t("verify.links.or", "or")}{" "}
                                        <Link
                                            href={`/${locale}/auth/signup`}
                                            className="font-semibold text-cyan-200 hover:text-cyan-100 hover:underline"
                                        >
                                            {t("verify.links.signup", "Signup")}
                                        </Link>
                                    </div>

                                    <div className="pt-2 text-center text-[11px] text-white/55">
                                        {t("verify.links.needHelp", "Need help?")}{" "}
                                        <Link href={`/${locale}/contact`} className="underline hover:text-white">
                                            {t("verify.links.contactSupport", "Contact support")}
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
