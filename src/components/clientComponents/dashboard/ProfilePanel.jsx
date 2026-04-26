"use client";

import React, { useEffect, useMemo, useState } from "react";
import http from "@/http";
import { tGet } from "./utils";

const PHONE_REGEX = /^(\+852[-\s]?\d{4}[-\s]?\d{4}|\+977[-\s]?(9\d{9}|[1-9]\d{7}))$/;

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
        <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">{T.title}</h2>

            {err && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
                    {err}
                </div>
            )}

            {success && (
                <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
                    {success}
                </div>
            )}

            {loading ? (
                <ProfileSkeleton />
            ) : (
                <form onSubmit={onSave} className="mt-6 space-y-5">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            {T.name}
                        </label>

                        <input
                            value={profile.name}
                            onChange={(e) => updateProfile("name", e.target.value)}
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                {T.email}
                            </label>

                            <input
                                value={profile.email}
                                readOnly
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-700"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                {T.phone}
                            </label>

                            <input
                                value={profile.phone}
                                onChange={(e) => updateProfile("phone", e.target.value)}
                                placeholder="+977 9861234567 or +852 9123 4567"
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <p className="mt-1 text-xs text-gray-500">
                                +977 9861234567 / +977-9861234567 / +852 9123 4567 / +852-9123-4567
                            </p>
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            {T.address}
                        </label>

                        <input
                            value={profile.address}
                            onChange={(e) => updateProfile("address", e.target.value)}
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            {T.type}
                        </label>

                        <input
                            value={profile.type}
                            readOnly
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-700"
                        />
                    </div>

                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {saving ? T.saving : T.save}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

function ProfileSkeleton() {
    return (
        <div className="mt-6 animate-pulse space-y-5">
            <div>
                <div className="mb-2 h-4 w-24 rounded bg-gray-200" />
                <div className="h-12 w-full rounded-xl bg-gray-200" />
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                    <div className="mb-2 h-4 w-20 rounded bg-gray-200" />
                    <div className="h-12 w-full rounded-xl bg-gray-200" />
                </div>

                <div>
                    <div className="mb-2 h-4 w-20 rounded bg-gray-200" />
                    <div className="h-12 w-full rounded-xl bg-gray-200" />
                </div>
            </div>

            <div>
                <div className="mb-2 h-4 w-24 rounded bg-gray-200" />
                <div className="h-12 w-full rounded-xl bg-gray-200" />
            </div>

            <div>
                <div className="mb-2 h-4 w-24 rounded bg-gray-200" />
                <div className="h-12 w-full rounded-xl bg-gray-200" />
            </div>

            <div className="flex justify-end">
                <div className="h-12 w-32 rounded-xl bg-gray-200" />
            </div>
        </div>
    );
}