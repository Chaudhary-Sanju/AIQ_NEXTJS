"use client";

import React, { useMemo, useState } from "react";
import http from "@/http";
import { tGet } from "./utils";

export default function SecurityPanel({ dict }) {
    const T = useMemo(
        () => ({
            title: tGet(dict, "dashboard.security.title", "Security"),
            subtitle: tGet(dict, "dashboard.security.subtitle", "Update your password and keep your account secure."),

            changePassword: tGet(dict, "dashboard.security.changePassword", "Change Password"),
            currentPassword: tGet(dict, "dashboard.security.currentPassword", "Current Password"),
            newPassword: tGet(dict, "dashboard.security.newPassword", "New Password"),
            confirmPassword: tGet(dict, "dashboard.security.confirmPassword", "Confirm New Password"),

            show: tGet(dict, "dashboard.security.show", "Show"),
            hide: tGet(dict, "dashboard.security.hide", "Hide"),

            tipsTitle: tGet(dict, "dashboard.security.tipsTitle", "Password tips"),
            tip1: tGet(dict, "dashboard.security.tip1", "Use at least 8 characters."),
            tip2: tGet(dict, "dashboard.security.tip2", "Mix letters, numbers, and symbols."),
            tip3: tGet(dict, "dashboard.security.tip3", "Avoid using your name or phone number."),

            save: tGet(dict, "dashboard.security.save", "Update Password"),
            saving: tGet(dict, "dashboard.security.saving", "Updating..."),

            success: tGet(dict, "dashboard.security.success", "Password updated successfully."),
            errorGeneric: tGet(dict, "common.error", "Something went wrong."),

            errors: {
                currentRequired: tGet(dict, "dashboard.security.errors.currentRequired", "Current password is required."),
                newRequired: tGet(dict, "dashboard.security.errors.newRequired", "New password is required."),
                confirmRequired: tGet(dict, "dashboard.security.errors.confirmRequired", "Confirm password is required."),
                minLength: tGet(dict, "dashboard.security.errors.minLength", "New password must be at least 8 characters."),
                mismatch: tGet(dict, "dashboard.security.errors.mismatch", "Passwords do not match.")
            }
        }),
        [dict]
    );

    const [form, setForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [visible, setVisible] = useState({
        current: false,
        next: false,
        confirm: false,
    });

    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [generalErr, setGeneralErr] = useState("");
    const [fieldErr, setFieldErr] = useState({});

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((p) => ({ ...p, [name]: value }));
        if (fieldErr[name]) setFieldErr((p) => ({ ...p, [name]: "" }));
        if (generalErr) setGeneralErr("");
        if (successMsg) setSuccessMsg("");
    };

    const validate = () => {
        const e = {};

        if (!form.currentPassword.trim()) e.currentPassword = T.errors.currentRequired;
        if (!form.newPassword.trim()) e.newPassword = T.errors.newRequired;
        if (!form.confirmPassword.trim()) e.confirmPassword = T.errors.confirmRequired;

        if (form.newPassword && form.newPassword.length < 8) e.newPassword = T.errors.minLength;
        if (form.newPassword && form.confirmPassword && form.newPassword !== form.confirmPassword) {
            e.confirmPassword = T.errors.mismatch;
        }

        setFieldErr(e);
        return Object.keys(e).length === 0;
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;
        if (!validate()) return;

        setLoading(true);
        setGeneralErr("");
        setSuccessMsg("");

        try {
            // ✅ change endpoint if needed
            await http.post("/frontend/user/changePassword", {
                currentPassword: form.currentPassword,
                newPassword: form.newPassword,
            });

            setSuccessMsg(T.success);
            setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err) {
            const status = err?.response?.status;
            const data = err?.response?.data;

            // if backend sends { message: "..." } or { message: {field: "..."} }
            if (status === 422 && typeof data?.message === "object") {
                const cleaned = {};
                for (const k in data.message) cleaned[k] = String(data.message[k]).replace(/"/g, "");
                setFieldErr((prev) => ({ ...prev, ...cleaned }));
            } else {
                setGeneralErr(data?.message || T.errorGeneric);
            }
        } finally {
            setLoading(false);
        }
    };

    const PasswordInput = ({ label, name, value, show, toggle, placeholder }) => (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            <div
                className={`flex items-center gap-2 w-full px-4 py-3 border rounded-xl focus-within:ring-2 focus-within:ring-blue-500 ${fieldErr[name] ? "border-red-300 bg-red-50" : "border-gray-300 bg-white"
                    }`}
            >
                <input
                    type={show ? "text" : "password"}
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="w-full outline-none bg-transparent text-gray-900"
                    placeholder={placeholder}
                    autoComplete="off"
                />
                <button
                    type="button"
                    onClick={toggle}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                    {show ? T.hide : T.show}
                </button>
            </div>
            {fieldErr[name] && <p className="text-red-600 text-sm mt-1">{fieldErr[name]}</p>}
        </div>
    );

    return (
        <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">{T.title}</h2>
                    <p className="text-gray-600 mt-1">{T.subtitle}</p>
                </div>
            </div>

            {generalErr && (
                <div className="mt-5 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
                    {generalErr}
                </div>
            )}

            {successMsg && (
                <div className="mt-5 bg-green-50 border border-green-200 rounded-xl p-4 text-green-700">
                    {successMsg}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
                {/* Form */}
                <div className="lg:col-span-7">
                    <div className="rounded-2xl border border-gray-200 p-5">
                        <h3 className="text-lg font-semibold text-gray-900">{T.changePassword}</h3>

                        <form onSubmit={onSubmit} className="mt-5 space-y-5">
                            <PasswordInput
                                label={T.currentPassword}
                                name="currentPassword"
                                value={form.currentPassword}
                                show={visible.current}
                                toggle={() => setVisible((p) => ({ ...p, current: !p.current }))}
                                placeholder="••••••••"
                            />

                            <PasswordInput
                                label={T.newPassword}
                                name="newPassword"
                                value={form.newPassword}
                                show={visible.next}
                                toggle={() => setVisible((p) => ({ ...p, next: !p.next }))}
                                placeholder="••••••••"
                            />

                            <PasswordInput
                                label={T.confirmPassword}
                                name="confirmPassword"
                                value={form.confirmPassword}
                                show={visible.confirm}
                                toggle={() => setVisible((p) => ({ ...p, confirm: !p.confirm }))}
                                placeholder="••••••••"
                            />

                            <div className="pt-1 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50 flex items-center gap-2"
                                >
                                    {loading && (
                                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    )}
                                    {loading ? T.saving : T.save}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Tips */}
                <div className="lg:col-span-5">
                    <div className="rounded-2xl border border-gray-200 p-5 bg-gray-50">
                        <h3 className="text-base font-semibold text-gray-900">{T.tipsTitle}</h3>
                        <ul className="mt-3 text-sm text-gray-700 space-y-2 list-disc pl-5">
                            <li>{T.tip1}</li>
                            <li>{T.tip2}</li>
                            <li>{T.tip3}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
