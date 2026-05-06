"use client";

import React, { useMemo, useState } from "react";
import {
    AlertCircle,
    BadgeCheck,
    Eye,
    EyeOff,
    KeyRound,
    Loader2,
    LockKeyhole,
    ShieldCheck,
} from "lucide-react";
import http from "@/http";
import { tGet } from "./utils";

const PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

export default function SecurityPanel({ dict }) {
    const T = useMemo(
        () => ({
            title: tGet(dict, "dashboard.security.title", "Security"),
            subtitle: tGet(
                dict,
                "dashboard.security.subtitle",
                "Update your password and keep your account secure."
            ),
            changePassword: tGet(dict, "dashboard.security.changePassword", "Change Password"),
            oldPassword: tGet(dict, "dashboard.security.oldPassword", "Old Password"),
            newPassword: tGet(dict, "dashboard.security.newPassword", "New Password"),
            confirmPassword: tGet(dict, "dashboard.security.confirmPassword", "Confirm New Password"),
            show: tGet(dict, "dashboard.security.show", "Show"),
            hide: tGet(dict, "dashboard.security.hide", "Hide"),
            save: tGet(dict, "dashboard.security.save", "Update Password"),
            saving: tGet(dict, "dashboard.security.saving", "Updating..."),
            success: tGet(dict, "dashboard.security.success", "Password updated."),
            errorGeneric: tGet(dict, "common.error", "Something went wrong."),
            tipsTitle: tGet(dict, "dashboard.security.tipsTitle", "Password rule"),
            tip1: tGet(dict, "dashboard.security.tip1", "Use at least 8 characters."),
            tip2: tGet(dict, "dashboard.security.tip2", "Include uppercase and lowercase letters."),
            tip3: tGet(
                dict,
                "dashboard.security.tip3",
                "Include number and special character (@$!%*?&)."
            ),
            errors: {
                oldRequired: "Old password is required.",
                newRequired: "New password is required.",
                confirmRequired: "Confirm password is required.",
                invalidPassword:
                    "Password must be 8+ chars with uppercase, lowercase, number, and special character (@$!%*?&).",
                mismatch: "Passwords do not match.",
            },
        }),
        [dict]
    );

    const [form, setForm] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [visible, setVisible] = useState({
        old: false,
        next: false,
        confirm: false,
    });

    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [generalErr, setGeneralErr] = useState("");
    const [fieldErr, setFieldErr] = useState({});

    const onChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({ ...prev, [name]: value }));
        setFieldErr((prev) => ({ ...prev, [name]: "" }));
        setGeneralErr("");
        setSuccessMsg("");
    };

    const validate = () => {
        const errors = {};

        if (!form.oldPassword.trim()) errors.oldPassword = T.errors.oldRequired;

        if (!form.newPassword.trim()) {
            errors.newPassword = T.errors.newRequired;
        } else if (!PASSWORD_REGEX.test(form.newPassword)) {
            errors.newPassword = T.errors.invalidPassword;
        }

        if (!form.confirmPassword.trim()) {
            errors.confirmPassword = T.errors.confirmRequired;
        }

        if (
            form.newPassword &&
            form.confirmPassword &&
            form.newPassword !== form.confirmPassword
        ) {
            errors.confirmPassword = T.errors.mismatch;
        }

        setFieldErr(errors);
        return Object.keys(errors).length === 0;
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;
        if (!validate()) return;

        setLoading(true);
        setGeneralErr("");
        setSuccessMsg("");

        try {
            await http.put("/frontend/profile/password", {
                oldPassword: form.oldPassword,
                newPassword: form.newPassword,
                confirmPassword: form.confirmPassword,
            });

            setSuccessMsg(T.success);

            setForm({
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (err) {
            setGeneralErr(err?.response?.data?.message || T.errorGeneric);
        } finally {
            setLoading(false);
        }
    };

    const renderPasswordInput = ({ label, name, value, showKey }) => (
        <div>
            <label className="mb-2 block text-sm font-semibold text-neutral-800">
                {label}
            </label>

            <div
                className={[
                    "flex h-12 w-full items-center gap-2 rounded-2xl border bg-white px-4 transition focus-within:border-[#1a4b8f] focus-within:ring-4 focus-within:ring-[#1a4b8f]/10",
                    fieldErr[name] ? "border-red-300 bg-red-50" : "border-orange-100",
                ].join(" ")}
            >
                <LockKeyhole className="h-5 w-5 shrink-0 text-neutral-400" />

                <input
                    type={visible[showKey] ? "text" : "password"}
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="w-full bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
                    placeholder="••••••••"
                    autoComplete="new-password"
                />

                <button
                    type="button"
                    onClick={() =>
                        setVisible((prev) => ({
                            ...prev,
                            [showKey]: !prev[showKey],
                        }))
                    }
                    className="rounded-xl p-2 text-neutral-500 transition hover:bg-orange-50 hover:text-[#1a4b8f]"
                    aria-label={visible[showKey] ? T.hide : T.show}
                >
                    {visible[showKey] ? (
                        <EyeOff className="h-4 w-4" />
                    ) : (
                        <Eye className="h-4 w-4" />
                    )}
                </button>
            </div>

            {fieldErr[name] && (
                <p className="mt-2 text-sm text-red-600">{fieldErr[name]}</p>
            )}
        </div>
    );

    return (
        <section className="overflow-hidden rounded-[28px] border border-orange-100 bg-white/95 shadow-[0_18px_45px_rgba(15,42,94,0.08)] backdrop-blur">
            <div className="border-b border-orange-100 bg-gradient-to-br from-white to-orange-50/60 px-5 py-6 sm:px-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#1a4b8f]">
                            <ShieldCheck className="h-4 w-4" />
                            Account Security
                        </div>

                        <h2 className="text-2xl font-bold tracking-tight text-neutral-950">
                            {T.title}
                        </h2>

                        <p className="mt-1 text-sm leading-6 text-neutral-500">
                            {T.subtitle}
                        </p>
                    </div>

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1a4b8f]/10 text-[#1a4b8f]">
                        <KeyRound className="h-6 w-6" />
                    </div>
                </div>
            </div>

            <div className="p-5 sm:p-6">
                {generalErr && (
                    <AlertBox type="error" icon={<AlertCircle className="h-5 w-5" />} text={generalErr} />
                )}

                {successMsg && (
                    <AlertBox type="success" icon={<BadgeCheck className="h-5 w-5" />} text={successMsg} />
                )}

                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
                    <div className="lg:col-span-7">
                        <div className="rounded-[24px] border border-orange-100 bg-white p-5 shadow-sm">
                            <h3 className="text-lg font-bold text-neutral-950">
                                {T.changePassword}
                            </h3>

                            <form onSubmit={onSubmit} className="mt-5 space-y-5">
                                {renderPasswordInput({
                                    label: T.oldPassword,
                                    name: "oldPassword",
                                    value: form.oldPassword,
                                    showKey: "old",
                                })}

                                {renderPasswordInput({
                                    label: T.newPassword,
                                    name: "newPassword",
                                    value: form.newPassword,
                                    showKey: "next",
                                })}

                                {renderPasswordInput({
                                    label: T.confirmPassword,
                                    name: "confirmPassword",
                                    value: form.confirmPassword,
                                    showKey: "confirm",
                                })}

                                <div className="flex justify-end pt-1">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#1a4b8f] px-6 text-sm font-bold text-white shadow-lg shadow-[#1a4b8f]/20 transition hover:bg-[#0f2a5e] disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                {T.saving}
                                            </>
                                        ) : (
                                            <>
                                                <ShieldCheck className="h-4 w-4" />
                                                {T.save}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="lg:col-span-5">
                        <div className="rounded-[24px] border border-orange-100 bg-gradient-to-br from-orange-50 to-blue-50 p-5">
                            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#1a4b8f] shadow-sm">
                                <BadgeCheck className="h-5 w-5" />
                            </div>

                            <h3 className="text-base font-bold text-neutral-950">
                                {T.tipsTitle}
                            </h3>

                            <ul className="mt-4 space-y-3 text-sm leading-6 text-neutral-700">
                                <li className="flex gap-2">
                                    <BadgeCheck className="mt-1 h-4 w-4 shrink-0 text-[#1a4b8f]" />
                                    <span>{T.tip1}</span>
                                </li>
                                <li className="flex gap-2">
                                    <BadgeCheck className="mt-1 h-4 w-4 shrink-0 text-[#1a4b8f]" />
                                    <span>{T.tip2}</span>
                                </li>
                                <li className="flex gap-2">
                                    <BadgeCheck className="mt-1 h-4 w-4 shrink-0 text-[#1a4b8f]" />
                                    <span>{T.tip3}</span>
                                </li>
                            </ul>

                            <p className="mt-5 rounded-2xl bg-white p-4 text-xs leading-5 text-neutral-600 shadow-sm">
                                Example: <strong className="text-neutral-950">Test@12345</strong>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function AlertBox({ type, icon, text }) {
    const isError = type === "error";

    return (
        <div
            className={[
                "mb-4 flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm font-medium",
                isError
                    ? "border-red-200 bg-red-50 text-red-700"
                    : "border-green-200 bg-green-50 text-green-700",
            ].join(" ")}
        >
            <span className="mt-0.5">{icon}</span>
            <span>{text}</span>
        </div>
    );
}