"use client";

import React, { useEffect, useMemo, useState } from "react";
import http from "@/http";
import { tGet } from "./utils";

export default function ProfilePanel({ dict }) {
    const T = useMemo(
        () => ({
            title: tGet(dict, "dashboard.profile.title", "Profile Information"),
            save: tGet(dict, "dashboard.profile.save", "Save Changes"),
            saving: tGet(dict, "dashboard.profile.saving", "Saving..."),
            name: tGet(dict, "dashboard.profile.name", "Full Name"),
            email: tGet(dict, "dashboard.profile.email", "Email"),
            phone: tGet(dict, "dashboard.profile.phone", "Phone"),
            loading: tGet(dict, "common.loading", "Loading..."),
            error: tGet(dict, "common.error", "Something went wrong."),
        }),
        [dict]
    );

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState("");
    const [profile, setProfile] = useState({ name: "", email: "", phone: "" });

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setErr("");
            try {
                const res = await http.get("/frontend/user/me");
                const me = res?.data?.data || res?.data?.user || {};
                setProfile({
                    name: me?.name || me?.fullName || "",
                    email: me?.email || "",
                    phone: me?.phone || me?.contact || "",
                });
            } catch {
                setErr(T.error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [T.error]);

    const onSave = async (e) => {
        e.preventDefault();
        if (saving) return;
        setSaving(true);
        setErr("");
        try {
            await http.put("/frontend/user/me", { name: profile.name, phone: profile.phone });
        } catch {
            setErr(T.error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900">{T.title}</h2>

            {err && <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">{err}</div>}

            {loading ? (
                <div className="mt-6 text-gray-600">{T.loading}</div>
            ) : (
                <form onSubmit={onSave} className="mt-6 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{T.name}</label>
                        <input
                            value={profile.name}
                            onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{T.email}</label>
                            <input
                                value={profile.email}
                                readOnly
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{T.phone}</label>
                            <input
                                value={profile.phone}
                                onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                        <button
                            disabled={saving}
                            className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50"
                        >
                            {saving ? T.saving : T.save}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
