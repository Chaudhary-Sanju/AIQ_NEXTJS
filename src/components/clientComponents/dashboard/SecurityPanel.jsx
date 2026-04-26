"use client";

import React, { useMemo, useState } from "react";
import http from "@/http";
import { tGet } from "./utils";

const PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

export default function SecurityPanel({ dict }) {
    const T = useMemo(
        () => ({
            title: tGet(dict, "dashboard.security.title", "Security"),
            subtitle: tGet(dict, "dashboard.security.subtitle", "Update your password and keep your account secure."),
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
            tip3: tGet(dict, "dashboard.security.tip3", "Include number and special character (@$!%*?&)."),
            errors: {
                oldRequired: "Old password is required.",
                newRequired: "New password is required.",
                confirmRequired: "Confirm password is required.",
                invalidPassword: "Password must be 8+ chars with uppercase, lowercase, number, and special character (@$!%*?&).",
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
            <label className="mb-2 block text-sm font-medium text-gray-700">
                {label}
            </label>

            <div
                className={[
                    "flex w-full items-center gap-2 rounded-xl border px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500",
                    fieldErr[name]
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300 bg-white",
                ].join(" ")}
            >
                <input
                    type={visible[showKey] ? "text" : "password"}
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="w-full bg-transparent text-gray-900 outline-none"
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
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                    {visible[showKey] ? T.hide : T.show}
                </button>
            </div>

            {fieldErr[name] && (
                <p className="mt-1 text-sm text-red-600">{fieldErr[name]}</p>
            )}
        </div>
    );

    return (
        <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">{T.title}</h2>
            <p className="mt-1 text-gray-600">{T.subtitle}</p>

            {generalErr && (
                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
                    {generalErr}
                </div>
            )}

            {successMsg && (
                <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
                    {successMsg}
                </div>
            )}

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="lg:col-span-7">
                    <div className="rounded-2xl border border-gray-200 p-5">
                        <h3 className="text-lg font-semibold text-gray-900">
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
                                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {loading && (
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    )}
                                    {loading ? T.saving : T.save}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="lg:col-span-5">
                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                        <h3 className="text-base font-semibold text-gray-900">
                            {T.tipsTitle}
                        </h3>

                        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700">
                            <li>{T.tip1}</li>
                            <li>{T.tip2}</li>
                            <li>{T.tip3}</li>
                        </ul>

                        <p className="mt-4 rounded-xl bg-white p-3 text-xs text-gray-600">
                            Example: <strong>Test@12345</strong>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}