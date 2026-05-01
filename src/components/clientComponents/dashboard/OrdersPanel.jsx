"use client";

import React, { Fragment, useEffect, useMemo, useState } from "react";
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

function parseProductNameString(value) {
    if (!value || typeof value !== "string") return null;

    const result = {};

    const enMatch = value.match(/en\s*:\s*['"`]([^'"`]*)['"`]/);
    const neMatch = value.match(/ne\s*:\s*['"`]([^'"`]*)['"`]/);
    const zhMatch = value.match(/zh\s*:\s*['"`]([^'"`]*)['"`]/);

    if (enMatch?.[1]) result.en = enMatch[1].trim();
    if (neMatch?.[1]) result.ne = neMatch[1].trim();
    if (zhMatch?.[1]) result.zh = zhMatch[1].trim();

    return Object.keys(result).length ? result : null;
}

function productName(product, locale = "en") {
    if (!product) return "";

    if (typeof product === "string") {
        const parsed = parseProductNameString(product);

        if (parsed) {
            return (
                parsed?.[locale] ||
                parsed?.en ||
                parsed?.ne ||
                parsed?.zh ||
                "Product"
            );
        }

        return product;
    }

    const name = product?.name;

    if (typeof name === "string") {
        const parsed = parseProductNameString(name);

        if (parsed) {
            return (
                parsed?.[locale] ||
                parsed?.en ||
                parsed?.ne ||
                parsed?.zh ||
                "Product"
            );
        }

        return name;
    }

    return (
        name?.[locale] ||
        name?.en ||
        name?.ne ||
        name?.zh ||
        "Product"
    );
}

function ReviewModal({ open, onClose, reviewTarget, onSubmitted }) {
    const existingReview = reviewTarget?.existingReview || null;
    const isEdit = !!existingReview?._id;

    const [rating, setRating] = useState(5);
    const [review, setReview] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [err, setErr] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (open) {
            setRating(existingReview?.rating || 5);
            setReview(existingReview?.review || "");
            setErr("");
            setSuccess("");
        }
    }, [open, existingReview]);

    if (!open) return null;

    const submitReview = async (e) => {
        e.preventDefault();

        setSubmitting(true);
        setErr("");
        setSuccess("");

        try {
            if (isEdit) {
                await http.patch(`/frontend/martReview/my/${existingReview._id}`, {
                    rating,
                    review,
                });

                setSuccess("Review updated successfully. Waiting for approval again.");
            } else {
                await http.post("/frontend/martReview/", {
                    product_id: reviewTarget?.productID,
                    order_id: reviewTarget?.orderId,
                    rating,
                    review,
                });

                setSuccess("Review submitted successfully. Waiting for approval.");
            }

            await onSubmitted?.();

            setTimeout(() => {
                onClose();
            }, 800);
        } catch (error) {
            setErr(
                error?.response?.data?.message ||
                "Unable to submit review."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
                <div className="flex items-start justify-between border-b border-gray-100 px-6 py-4">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">
                            {isEdit ? "Update Review" : "Add Review"}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                            {reviewTarget?.product || "Product"}
                        </p>

                        {isEdit && (
                            <div className="mt-2">
                                <span
                                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${existingReview?.approved
                                        ? "bg-green-100 text-green-700"
                                        : "bg-yellow-100 text-yellow-700"
                                        }`}
                                >
                                    {existingReview?.approved
                                        ? "Approved"
                                        : "Waiting for approval"}
                                </span>
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full px-2 py-1 text-xl text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={submitReview} className="space-y-4 px-6 py-5">
                    {err && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                            {err}
                        </div>
                    )}

                    {success && (
                        <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                            {success}
                        </div>
                    )}

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Rating
                        </label>

                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className={`h-10 w-10 rounded-xl border text-lg font-bold ${rating >= star
                                        ? "border-yellow-300 bg-yellow-50 text-yellow-500"
                                        : "border-gray-200 bg-white text-gray-300"
                                        }`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Review
                        </label>

                        <textarea
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            required
                            minLength={3}
                            rows={5}
                            placeholder="Write your experience about this product..."
                            className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {submitting
                                ? isEdit
                                    ? "Updating..."
                                    : "Submitting..."
                                : isEdit
                                    ? "Update Review"
                                    : "Submit Review"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
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

    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [reviewTarget, setReviewTarget] = useState(null);

    const [reviewMap, setReviewMap] = useState({});
    const [reviewLoadingMap, setReviewLoadingMap] = useState({});

    const getReviewKey = (orderId, productId) => {
        return `${orderId}_${productId}`;
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQ(q.trim());
            setPage(1);
        }, 400);

        return () => clearTimeout(timer);
    }, [q]);

    const loadOrderProductReviews = async (orderList = []) => {
        const deliveredOrders = orderList.filter(
            (order) => lower(order?.status) === "delivered"
        );

        if (!deliveredOrders.length) {
            setReviewMap({});
            setReviewLoadingMap({});
            return;
        }

        const loadingMap = {};

        deliveredOrders.forEach((order) => {
            (order?.items || []).forEach((item) => {
                const orderId = order?._id;
                const productId = item?.productID?._id || item?.productID;

                if (!orderId || !productId) return;

                const key = getReviewKey(orderId, productId);
                loadingMap[key] = true;
            });
        });

        setReviewLoadingMap(loadingMap);

        const resultMap = {};

        await Promise.all(
            deliveredOrders.map(async (order) => {
                try {
                    const res = await http.get(
                        "/frontend/martReview/my/order-reviews",
                        {
                            params: {
                                order_id: order?._id,
                            },
                        }
                    );

                    const reviews = Array.isArray(res?.data?.data)
                        ? res.data.data
                        : [];

                    reviews.forEach((review) => {
                        const productId =
                            review?.product_id?._id ||
                            review?.product_id;

                        if (!productId) return;

                        const key = getReviewKey(order?._id, productId);
                        resultMap[key] = review;
                    });
                } catch {
                    // keep empty result for this order
                }
            })
        );

        setReviewMap(resultMap);
        setReviewLoadingMap({});
    };

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

            const orderList = Array.isArray(res?.data?.data) ? res.data.data : [];

            setOrders(orderList);

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

            await loadOrderProductReviews(orderList);
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

    const openReviewModal = (order, item) => {
        const productID = item?.productID?._id || item?.productID;
        const key = getReviewKey(order?._id, productID);
        const existingReview = reviewMap[key] || null;

        const translatedProductName =
            productName(existingReview?.product_id, locale) ||
            productName(item?.product, locale) ||
            "Product";

        setReviewTarget({
            orderId: order?._id,
            orderNumber: order?.orderNumber,
            productID,
            product: translatedProductName,
            existingReview,
        });

        setReviewModalOpen(true);
    };

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
                    <h2 className="mb-4 text-xl font-bold tracking-tight text-gray-900">
                        {T.title}
                    </h2>

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
                                        `${item.sortBy}-${item.sortOrder}` === e.target.value
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
                                        <Fragment key={getOrderKey(o)}>
                                            <tr className="group text-sm transition-colors hover:bg-gray-50/50">
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

                                            {lower(o?.status) === "delivered" && (
                                                <tr>
                                                    <td colSpan={5} className="bg-gray-50/40 px-6 py-4">
                                                        <hr className="mb-4 border-gray-200" />

                                                        <div className="mb-3 flex items-center justify-between">
                                                            <p className="text-sm font-bold text-gray-900">
                                                                Add review of this product
                                                            </p>
                                                        </div>

                                                        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                                                            {(o?.items || []).map((item, index) => {
                                                                const productId = item?.productID?._id || item?.productID;

                                                                const reviewKey = getReviewKey(o?._id, productId);
                                                                const existingReview = reviewMap[reviewKey];
                                                                const isReviewLoading = reviewLoadingMap[reviewKey];

                                                                const displayProductName =
                                                                    productName(existingReview?.product_id, locale) ||
                                                                    productName(item?.product, locale) ||
                                                                    "Product";

                                                                return (
                                                                    <div
                                                                        key={`${productId || index}-${index}`}
                                                                        className="border-b border-gray-100 p-4 last:border-b-0"
                                                                    >
                                                                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                                                            <div className="min-w-0 flex-1">
                                                                                <div className="flex flex-wrap items-center gap-2">
                                                                                    <p className="text-sm font-semibold text-gray-900">
                                                                                        {displayProductName}
                                                                                    </p>

                                                                                    {existingReview && (
                                                                                        <span
                                                                                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${existingReview?.approved
                                                                                                ? "bg-green-100 text-green-700"
                                                                                                : "bg-yellow-100 text-yellow-700"
                                                                                                }`}
                                                                                        >
                                                                                            {existingReview?.approved ? "Approved" : "Pending"}
                                                                                        </span>
                                                                                    )}
                                                                                </div>

                                                                                <p className="mt-1 text-xs text-gray-500">
                                                                                    Qty: {item?.qty || 1} · {money(item?.price)}
                                                                                </p>

                                                                                {isReviewLoading ? (
                                                                                    <div className="mt-2 text-xs text-gray-400">
                                                                                        Checking review...
                                                                                    </div>
                                                                                ) : existingReview ? (
                                                                                    <div className="mt-3">
                                                                                        <div className="flex items-center gap-1 text-sm text-yellow-500">
                                                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                                                <span key={star}>
                                                                                                    {existingReview?.rating >= star ? "★" : "☆"}
                                                                                                </span>
                                                                                            ))}
                                                                                        </div>

                                                                                        <p className="mt-1 text-sm text-gray-700">
                                                                                            {existingReview?.review}
                                                                                        </p>

                                                                                        <p className="mt-1 text-xs text-gray-500">
                                                                                            Status:{" "}
                                                                                            <span
                                                                                                className={
                                                                                                    existingReview?.approved
                                                                                                        ? "font-semibold text-green-600"
                                                                                                        : "font-semibold text-yellow-600"
                                                                                                }
                                                                                            >
                                                                                                {existingReview?.approved
                                                                                                    ? "Approved by admin"
                                                                                                    : "Waiting for admin approval"}
                                                                                            </span>
                                                                                        </p>
                                                                                    </div>
                                                                                ) : (
                                                                                    <p className="mt-2 text-xs text-gray-500">
                                                                                        You have not reviewed this product yet.
                                                                                    </p>
                                                                                )}
                                                                            </div>

                                                                            <div className="flex shrink-0 justify-start lg:justify-end lg:pt-0">
                                                                                <button
                                                                                    type="button"
                                                                                    disabled={!productId}
                                                                                    onClick={() => openReviewModal(o, item)}
                                                                                    className={`rounded-lg px-4 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 ${existingReview
                                                                                        ? "bg-blue-600 hover:bg-blue-700"
                                                                                        : "bg-gray-900 hover:bg-gray-800"
                                                                                        }`}
                                                                                >
                                                                                    {existingReview ? "Update Review" : "Add Review"}
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </Fragment>
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

            <ReviewModal
                open={reviewModalOpen}
                reviewTarget={reviewTarget}
                onClose={() => {
                    setReviewModalOpen(false);
                    setReviewTarget(null);
                }}
                onSubmitted={loadOrders}
            />
        </>
    );
}