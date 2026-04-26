"use client";

import React, { useEffect, useMemo, useState } from "react";
import http from "@/http";
import OrderDrawer from "./OrderDrawer";
import { tGet } from "./utils";

const STATUS = [
    "all",
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
];

const SORT_OPTIONS = [
    { label: "Newest First", sortBy: "createdAt", sortOrder: "desc" },
    { label: "Oldest First", sortBy: "createdAt", sortOrder: "asc" },
    { label: "Highest Total", sortBy: "total", sortOrder: "desc" },
    { label: "Lowest Total", sortBy: "total", sortOrder: "asc" },
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
    return `HK$ ${Number(value || 0).toLocaleString("en-HK", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
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
                processing: tGet(dict, "dashboard.orders.statuses.processing", "Processing"),
                shipped: tGet(dict, "dashboard.orders.statuses.shipped", "Shipped"),
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
    const [debouncedQ, setDebouncedQ] = useState("");
    const [status, setStatus] = useState("all");
    const [sort, setSort] = useState(SORT_OPTIONS[0]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);

    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 5,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
    });

    const [selectedOrderId, setSelectedOrderId] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQ(q.trim());
            setPage(1);
        }, 400);

        return () => clearTimeout(timer);
    }, [q]);

    const loadOrders = async () => {
        setLoading(true);
        setErr("");

        try {
            const params = {
                page,
                limit,
                search: debouncedQ,
                sortBy: sort.sortBy,
                sortOrder: sort.sortOrder,
            };

            if (status !== "all") {
                params.status = status;
            }

            const res = await http.get("/frontend/order/my-orders", {
                params,
            });

            setOrders(Array.isArray(res?.data?.data) ? res.data.data : []);

            setPagination(
                res?.data?.pagination || {
                    total: 0,
                    page,
                    limit,
                    totalPages: 1,
                    hasNextPage: false,
                    hasPrevPage: false,
                }
            );
        } catch (error) {
            setErr(error?.response?.data?.message || T.error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, limit, debouncedQ, status, sort]);

    const statusPill = (sRaw) => {
        const s = lower(sRaw).replaceAll(" ", "_") || "pending";
        const base =
            "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm capitalize";

        if (s === "delivered") return `${base} bg-emerald-100 text-emerald-800`;
        if (s === "cancelled") return `${base} bg-red-100 text-red-800`;
        if (s === "shipped") return `${base} bg-blue-100 text-blue-800`;
        if (s === "processing") return `${base} bg-cyan-100 text-cyan-800`;
        if (s === "confirmed") return `${base} bg-purple-100 text-purple-800`;

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
                    <h2 className="text-xl font-bold tracking-tight text-gray-900 mb-4">
                        {T.title}
                    </h2>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <input
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder={T.search}
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-blue-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:w-72"
                            />

                            <select
                                value={status}
                                onChange={(e) => {
                                    setStatus(e.target.value);
                                    setPage(1);
                                }}
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-blue-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:w-44"
                            >
                                <option value="all">{T.all}</option>
                                {STATUS.filter((s) => s !== "all").map((s) => (
                                    <option key={s} value={s}>
                                        {statusLabel(s)}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={`${sort.sortBy}-${sort.sortOrder}`}
                                onChange={(e) => {
                                    const selected = SORT_OPTIONS.find(
                                        (item) =>
                                            `${item.sortBy}-${item.sortOrder}` ===
                                            e.target.value
                                    );

                                    setSort(selected || SORT_OPTIONS[0]);
                                    setPage(1);
                                }}
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-blue-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:w-44"
                            >
                                {SORT_OPTIONS.map((item) => (
                                    <option
                                        key={`${item.sortBy}-${item.sortOrder}`}
                                        value={`${item.sortBy}-${item.sortOrder}`}
                                    >
                                        {item.label}
                                    </option>
                                ))}
                            </select>

                            <button
                                type="button"
                                onClick={loadOrders}
                                className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                            >
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
                    <div className="p-6 text-sm text-gray-500">{T.loading}</div>
                ) : orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                        <p className="text-sm">{T.empty}</p>
                    </div>
                ) : (
                    <>
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
                                    {orders.map((o) => (
                                        <tr
                                            key={getOrderKey(o)}
                                            className="group text-sm transition-colors hover:bg-gray-50/50"
                                        >
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

                                                <div className="mt-0.5 text-xs text-gray-500 capitalize">
                                                    Method: {o?.paymentMethod || "-"}
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

                        <div className="flex flex-col gap-3 border-t border-gray-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="text-sm text-gray-500">
                                Page {pagination.page} of {pagination.totalPages} ·{" "}
                                {pagination.total} orders
                            </div>

                            <div className="flex items-center gap-2">
                                <select
                                    value={limit}
                                    onChange={(e) => {
                                        setLimit(Number(e.target.value));
                                        setPage(1);
                                    }}
                                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                </select>

                                <button
                                    type="button"
                                    disabled={!pagination.hasPrevPage}
                                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                    className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Prev
                                </button>

                                <button
                                    type="button"
                                    disabled={!pagination.hasNextPage}
                                    onClick={() => setPage((prev) => prev + 1)}
                                    className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </>
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