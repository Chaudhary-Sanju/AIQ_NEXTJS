"use client";

import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { User, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";

import { setUser } from "@/store/userSlice";
import http from "@/http";
import { inStorage } from "@/lib";
import { setInForm } from "@/lib/index";

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
        <div className="rounded-xl border border-red-300/60 bg-red-500/15 px-4 py-3 text-sm text-red-100">
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
    type,
    name,
    id,
    value,
    onChange,
    placeholder,
    autoComplete,
    required = true,
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
                className={[
                    "h-11 w-full rounded-xl border bg-white/5 pl-10 pr-3 text-sm text-white placeholder:text-white/55 outline-none backdrop-blur-md focus:ring-2",
                    hasError
                        ? "border-red-300/60 focus:border-red-200 focus:ring-red-300/20"
                        : "border-white/15 focus:border-white/35 focus:ring-white/10",
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
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70">
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
            className="h-11 w-full rounded-xl bg-white text-sm font-semibold text-[#2b2458] shadow-[0_18px_50px_rgba(0,0,0,0.35)] transition hover:bg-white/90 active:bg-white/85 disabled:cursor-not-allowed disabled:opacity-60"
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
            const payload = {
                identifier: form.identifier.trim().toLowerCase(),
                password: form.password,
            };

            const { data } = await http.post("frontend/auth/login", payload);

            dispatch(setUser(data.user));
            inStorage("hkmandu", data.token, remember);

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
        <section className="w-full z-0">
            <div className="relative w-full overflow-hidden bg-gradient-to-b from-[#1b1741] via-[#2a2b68] to-[#2b2458]">
                <Glow />

                <div className="relative mx-auto flex w-full max-w-7xl items-start justify-center px-4 py-12 lg:min-h-screen lg:items-center lg:py-0">
                    <div className="mx-auto grid w-full max-w-4xl overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-xl md:grid-cols-2">
                        <div className="relative hidden md:block">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#5f57ff]/35 via-transparent to-[#2a2b68]/40" />
                            <div className="relative flex h-full flex-col justify-between p-10">
                                <div>
                                    <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white/85">
                                        <ShieldCheck size={16} />
                                        {t("login.secureTag", "Secure Login")}
                                    </div>

                                    <h1 className="mt-6 text-4xl font-semibold tracking-wide text-white">
                                        {t("login.welcomeTitle", "Welcome back")}
                                    </h1>

                                    <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/75">
                                        {t(
                                            "login.welcomeDesc",
                                            "Sign in to access your account, manage orders, and explore Perfect Services."
                                        )}
                                    </p>
                                </div>

                                <div className="text-xs text-white/65">
                                    {t(
                                        "login.tip",
                                        "Tip: Use “Remember me” only on your personal device."
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 md:p-10">
                            <div className="text-center md:hidden">
                                <h1 className="text-3xl font-semibold tracking-wide text-white">
                                    {t("login.title", "Login")}
                                </h1>
                                <p className="mt-2 text-sm text-white/75">
                                    {t(
                                        "login.subtitle",
                                        "Enter your email or phone and password to continue"
                                    )}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="mt-6 space-y-5 md:mt-0">
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
                                        onToggleVisibility={() => setPasswordVisible((s) => !s)}
                                        placeholder={t("login.passwordPlaceholder", "Enter your password")}
                                        hasError={!!fieldErrors?.password}
                                        t={t}
                                    />

                                    <div className="mt-2 flex items-center justify-between">
                                        <label className="flex items-center gap-2 text-xs text-white/80">
                                            <input
                                                type="checkbox"
                                                checked={remember}
                                                onChange={(e) => setRemember(e.target.checked)}
                                                className="h-4 w-4 rounded border-white/40 bg-transparent"
                                            />
                                            {t("login.remember", "Remember me")}
                                        </label>


                                        <Link
                                            href={`/${locale}/auth/forgot-password`}
                                            className="text-xs text-white/75 hover:text-white hover:underline"
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

                                <div className="text-center text-sm text-white/85">
                                    {t("login.noAccount", "Don't have an account?")}{" "}
                                    <Link
                                        href={`/${locale}/auth/signup`}
                                        className="font-semibold text-cyan-200 hover:text-cyan-100 hover:underline"
                                    >
                                        {t("login.register", "Register")}
                                    </Link>
                                </div>

                                <div className="pt-2 text-center text-[11px] text-white/55">
                                    {t("login.agreePrefix", "By signing in, you agree to our")}{" "}
                                    <Link href={`/${locale}/terms`} className="underline hover:text-white">
                                        {t("login.terms", "Terms")}
                                    </Link>{" "}
                                    {t("login.and", "and")}{" "}
                                    <Link href={`/${locale}/privacy`} className="underline hover:text-white">
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