"use client";

import React, { useEffect, useMemo, useState } from "react";
import http from "@/http";
import OrderDrawer from "./OrderDrawer";
import { tGet } from "./utils";

const STATUS = ["all", "pending", "confirmed", "picked", "in_transit", "delivered", "cancelled"];

const safeStr = (v) => (v == null ? "" : String(v));
const lower = (v) => safeStr(v).toLowerCase();

function getOrderKey(o) {
    return o?.orderId || o?.trackingId || o?._id || o?.id || `${o?.createdAt || ""}-${Math.random()}`;
}

function formatDateTime(v) {
    if (!v) return "";
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return safeStr(v);
    return d.toLocaleString();
}

export default function OrdersPanel({ dict, locale }) {
    const T = useMemo(
        () => ({
            title: tGet(dict, "dashboard.orders.title", "My Orders"),
            search: tGet(dict, "dashboard.orders.search", "Search by order ID / location"),
            statusLabel: tGet(dict, "dashboard.orders.status", "Status"),
            empty: tGet(dict, "dashboard.orders.empty", "No orders found."),
            view: tGet(dict, "dashboard.orders.view", "View"),
            refresh: tGet(dict, "dashboard.orders.refresh", "Refresh"),
            loading: tGet(dict, "common.loading", "Loading..."),
            error: tGet(dict, "common.error", "Something went wrong."),
            all: tGet(dict, "dashboard.orders.statusAll", "All"),
            table: {
                order: tGet(dict, "dashboard.orders.table.order", "Order"),
                route: tGet(dict, "dashboard.orders.table.route", "Route"),
                cost: tGet(dict, "dashboard.orders.table.cost", "Cost"),
                status: tGet(dict, "dashboard.orders.table.status", "Status"),
                action: tGet(dict, "dashboard.orders.table.action", "Action"),
            },
            statusText: {
                pending: tGet(dict, "dashboard.orders.statuses.pending", "Pending"),
                confirmed: tGet(dict, "dashboard.orders.statuses.confirmed", "Confirmed"),
                picked: tGet(dict, "dashboard.orders.statuses.picked", "Picked"),
                in_transit: tGet(dict, "dashboard.orders.statuses.in_transit", "In Transit"),
                delivered: tGet(dict, "dashboard.orders.statuses.delivered", "Delivered"),
                cancelled: tGet(dict, "dashboard.orders.statuses.cancelled", "Cancelled"),
            },
        }),
        [dict]
    );

    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");
    const [orders, setOrders] = useState([]);

    const [q, setQ] = useState("");
    const [status, setStatus] = useState("all");

    const [selected, setSelected] = useState(null);

    const loadOrders = async () => {
        setLoading(true);
        setErr("");
        try {
            // Adjust if your endpoint differs
            const res = await http.get("/frontend/aiCourier/myOrders");

            // supports: {data: [...]}, {result: [...]}, {orders: [...]}
            const list =
                res?.data?.data ||
                res?.data?.result ||
                res?.data?.orders ||
                [];

            setOrders(Array.isArray(list) ? list : []);
        } catch {
            setErr(T.error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filtered = useMemo(() => {
        const query = q.trim().toLowerCase();

        return orders
            .filter((o) => {
                if (status === "all") return true;

                const s = lower(o?.status).replaceAll(" ", "_");
                return s === status;
            })
            .filter((o) => {
                if (!query) return true;

                const hay = [
                    o?.orderId,
                    o?.trackingId,
                    o?._id,
                    o?.pickUpLocation,
                    o?.dropLocation,
                    o?.senderName,
                    o?.senderContact,
                    o?.recieverName,
                    o?.recieverContact,
                ]
                    .map(safeStr)
                    .join(" ")
                    .toLowerCase();

                return hay.includes(query);
            });
    }, [orders, q, status]);

    const statusPill = (sRaw) => {
        const s = lower(sRaw).replaceAll(" ", "_") || "pending";
        const base = "px-2.5 py-1 rounded-full text-xs font-semibold";
        if (s === "delivered") return `${base} bg-green-100 text-green-700`;
        if (s === "cancelled") return `${base} bg-red-100 text-red-700`;
        if (s === "in_transit") return `${base} bg-blue-100 text-blue-700`;
        if (s === "confirmed") return `${base} bg-purple-100 text-purple-700`;
        if (s === "picked") return `${base} bg-teal-100 text-teal-700`;
        return `${base} bg-amber-100 text-amber-700`;
    };

    const statusLabel = (sRaw) => {
        const s = lower(sRaw).replaceAll(" ", "_") || "pending";
        return T.statusText[s] || safeStr(sRaw || "Pending");
    };

    return (
        <>
            <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <h2 className="text-xl font-bold text-gray-900">{T.title}</h2>

                    <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                        <input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder={T.search}
                            className="w-full sm:w-72 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />

                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full sm:w-52 px-4 py-2.5 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            <option value="all">{T.all}</option>
                            {STATUS.filter((s) => s !== "all").map((s) => (
                                <option key={s} value={s}>
                                    {statusLabel(s)}
                                </option>
                            ))}
                        </select>

                        <button
                            type="button"
                            onClick={loadOrders}
                            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 font-semibold"
                        >
                            {T.refresh}
                        </button>
                    </div>
                </div>

                {err && (
                    <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
                        {err}
                    </div>
                )}

                {loading ? (
                    <div className="mt-6 text-gray-600">{T.loading}</div>
                ) : filtered.length === 0 ? (
                    <div className="mt-8 text-gray-600">{T.empty}</div>
                ) : (
                    <div className="mt-6 overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="text-left text-xs uppercase tracking-wider text-gray-500 border-b">
                                    <th className="py-3 pr-4">{T.table.order}</th>
                                    <th className="py-3 pr-4">{T.table.route}</th>
                                    <th className="py-3 pr-4">{T.table.cost}</th>
                                    <th className="py-3 pr-4">{T.table.status}</th>
                                    <th className="py-3 pr-1 text-right">{T.table.action}</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y">
                                {filtered.map((o) => (
                                    <tr key={getOrderKey(o)} className="text-sm">
                                        <td className="py-4 pr-4">
                                            <div className="font-semibold text-gray-900">
                                                {o?.orderId || o?.trackingId || o?._id}
                                            </div>
                                            <div className="text-gray-500 text-xs">
                                                {formatDateTime(o?.createdAt)}
                                            </div>
                                        </td>

                                        <td className="py-4 pr-4">
                                            <div className="text-gray-900">
                                                {o?.pickUpLocation || "-"} → {o?.dropLocation || "-"}
                                            </div>
                                            <div className="text-gray-500 text-xs">
                                                {o?.packageSize ? `${o.packageSize} KG` : ""}
                                            </div>
                                        </td>

                                        <td className="py-4 pr-4 font-semibold text-gray-900">
                                            {o?.estimatedCost != null ? `${o.estimatedCost} NPR` : "-"}
                                        </td>

                                        <td className="py-4 pr-4">
                                            <span className={statusPill(o?.status)}>{statusLabel(o?.status)}</span>
                                        </td>

                                        <td className="py-4 pr-1 text-right">
                                            <button
                                                onClick={() => setSelected(o)}
                                                className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 font-medium"
                                            >
                                                {T.view}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <OrderDrawer
                dict={dict}
                locale={locale}
                order={selected}
                onClose={() => setSelected(null)}
            />
        </>
    );
}
