"use client";

import React, { useEffect, useMemo, useState } from "react";
import http from "@/http";
import OrderDrawer from "./OrderDrawer";
import { tGet } from "./utils";

const STATUS = [
    "all",
    "pending",
    "confirmed",
    "picked",
    "in_transit",
    "delivered",
    "cancelled",
];

const safeStr = (v) => (v == null ? "" : String(v));
const lower = (v) => safeStr(v).toLowerCase();

function getOrderKey(o) {
    return o?.orderNumber || o?._id || o?.id;
}

function formatDateTime(v) {
    if (!v) return "";
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return safeStr(v);
    return d.toLocaleString();
}

function money(value) {
    return `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;
}

function getProductName(product, locale = "en") {
    if (!product) return "Product";

    if (typeof product === "object") {
        return (
            product?.[locale] ||
            product?.en ||
            product?.ne ||
            product?.zh ||
            "Product"
        );
    }

    if (typeof product === "string") {
        const en = product.match(/en:\s*'([^']*)'/)?.[1];
        const ne = product.match(/ne:\s*'([^']*)'/)?.[1];
        const zh = product.match(/zh:\s*'([^']*)'/)?.[1];

        const parsed = { en, ne, zh };

        return (
            parsed?.[locale] ||
            parsed.en ||
            parsed.ne ||
            parsed.zh ||
            product
        );
    }

    return "Product";
}

export default function OrdersPanel({ dict, locale = "en" }) {
    const T = useMemo(
        () => ({
            title: tGet(dict, "dashboard.orders.title", "My Orders"),
            search: tGet(dict, "dashboard.orders.search", "Search by order number / address"),
            empty: tGet(dict, "dashboard.orders.empty", "No orders found."),
            view: tGet(dict, "dashboard.orders.view", "View"),
            refresh: tGet(dict, "dashboard.orders.refresh", "Refresh"),
            loading: tGet(dict, "common.loading", "Loading..."),
            error: tGet(dict, "common.error", "Something went wrong."),
            all: tGet(dict, "dashboard.orders.statusAll", "All"),
            table: {
                order: tGet(dict, "dashboard.orders.table.order", "Order"),
                route: tGet(dict, "dashboard.orders.table.route", "Delivery Address"),
                cost: tGet(dict, "dashboard.orders.table.cost", "Total"),
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
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    const loadOrders = async () => {
        setLoading(true);
        setErr("");

        try {
            const res = await http.get("/frontend/order/my-orders");

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
                    o?.orderNumber,
                    o?._id,
                    o?.address,
                    o?.landmark,
                    o?.cityDistrict,
                    o?.deliveryZone?.name,
                    o?.paymentMethod,
                    o?.paymentStatus,
                    o?.appliedCoupon?.code,
                    ...(o?.items || []).map((item) =>
                        getProductName(item?.product, locale)
                    ),
                ]
                    .map(safeStr)
                    .join(" ")
                    .toLowerCase();

                return hay.includes(query);
            });
    }, [orders, q, status, locale]);

    const statusPill = (sRaw) => {
        const s = lower(sRaw).replaceAll(" ", "_") || "pending";
        const base = "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm";

        if (s === "delivered") return `${base} bg-emerald-100 text-emerald-800`;
        if (s === "cancelled") return `${base} bg-red-100 text-red-800`;
        if (s === "in_transit") return `${base} bg-blue-100 text-blue-800`;
        if (s === "confirmed") return `${base} bg-purple-100 text-purple-800`;
        if (s === "picked") return `${base} bg-teal-100 text-teal-800`;

        return `${base} bg-amber-100 text-amber-800`;
    };

    const statusLabel = (sRaw) => {
        const s = lower(sRaw).replaceAll(" ", "_") || "pending";
        return T.statusText[s] || safeStr(sRaw || "Pending");
    };

    return (
        <>
            <div className="rounded-2xl border border-gray-100 bg-white shadow-md">
                <div className="border-b border-gray-100 px-6 py-5">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <h2 className="text-xl font-bold tracking-tight text-gray-900">{T.title}</h2>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <div className="relative">
                                <input
                                    value={q}
                                    onChange={(e) => setQ(e.target.value)}
                                    placeholder={T.search}
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 pr-10 text-sm transition-all focus:border-blue-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:w-72"
                                />
                                <svg className="absolute right-3 top-3 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>

                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition-all focus:border-blue-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:w-52"
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
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 hover:shadow-sm sm:w-auto"
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                {T.refresh}
                            </button>
                        </div>
                    </div>
                </div>

                {err && (
                    <div className="mx-6 mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {err}
                    </div>
                )}

                {loading ? (
                    <div className="space-y-4 p-6">
                        <div className="h-6 w-40 animate-pulse rounded bg-gray-100" />
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex gap-4 rounded-xl border border-gray-100 bg-gray-50/30 p-4">
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 w-32 rounded bg-gray-100" />
                                        <div className="h-3 w-24 rounded bg-gray-100" />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 w-40 rounded bg-gray-100" />
                                        <div className="h-3 w-32 rounded bg-gray-100" />
                                    </div>
                                    <div className="flex-1 space-y-2 text-right">
                                        <div className="h-4 w-20 rounded bg-gray-100" />
                                        <div className="h-3 w-16 rounded bg-gray-100" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                        <svg className="mb-3 h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <p className="text-sm">{T.empty}</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    <th className="px-6 py-4">{T.table.order}</th>
                                    <th className="px-6 py-4">{T.table.route}</th>
                                    <th className="px-6 py-4">{T.table.cost}</th>
                                    <th className="px-6 py-4">{T.table.status}</th>
                                    <th className="px-6 py-4 text-right">{T.table.action}</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {filtered.map((o) => (
                                    <tr key={getOrderKey(o)} className="group text-sm transition-colors hover:bg-gray-50/50">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-gray-900">
                                                {o?.orderNumber || o?._id}
                                            </div>
                                            <div className="mt-0.5 text-xs text-gray-500">
                                                {formatDateTime(o?.createdAt || o?.orderDate)}
                                            </div>
                                            <div className="mt-1 text-xs text-gray-500">
                                                {o?.items?.length || 0} item(s)
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">
                                                {o?.cityDistrict || o?.deliveryZone?.name || "-"}
                                            </div>
                                            <div className="mt-0.5 text-xs text-gray-500">
                                                {o?.address || "-"}
                                            </div>
                                            {o?.deliveryZone?.estimatedDeliveryDays && (
                                                <div className="mt-1 text-xs text-gray-500">
                                                    Delivery:{" "}
                                                    {o.deliveryZone.estimatedDeliveryDays.min}-
                                                    {o.deliveryZone.estimatedDeliveryDays.max} days
                                                </div>
                                            )}
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-gray-900">
                                                {money(o?.total)}
                                            </div>
                                            <div className="mt-0.5 text-xs text-gray-500">
                                                Subtotal: {money(o?.subtotal)}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                Delivery: {money(o?.deliveryCharge)}
                                            </div>
                                            {Number(o?.discountAmount || 0) > 0 && (
                                                <div className="mt-0.5 text-xs font-medium text-green-600">
                                                    Coupon {o?.appliedCoupon?.code || ""}: -{" "}
                                                    {money(o?.discountAmount)}
                                                </div>
                                            )}
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className={statusPill(o?.status)}>
                                                {statusLabel(o?.status)}
                                            </span>
                                            <div className="mt-2 text-xs text-gray-500">
                                                Payment: {o?.paymentStatus || "-"}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-right">
                                            <button
                                                type="button"
                                                onClick={() => setSelectedOrderId(o?._id)}
                                                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm"
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
                orderId={selectedOrderId}
                onClose={() => setSelectedOrderId(null)}
            />
        </>
    );
}