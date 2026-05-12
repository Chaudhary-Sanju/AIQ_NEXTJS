"use client";

import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
    User,
    Lock,
    Eye,
    EyeOff,
    ShieldCheck,
    Sparkles,
    CheckCircle2,
} from "lucide-react";

import { setUser } from "@/store/userSlice";
import http from "@/http";
import { inStorage } from "@/lib";
import { clearGuestCartStorage } from "@/contexts/CartContext";
import { setInForm } from "@/lib/index";

const Glow = () => (
    <>
        <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl" />
    </>
);

function ErrorAlert({ message }) {
    if (!message) return null;

    return (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
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
    type,
    name,
    id,
    value,
    onChange,
    onBlur,
    placeholder,
    autoComplete,
    required = true,
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
                onBlur={onBlur}
                autoComplete={autoComplete}
                placeholder={placeholder}
                className={[
                    "h-12 w-full rounded-2xl border bg-white pl-12 pr-4 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-[#1a4b8f] focus:ring-4 focus:ring-[#1a4b8f]/10",
                    hasError ? "border-red-300" : "border-orange-100",
                ].join(" ")}
            />
        </div>
    );
}

function PasswordInput({
    value,
    onChange,
    isVisible,
    onToggleVisibility,
    placeholder,
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
                name="password"
                id="password"
                required
                value={value}
                onChange={onChange}
                autoComplete="current-password"
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
                        ? t("login.aria.hidePassword", "Hide password")
                        : t("login.aria.showPassword", "Show password")
                }
            >
                {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
        </div>
    );
}

function SubmitButton({ loading, labelLoading, label }) {
    return (
        <button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-2xl bg-[#1a4b8f] text-sm font-bold text-white shadow-lg shadow-[#1a4b8f]/20 transition hover:bg-[#0f2a5e] active:bg-[#0f2a5e] disabled:cursor-not-allowed disabled:opacity-60"
        >
            {loading ? labelLoading : label}
        </button>
    );
}

function extractFieldErrors(err) {
    const msg = err?.response?.data?.message;
    if (msg && typeof msg === "object" && !Array.isArray(msg)) return msg;
    return null;
}

function extractErrorText(err, fallback) {
    const data = err?.response?.data;
    const msg = data?.message || data?.success || err?.message || fallback;

    if (typeof msg === "string") return msg;

    if (msg && typeof msg === "object") {
        return Object.values(msg)
            .flatMap((v) => (Array.isArray(v) ? v : [v]))
            .filter((v) => typeof v === "string")
            .join("\n");
    }

    return fallback;
}

function normalizeIdentifier(value) {
    const raw = value.trim();

    if (!raw) return raw;

    // If it looks like an email, leave it untouched
    if (raw.includes("@")) {
        return raw.toLowerCase();
    }

    const digits = raw.replace(/\D/g, "");

    // Nepal local number -> +977XXXXXXXXXX
    if (digits.length === 10) {
        return `+977-${digits}`;
    }

    // Hong Kong local number -> +852XXXXXXXX
    if (digits.length === 8) {
        return `+852-${digits}`;
    }

    // Already entered with country code
    if (digits.startsWith("977") && digits.length === 13) {
        return `+977-${digits.slice(3)}`;
    }

    if (digits.startsWith("852") && digits.length === 11) {
        return `+852-${digits.slice(3)}`;
    }

    return raw;
}

function handleIdentifierBlur(value, setForm) {
    const formatted = normalizeIdentifier(value);

    setForm((prev) => ({
        ...prev,
        identifier: formatted,
    }));
}

export default function Login({ locale = "en", dict = {} }) {
    const [form, setForm] = useState({ identifier: "", password: "" });
    const [remember, setRemember] = useState(false);
    const [loading, setLoading] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});

    const dispatch = useDispatch();
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

    const validateForm = () => {
        const errors = {};

        if (!form.identifier?.trim()) {
            errors.identifier = t(
                "login.validation.identifierRequired",
                "Email or phone is required."
            );
        }

        if (!form.password?.trim()) {
            errors.password = t(
                "login.validation.passwordRequired",
                "Password is required."
            );
        }

        return errors;
    };

    const handleSubmit = async (ev) => {
        ev.preventDefault();

        setLoading(true);
        setError("");
        setFieldErrors({});

        const clientErrors = validateForm();

        if (Object.keys(clientErrors).length) {
            setFieldErrors(clientErrors);
            setError(t("login.errorFixFields", "Please fix the highlighted fields."));
            setLoading(false);
            return;
        }

        try {
            const normalizedIdentifier = normalizeIdentifier(form.identifier);

            const payload = {
                identifier: normalizedIdentifier,
                password: form.password,
            };

            const { data } = await http.post("frontend/auth/login", payload);

            dispatch(setUser(data.user));
            inStorage("hkmandu", data.token, remember);
            clearGuestCartStorage();
            window.dispatchEvent(new Event("hkmandu-auth-changed"));

            router.replace(safeNext || `/${locale}/dashboard`);
            router.refresh();
        } catch (err) {
            const fe = extractFieldErrors(err);

            if (fe) {
                setFieldErrors(fe);
                setError(t("login.errorFixFields", "Please fix the highlighted fields."));
            } else {
                setError(
                    extractErrorText(
                        err,
                        t("login.errorDefault", "Login failed. Please try again.")
                    )
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (ev) => {
        setInForm(ev, form, setForm);

        const key = ev.target.name;

        setFieldErrors((prev) => {
            if (!prev?.[key]) return prev;

            const next = { ...prev };
            delete next[key];
            return next;
        });

        if (error) setError("");
    };

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
                                    {t("login.secureTag", "Secure Login")}
                                </span>

                                <h1 className="mt-6 text-4xl font-bold leading-tight">
                                    {t("login.welcomeTitle", "Welcome back")}
                                </h1>

                                <p className="mt-4 max-w-md text-sm leading-7 text-white/75">
                                    {t(
                                        "login.welcomeDesc",
                                        "Sign in to access your account, manage orders, and explore R Services."
                                    )}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <InfoPoint
                                    icon={<CheckCircle2 className="h-5 w-5" />}
                                    title={t("login.point1Title", "Manage your orders")}
                                    text={t(
                                        "login.point1Text",
                                        "Track your product orders and courier requests from your dashboard."
                                    )}
                                />

                                <InfoPoint
                                    icon={<Sparkles className="h-5 w-5" />}
                                    title={t("login.point2Title", "Access HkMandu services")}
                                    text={t(
                                        "login.point2Text",
                                        "Shop products, request services, and manage your profile in one place."
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="p-5 sm:p-8 lg:p-10">
                        <div className="mx-auto w-full max-w-md">
                            <div className="mb-8">
                                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#1a4b8f]">
                                    <ShieldCheck className="h-4 w-4" />
                                    {t("login.secureTag", "Secure Login")}
                                </div>

                                <h1 className="text-3xl font-bold tracking-tight text-neutral-950">
                                    {t("login.title", "Login")}
                                </h1>

                                <p className="mt-2 text-sm leading-6 text-neutral-500">
                                    {t(
                                        "login.subtitle",
                                        "Enter your email or phone and password to continue."
                                    )}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {error && <ErrorAlert message={error} />}

                                <Field
                                    label={t("login.identifierLabel", "Email or Phone")}
                                    error={fieldErrors?.identifier}
                                >
                                    <TextInput
                                        icon={User}
                                        type="text"
                                        name="identifier"
                                        id="identifier"
                                        value={form.identifier}
                                        onChange={handleInputChange}
                                        onBlur={(e) => handleIdentifierBlur(e.target.value, setForm)}
                                        placeholder={t(
                                            "login.identifierPlaceholder",
                                            "Enter your email or phone"
                                        )}
                                        autoComplete="username"
                                        hasError={!!fieldErrors?.identifier}
                                    />
                                </Field>

                                <Field
                                    label={t("login.passwordLabel", "Password")}
                                    error={fieldErrors?.password}
                                >
                                    <PasswordInput
                                        value={form.password}
                                        onChange={handleInputChange}
                                        isVisible={passwordVisible}
                                        onToggleVisibility={() =>
                                            setPasswordVisible((s) => !s)
                                        }
                                        placeholder={t(
                                            "login.passwordPlaceholder",
                                            "Enter your password"
                                        )}
                                        hasError={!!fieldErrors?.password}
                                        t={t}
                                    />

                                    <div className="mt-3 flex items-center justify-between gap-3">
                                        <label className="flex items-center gap-2 text-xs font-medium text-neutral-600">
                                            <input
                                                type="checkbox"
                                                checked={remember}
                                                onChange={(e) => setRemember(e.target.checked)}
                                                className="h-4 w-4 rounded border-orange-200 accent-[#1a4b8f]"
                                            />
                                            {t("login.remember", "Remember me")}
                                        </label>

                                        <Link
                                            href={`/${locale}/auth/forgot-password`}
                                            className="text-xs font-semibold text-[#1a4b8f] hover:underline"
                                        >
                                            {t("login.forgot", "Forgot password?")}
                                        </Link>
                                    </div>
                                </Field>

                                <SubmitButton
                                    loading={loading}
                                    label={t("login.submit", "Sign in")}
                                    labelLoading={t("login.loading", "Signing in...")}
                                />

                                <div className="rounded-2xl bg-orange-50 px-4 py-4 text-center text-sm text-neutral-600">
                                    {t("login.noAccount", "Don't have an account?")}{" "}
                                    <Link
                                        href={`/${locale}/auth/signup`}
                                        className="font-bold text-[#1a4b8f] hover:underline"
                                    >
                                        {t("login.register", "Register")}
                                    </Link>
                                </div>

                                <div className="pt-1 text-center text-[11px] leading-5 text-neutral-500">
                                    {t("login.agreePrefix", "By signing in, you agree to our")}{" "}
                                    <Link
                                        href={`/${locale}/terms`}
                                        className="font-semibold text-[#1a4b8f] underline"
                                    >
                                        {t("login.terms", "Terms")}
                                    </Link>{" "}
                                    {t("login.and", "and")}{" "}
                                    <Link
                                        href={`/${locale}/privacy-policy`}
                                        className="font-semibold text-[#1a4b8f] underline"
                                    >
                                        {t("login.privacy", "Privacy Policy")}
                                    </Link>
                                    .
                                </div>
                            </form>
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