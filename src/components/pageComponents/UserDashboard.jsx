"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import http from "@/http";

const LOCALES = ["en", "ne", "zh"];
const tGet = (obj, path, fallback = "") => {
    try {
        return path.split(".").reduce((acc, k) => acc?.[k], obj) ?? fallback;
    } catch {
        return fallback;
    }
};

const STATUS = ["all", "pending", "confirmed", "picked", "in_transit", "delivered", "cancelled"];

export default function UserDashboard({ dict }) {
    const router = useRouter();
    const params = useParams();
    const locale = LOCALES.includes(params?.locale) ? params.locale : "en";
    const l = (path) => `/${locale}${path.startsWith("/") ? path : `/${path}`}`;

    const T = {
        dashboard: tGet(dict, "dashboard.title", "Dashboard"),
        subtitle: tGet(dict, "dashboard.subtitle", "Manage your profile and orders"),
        tabs: {
            profile: tGet(dict, "dashboard.tabs.profile", "Profile"),
            orders: tGet(dict, "dashboard.tabs.orders", "Orders"),
            addresses: tGet(dict, "dashboard.tabs.addresses", "Addresses"),
            security: tGet(dict, "dashboard.tabs.security", "Security"),
        },
        profile: {
            title: tGet(dict, "dashboard.profile.title", "Profile Information"),
            save: tGet(dict, "dashboard.profile.save", "Save Changes"),
            saving: tGet(dict, "dashboard.profile.saving", "Saving..."),
            name: tGet(dict, "dashboard.profile.name", "Full Name"),
            email: tGet(dict, "dashboard.profile.email", "Email"),
            phone: tGet(dict, "dashboard.profile.phone", "Phone"),
        },
        orders: {
            title: tGet(dict, "dashboard.orders.title", "My Orders"),
            search: tGet(dict, "dashboard.orders.search", "Search by order ID / location"),
            status: tGet(dict, "dashboard.orders.status", "Status"),
            empty: tGet(dict, "dashboard.orders.empty", "No orders found."),
            view: tGet(dict, "dashboard.orders.view", "View"),
        },
        common: {
            loading: tGet(dict, "common.loading", "Loading..."),
            error: tGet(dict, "common.error", "Something went wrong."),
            close: tGet(dict, "common.close", "Close"),
        },
    };

    const [active, setActive] = useState("orders");

    // Profile state
    const [profileLoading, setProfileLoading] = useState(true);
    const [profileSaving, setProfileSaving] = useState(false);
    const [profileErr, setProfileErr] = useState("");
    const [profile, setProfile] = useState({ name: "", email: "", phone: "" });

    // Orders state
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [ordersErr, setOrdersErr] = useState("");
    const [orders, setOrders] = useState([]);
    const [q, setQ] = useState("");
    const [status, setStatus] = useState("all");

    // Drawer
    const [selected, setSelected] = useState(null);

    // Fetch profile + orders
    useEffect(() => {
        const load = async () => {
            try {
                setProfileLoading(true);
                setOrdersLoading(true);
                setProfileErr("");
                setOrdersErr("");

                // Adjust endpoints to your backend
                const [meRes, ordersRes] = await Promise.all([
                    http.get("/frontend/user/me"),
                    http.get("/frontend/aiCourier/myOrders"),
                ]);

                const me = meRes?.data?.data || meRes?.data?.user || {};
                setProfile({
                    name: me?.name || me?.fullName || "",
                    email: me?.email || "",
                    phone: me?.phone || me?.contact || "",
                });

                const list = ordersRes?.data?.data || ordersRes?.data?.result || [];
                setOrders(Array.isArray(list) ? list : []);
            } catch (e) {
                setProfileErr(T.common.error);
                setOrdersErr(T.common.error);
            } finally {
                setProfileLoading(false);
                setOrdersLoading(false);
            }
        };

        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filteredOrders = useMemo(() => {
        const query = q.trim().toLowerCase();

        return orders
            .filter((o) => {
                if (status === "all") return true;
                return String(o?.status || "").toLowerCase() === status;
            })
            .filter((o) => {
                if (!query) return true;
                const hay = [
                    o?.orderId,
                    o?._id,
                    o?.trackingId,
                    o?.pickUpLocation,
                    o?.dropLocation,
                    o?.recieverName,
                    o?.senderName,
                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();
                return hay.includes(query);
            });
    }, [orders, q, status]);

    const onSaveProfile = async (e) => {
        e.preventDefault();
        if (profileSaving) return;

        setProfileSaving(true);
        setProfileErr("");
        try {
            await http.put("/frontend/user/me", {
                name: profile.name,
                phone: profile.phone,
            });
        } catch (e) {
            setProfileErr(T.common.error);
        } finally {
            setProfileSaving(false);
        }
    };

    const statusPill = (s) => {
        const v = String(s || "pending").toLowerCase();
        const base = "px-2.5 py-1 rounded-full text-xs font-semibold";
        if (v === "delivered") return `${base} bg-green-100 text-green-700`;
        if (v === "cancelled") return `${base} bg-red-100 text-red-700`;
        if (v === "in_transit" || v === "in transit") return `${base} bg-blue-100 text-blue-700`;
        if (v === "confirmed") return `${base} bg-purple-100 text-purple-700`;
        return `${base} bg-amber-100 text-amber-700`;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{T.dashboard}</h1>
                        <p className="text-gray-600 mt-1">{T.subtitle}</p>
                    </div>

                    <div className="flex gap-2">
                        <Link
                            href={l("/courier/getStart")}
                            className="px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 font-medium"
                        >
                            + New Courier
                        </Link>
                        <Link
                            href={l("/courier/track")}
                            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium"
                        >
                            Track Order
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Sidebar */}
                    <aside className="lg:col-span-3">
                        <div className="bg-white rounded-2xl shadow-sm p-3">
                            {[
                                { key: "profile", label: T.tabs.profile },
                                { key: "orders", label: T.tabs.orders },
                                { key: "addresses", label: T.tabs.addresses },
                                { key: "security", label: T.tabs.security },
                            ].map((item) => (
                                <button
                                    key={item.key}
                                    onClick={() => setActive(item.key)}
                                    className={`w-full text-left px-4 py-3 rounded-xl font-medium transition
                    ${active === item.key ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50 text-gray-800"}`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </aside>

                    {/* Main */}
                    <main className="lg:col-span-9">
                        {/* Profile */}
                        {active === "profile" && (
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <h2 className="text-xl font-bold text-gray-900">{T.profile.title}</h2>

                                {profileErr && (
                                    <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
                                        {profileErr}
                                    </div>
                                )}

                                {profileLoading ? (
                                    <div className="mt-6 text-gray-600">{T.common.loading}</div>
                                ) : (
                                    <form onSubmit={onSaveProfile} className="mt-6 space-y-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">{T.profile.name}</label>
                                            <input
                                                value={profile.name}
                                                onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">{T.profile.email}</label>
                                                <input
                                                    value={profile.email}
                                                    readOnly
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">{T.profile.phone}</label>
                                                <input
                                                    value={profile.phone}
                                                    onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-2 flex justify-end">
                                            <button
                                                disabled={profileSaving}
                                                className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50"
                                            >
                                                {profileSaving ? T.profile.saving : T.profile.save}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        )}

                        {/* Orders */}
                        {active === "orders" && (
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <h2 className="text-xl font-bold text-gray-900">{T.orders.title}</h2>

                                    <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                                        <input
                                            value={q}
                                            onChange={(e) => setQ(e.target.value)}
                                            placeholder={T.orders.search}
                                            className="w-full sm:w-72 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        />

                                        <select
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value)}
                                            className="w-full sm:w-52 px-4 py-2.5 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        >
                                            {STATUS.map((s) => (
                                                <option key={s} value={s}>
                                                    {s === "all" ? "All" : s.replaceAll("_", " ")}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {ordersErr && (
                                    <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
                                        {ordersErr}
                                    </div>
                                )}

                                {ordersLoading ? (
                                    <div className="mt-6 text-gray-600">{T.common.loading}</div>
                                ) : filteredOrders.length === 0 ? (
                                    <div className="mt-8 text-gray-600">{T.orders.empty}</div>
                                ) : (
                                    <div className="mt-6 overflow-x-auto">
                                        <table className="min-w-full">
                                            <thead>
                                                <tr className="text-left text-xs uppercase tracking-wider text-gray-500 border-b">
                                                    <th className="py-3 pr-4">Order</th>
                                                    <th className="py-3 pr-4">Route</th>
                                                    <th className="py-3 pr-4">Cost</th>
                                                    <th className="py-3 pr-4">Status</th>
                                                    <th className="py-3 pr-4"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y">
                                                {filteredOrders.map((o) => (
                                                    <tr key={o?._id || o?.orderId} className="text-sm">
                                                        <td className="py-4 pr-4">
                                                            <div className="font-semibold text-gray-900">{o?.orderId || o?.trackingId || o?._id}</div>
                                                            <div className="text-gray-500 text-xs">
                                                                {o?.createdAt ? new Date(o.createdAt).toLocaleString() : ""}
                                                            </div>
                                                        </td>

                                                        <td className="py-4 pr-4">
                                                            <div className="text-gray-900">
                                                                {o?.pickUpLocation || "-"} → {o?.dropLocation || "-"}
                                                            </div>
                                                            <div className="text-gray-500 text-xs">{o?.packageSize ? `${o.packageSize} KG` : ""}</div>
                                                        </td>

                                                        <td className="py-4 pr-4 font-semibold text-gray-900">
                                                            {o?.estimatedCost != null ? `${o.estimatedCost} NPR` : "-"}
                                                        </td>

                                                        <td className="py-4 pr-4">
                                                            <span className={statusPill(o?.status)}>{String(o?.status || "pending").replaceAll("_", " ")}</span>
                                                        </td>

                                                        <td className="py-4 pr-1 text-right">
                                                            <button
                                                                onClick={() => setSelected(o)}
                                                                className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 font-medium"
                                                            >
                                                                {T.orders.view}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Addresses (placeholder) */}
                        {active === "addresses" && (
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <h2 className="text-xl font-bold text-gray-900">{T.tabs.addresses}</h2>
                                <p className="text-gray-600 mt-2">Coming next: saved pickup/drop addresses.</p>
                            </div>
                        )}

                        {/* Security (placeholder) */}
                        {active === "security" && (
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <h2 className="text-xl font-bold text-gray-900">{T.tabs.security}</h2>
                                <p className="text-gray-600 mt-2">Coming next: change password, sessions, logout all devices.</p>
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {/* Drawer */}
            {selected && (
                <div className="fixed inset-0 z-50">
                    <div
                        className="absolute inset-0 bg-black/30"
                        onClick={() => setSelected(null)}
                    />
                    <div className="absolute right-0 top-0 h-full w-full sm:w-[520px] bg-white shadow-xl p-6 overflow-y-auto">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">
                                    {selected?.orderId || selected?.trackingId || selected?._id}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    {selected?.pickUpLocation || "-"} → {selected?.dropLocation || "-"}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelected(null)}
                                className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 font-medium"
                            >
                                {T.common.close}
                            </button>
                        </div>

                        <div className="mt-6 space-y-4">
                            <div className="rounded-xl border border-gray-200 p-4">
                                <div className="text-xs text-gray-500">Status</div>
                                <div className="mt-1">
                                    <span className={statusPill(selected?.status)}>
                                        {String(selected?.status || "pending").replaceAll("_", " ")}
                                    </span>
                                </div>
                            </div>

                            <div className="rounded-xl border border-gray-200 p-4">
                                <div className="text-xs text-gray-500">Sender</div>
                                <div className="mt-1 text-sm text-gray-900 font-semibold">{selected?.senderName || "-"}</div>
                                <div className="text-sm text-gray-600">{selected?.senderContact || "-"}</div>
                            </div>

                            <div className="rounded-xl border border-gray-200 p-4">
                                <div className="text-xs text-gray-500">Receiver</div>
                                <div className="mt-1 text-sm text-gray-900 font-semibold">{selected?.recieverName || "-"}</div>
                                <div className="text-sm text-gray-600">{selected?.recieverContact || "-"}</div>
                            </div>

                            <div className="rounded-xl border border-gray-200 p-4">
                                <div className="text-xs text-gray-500">Cost</div>
                                <div className="mt-1 text-lg font-bold text-gray-900">
                                    {selected?.estimatedCost != null ? `${selected.estimatedCost} NPR` : "-"}
                                </div>
                                <div className="text-sm text-gray-600">{selected?.packageSize ? `${selected.packageSize} KG` : ""}</div>
                            </div>

                            <div className="rounded-xl border border-gray-200 p-4">
                                <div className="text-xs text-gray-500">Notes</div>
                                <div className="mt-1 text-sm text-gray-700">{selected?.remark || "-"}</div>
                            </div>
                        </div>

                        <div className="mt-6 flex gap-3">
                            <Link
                                href={l(`/courier/track?order=${encodeURIComponent(selected?.orderId || selected?._id || "")}`)}
                                className="flex-1 text-center px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                            >
                                Track
                            </Link>
                            <button
                                onClick={() => setSelected(null)}
                                className="px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 font-semibold"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
