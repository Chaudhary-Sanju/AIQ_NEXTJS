"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AlertCircle, BadgeCheck, Loader2, MapPin, Phone, Save, UserRound, Mail, ShieldCheck } from "lucide-react";
import http from "@/http";
import { tGet } from "./utils";

const PHONE_REGEX =
    /^(\+852[-\s]?\d{4}[-\s]?\d{4}|\+977[-\s]?(9\d{9}|[1-9]\d{7}))$/;

export default function ProfilePanel({ dict }) {
    const T = useMemo(
        () => ({
            title: tGet(dict, "dashboard.profile.title", "Profile Information"),
            save: tGet(dict, "dashboard.profile.save", "Save Changes"),
            saving: tGet(dict, "dashboard.profile.saving", "Saving..."),
            name: tGet(dict, "dashboard.profile.name", "Full Name"),
            email: tGet(dict, "dashboard.profile.email", "Email"),
            phone: tGet(dict, "dashboard.profile.phone", "Phone"),
            address: tGet(dict, "dashboard.profile.address", "Address"),
            type: tGet(dict, "dashboard.profile.type", "Account Type"),
            loading: tGet(dict, "common.loading", "Loading..."),
            error: tGet(dict, "common.error", "Something went wrong."),
            updated: tGet(dict, "dashboard.profile.updated", "Profile updated."),
            invalidPhone: tGet(
                dict,
                "dashboard.profile.invalidPhone",
                "Invalid phone number. Use +852 9123 4567 or +977 9861234567."
            ),
        }),
        [dict]
    );

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState("");
    const [success, setSuccess] = useState("");

    const [profile, setProfile] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        type: "",
    });

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setErr("");
            setSuccess("");

            try {
                const res = await http.get("/frontend/auth/details");
                const me = res?.data?.data || res?.data || {};

                setProfile({
                    name: me?.name || "",
                    email: me?.email || "",
                    phone: me?.phone || "",
                    address: me?.address || "",
                    type: me?.type || "",
                });
            } catch {
                setErr(T.error);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [T.error]);

    const updateProfile = (field, value) => {
        setProfile((prev) => ({ ...prev, [field]: value }));
        setErr("");
        setSuccess("");
    };

    const onSave = async (e) => {
        e.preventDefault();

        if (saving) return;

        const phone = profile.phone.trim();

        if (!PHONE_REGEX.test(phone)) {
            setErr(T.invalidPhone);
            return;
        }

        setSaving(true);
        setErr("");
        setSuccess("");

        try {
            await http.put("/frontend/profile/edit", {
                name: profile.name.trim(),
                phone,
                address: profile.address.trim(),
            });

            setSuccess(T.updated);
        } catch (error) {
            setErr(error?.response?.data?.message || T.error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <section className="overflow-hidden rounded-[28px] border border-orange-100 bg-white/95 shadow-[0_18px_45px_rgba(15,42,94,0.08)] backdrop-blur">
            <div className="border-b border-orange-100 bg-gradient-to-br from-white to-orange-50/60 px-5 py-6 sm:px-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#1a4b8f]">
                            <UserRound className="h-4 w-4" />
                            Profile
                        </div>

                        <h2 className="text-2xl font-bold tracking-tight text-neutral-950">
                            {T.title}
                        </h2>

                        <p className="mt-1 text-sm leading-6 text-neutral-500">
                            Keep your contact and delivery details up to date.
                        </p>
                    </div>

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1a4b8f]/10 text-[#1a4b8f]">
                        <ShieldCheck className="h-6 w-6" />
                    </div>
                </div>
            </div>

            <div className="p-5 sm:p-6">
                {err && (
                    <AlertBox type="error" icon={<AlertCircle className="h-5 w-5" />} text={err} />
                )}

                {success && (
                    <AlertBox type="success" icon={<BadgeCheck className="h-5 w-5" />} text={success} />
                )}

                {loading ? (
                    <ProfileSkeleton />
                ) : (
                    <form onSubmit={onSave} className="mt-6 space-y-5">
                        <Field label={T.name} icon={<UserRound className="h-5 w-5" />}>
                            <input
                                value={profile.name}
                                onChange={(e) => updateProfile("name", e.target.value)}
                                className="input-base"
                                placeholder="Your full name"
                            />
                        </Field>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <Field label={T.email} icon={<Mail className="h-5 w-5" />}>
                                <input
                                    value={profile.email}
                                    readOnly
                                    className="input-base cursor-not-allowed bg-neutral-50 text-neutral-500"
                                />
                            </Field>

                            <Field label={T.phone} icon={<Phone className="h-5 w-5" />}>
                                <input
                                    value={profile.phone}
                                    onChange={(e) => updateProfile("phone", e.target.value)}
                                    placeholder="+977 9861234567 or +852 9123 4567"
                                    className="input-base"
                                />

                                <p className="mt-2 text-xs leading-5 text-neutral-500">
                                    +977 9861234567 / +977-9861234567 / +852 9123 4567 / +852-9123-4567
                                </p>
                            </Field>
                        </div>

                        <Field label={T.address} icon={<MapPin className="h-5 w-5" />}>
                            <input
                                value={profile.address}
                                onChange={(e) => updateProfile("address", e.target.value)}
                                className="input-base"
                                placeholder="Your address"
                            />
                        </Field>

                        <Field label={T.type} icon={<BadgeCheck className="h-5 w-5" />}>
                            <input
                                value={profile.type}
                                readOnly
                                className="input-base cursor-not-allowed bg-neutral-50 text-neutral-500"
                            />
                        </Field>

                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={saving}
                                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#1a4b8f] px-6 text-sm font-bold text-white shadow-lg shadow-[#1a4b8f]/20 transition hover:bg-[#0f2a5e] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        {T.saving}
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4" />
                                        {T.save}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>

            <style jsx>{`
                .input-base {
                    height: 48px;
                    width: 100%;
                    border-radius: 16px;
                    border: 1px solid rgb(255 237 213);
                    background: white;
                    padding: 0 16px;
                    font-size: 14px;
                    color: rgb(23 23 23);
                    outline: none;
                    transition: 0.2s ease;
                }

                .input-base:focus {
                    border-color: #1a4b8f;
                    box-shadow: 0 0 0 4px rgba(26, 75, 143, 0.1);
                }
            `}</style>
        </section>
    );
}

function Field({ label, icon, children }) {
    return (
        <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-neutral-800">
                <span className="text-[#1a4b8f]">{icon}</span>
                {label}
            </label>
            {children}
        </div>
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

function ProfileSkeleton() {
    return (
        <div className="mt-6 animate-pulse space-y-5">
            <div>
                <div className="mb-2 h-4 w-24 rounded bg-orange-100" />
                <div className="h-12 w-full rounded-2xl bg-neutral-100" />
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                    <div className="mb-2 h-4 w-20 rounded bg-orange-100" />
                    <div className="h-12 w-full rounded-2xl bg-neutral-100" />
                </div>

                <div>
                    <div className="mb-2 h-4 w-20 rounded bg-orange-100" />
                    <div className="h-12 w-full rounded-2xl bg-neutral-100" />
                </div>
            </div>

            <div>
                <div className="mb-2 h-4 w-24 rounded bg-orange-100" />
                <div className="h-12 w-full rounded-2xl bg-neutral-100" />
            </div>

            <div>
                <div className="mb-2 h-4 w-24 rounded bg-orange-100" />
                <div className="h-12 w-full rounded-2xl bg-neutral-100" />
            </div>

            <div className="flex justify-end">
                <div className="h-12 w-36 rounded-2xl bg-blue-100" />
            </div>
        </div>
    );
}